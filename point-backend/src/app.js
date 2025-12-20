import express from "express";
import cors from "cors";
import db from "./config/db.js"; // Veritabanı bağlantı havuzu

// Rotaları içeri aktarma
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

// Middleware yapılandırması
app.use(cors());
app.use(express.json());

// API Rotaları
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

/**
 * 🛠 VERİTABANI YÖNETİCİSİ TEST FONKSİYONU
 * Senin hazırladığın tüm mantığı ve stok gösterimlerini korur.
 */
async function testDatabaseConnection() {
    try {
        console.log("-----------------------------------------");
        console.log("🔍 Veritabanı bağlantısı test ediliyor...");
        
        // Product tablosundan ilk 5 ürünü çekmeyi dener
        const [rows] = await db.query('SELECT * FROM product LIMIT 5'); 
        
        rows.forEach(product => {
            const stokGosterimi = product.TotalStock === -1 ? "♾️ Sonsuz" : product.TotalStock;
            console.log(`📦 Ürün: ${product.ProductName} - Stok: ${stokGosterimi}`);
        });

        console.log("-----------------------------------------");
        console.log("✅ Veritabanı bağlantısı BAŞARILI.");
        console.log(`Bağlantı kuruldu ve ${rows.length} ürün bulundu.`);
        
        if (rows.length === 0) {
             console.log("ℹ️ Product tablosunda henüz veri yok.");
        }
        console.log("-----------------------------------------");
        return true;

    } catch (error) {
        console.error("❌ Veritabanı Bağlantısı VEYA Sorgu BAŞARISIZ OLDU!");
        console.error("Hata Detayı:", error.message);
        return false;
    }
}

// Ana sayfa tasarımı
app.get("/", (req, res) => { 
  res.send(`
    <div style="text-align:center; margin-top:100px; font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50;">☕ PointCafe API'ye Hoş Geldiniz</h1>
      <p style="color: #7f8c8d;">Backend başarıyla çalışıyor ve veritabanına bağlı.</p>
      <div style="margin-top: 20px;">
        <a href="/api/products" style="text-decoration:none; background:#e67e22; color:white; padding:10px 20px; border-radius:5px; margin:5px;">Ürünleri Listele</a>
      </div>
    </div>
  `);
});

/**
 * 🚀 UYGULAMAYI BAŞLAT
 * Önce veritabanını test eder, sonra Express sunucusunu dışa aktarır veya başlatır.
 */
testDatabaseConnection().then(isReady => {
    if (isReady) {
        console.log("🚀 Sunucu hazır ve rotalar yüklendi.");
    } else {
        console.error("🛑 Uygulama veritabanı hatası nedeniyle kısıtlı modda.");
    }
});

export default app;
export default app;
