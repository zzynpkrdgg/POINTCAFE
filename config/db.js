const mysql = require('mysql2');
const dotenv = require('dotenv');

// .env dosyasındaki ortam değişkenlerini yükler
dotenv.config(); 

const connectionPool = mysql.createPool({
    // .env dosyasından okunan bağlantı bilgileri
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    
    // Bağlantı Havuzu (Pool) ayarları
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise tabanlı API'yi kullanmak için connectionPool'u dönüştürün
module.exports = connectionPool.promise();