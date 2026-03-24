const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'pointcafe'
};

async function addImage(productName, imageUrl) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. Check if Image column exists
        const [columns] = await connection.execute("SHOW COLUMNS FROM PRODUCT LIKE 'Image'");
        if (columns.length === 0) {
            console.log("Image sütunu yok, oluşturuluyor...");
            await connection.execute("ALTER TABLE PRODUCT ADD COLUMN Image TEXT");
        }

        // 2. Update product
        const [result] = await connection.execute(
            "UPDATE PRODUCT SET Image = ? WHERE ProductName LIKE ?",
            [imageUrl, `%${productName}%`]
        );

        if (result.affectedRows > 0) {
            console.log(`✅ BAŞARILI: "${productName}" için resim güncellendi!`);
        } else {
            console.log(`❌ HATA: "${productName}" isminde ürün bulunamadı.`);
        }

    } catch (error) {
        console.error("Hata:", error);
    } finally {
        if (connection) await connection.end();
    }
}

// KULLANIM ÖRNEĞİ:
// node db/add_product_image.js "Ayvalık Tostu" "https://ornek.com/tost.jpg"

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Kullanım: node db/add_product_image.js <Ürün Adı> <Resim Linki>");
} else {
    addImage(args[0], args[1]);
}
