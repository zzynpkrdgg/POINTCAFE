import mysql from 'mysql2/promise';

// Bilgileri doğrudan buraya yazıyoruz (Garanti çözüm)
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'yzm2025',
  database: 'point_cafe',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

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