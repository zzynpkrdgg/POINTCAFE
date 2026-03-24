const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '../.env');
console.log("📂 .env Yolu:", envPath);
console.log("📂 Dosya var mı?", fs.existsSync(envPath));

require('dotenv').config({ path: envPath });

console.log("🔑 DB_USER:", process.env.DB_USER);
console.log("🔑 DB_PASSWORD (Var mı?):", process.env.DB_PASSWORD ? "EVET" : "HAYIR");
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'pointcafe'
};

async function diagnose() {
    let connection;
    try {
        console.log("🔌 Veritabanına bağlanılıyor...");
        connection = await mysql.createConnection(dbConfig);
        console.log("✅ Bağlantı başarılı.");

        // 1. Tablo Kontrolleri
        const tables = ['USERS', 'owner', 'customer'];
        for (const table of tables) {
            try {
                await connection.execute(`SELECT 1 FROM ${table} LIMIT 1`);
                console.log(`✅ Tablo mevcut: ${table}`);
            } catch (err) {
                console.error(`❌ Tablo HATASI (${table}):`, err.message);
            }
        }

        // 2. Register Simülasyonu
        console.log("🔄 Register işlemi simüle ediliyor...");
        const testUser = {
            UserName: 'Test',
            UserSurname: 'User',
            Email: 'test_' + Date.now() + '@example.com',
            Password: 'password123'
        };

        // 2.a Email Check
        const [existing] = await connection.execute("SELECT Email FROM USERS WHERE Email = ?", [testUser.Email]);
        if (existing.length > 0) console.log("⚠️ Email zaten var (beklenmedik).");

        // 2.b Insert User
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(testUser.Password, salt);

        console.log("📝 Kullanıcı ekleniyor...");
        const [res] = await connection.execute(
            "INSERT INTO USERS (UserName, UserSurname, Email, Password, PhoneNumber, Is_Deleted) VALUES (?, ?, ?, ?, ?, 0)",
            [testUser.UserName, testUser.UserSurname, testUser.Email, hashed, null]
        );
        const newId = res.insertId;
        console.log(`✅ Kullanıcı eklendi. ID: ${newId}`);

        // 2.c Insert Role
        console.log("🎭 Rol atanıyor (customer)...");
        await connection.execute("INSERT INTO customer (UserID) VALUES (?)", [newId]);
        console.log("✅ Rol atandı.");

        // 3. Temizlik
        console.log("🧹 Temizlik yapılıyor (Test kullanıcısı siliniyor)...");
        await connection.execute("DELETE FROM customer WHERE UserID = ?", [newId]);
        await connection.execute("DELETE FROM USERS WHERE UserID = ?", [newId]);
        console.log("✅ Temizlik tamamlandı.");

    } catch (error) {
        console.error("🚨 KRİTİK HATA:", error);
    } finally {
        if (connection) await connection.end();
    }
}

diagnose();
