import mysql from 'mysql2/promise'; // Backend'in tercih ettiği modern yazım
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
  // Senin önceliğin olan .env bilgileri, yoksa backend'in yazdığı sabit bilgiler
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yzm2025', 
  database: process.env.DB_DATABASE || 'point_cafe',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Senin yazdığın bağlantı test fonksiyonu (Tüm logları koruyoruz)
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL Veri Tabanına Başarıyla Bağlanıldı!');
    connection.release();
  } catch (err) {
    console.error('❌ Veri tabanı bağlantı hatası:', err.message);
  }
};

testConnection();

export default db;
