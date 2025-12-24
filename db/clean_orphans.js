const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'pointcafe'
};

async function cleanOrphans() {
    let connection;
    try {
        console.log("🔌 Veritabanına bağlanılıyor...");
        connection = await mysql.createConnection(dbConfig);

        console.log("🧹 Yetim kayıtlar temizleniyor (FK Checks Disabled)...");

        // FK Kontrolünü geçici kapat
        await connection.query("SET FOREIGN_KEY_CHECKS=0");

        // 1. Customer tablosundaki yetim kayıtları sil
        const [custRes] = await connection.execute(
            "DELETE FROM customer WHERE UserID NOT IN (SELECT UserID FROM USERS)"
        );
        console.log(`✅ Silinen 'customer' kaydı: ${custRes.affectedRows}`);

        // 2. Owner tablosundaki yetim kayıtları sil
        const [ownRes] = await connection.execute(
            "DELETE FROM owner WHERE UserID NOT IN (SELECT UserID FROM USERS)"
        );
        console.log(`✅ Silinen 'owner' kaydı: ${ownRes.affectedRows}`);

        // 3. Order Item yetim kayıtlarını sil
        const [itemRes] = await connection.execute(
            "DELETE FROM ORDER_ITEM WHERE OrderID NOT IN (SELECT OrderID FROM ORDERS)"
        );
        console.log(`✅ Silinen 'ORDER_ITEM' kaydı: ${itemRes.affectedRows}`);

        // FK Kontrolünü aç
        await connection.query("SET FOREIGN_KEY_CHECKS=1");

    } catch (error) {
        console.error("❌ Hata:", error);
    } finally {
        if (connection) await connection.end();
    }
}

cleanOrphans();
