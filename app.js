// Adım 1: Veritabanı bağlantı havuzunu (pool) içeri aktarın
const db = require('./config/db'); 

// Express veya diğer sunucu çatınız varsa buraya ekleyin (örnek olarak sadece test var)
console.log("Sunucu başlatılıyor...");

// Veritabanı bağlantısını test eden fonksiyon
async function testDatabaseConnection() {
    try {
        // Product tablosundan ilk 5 ürünü çekmeyi dener
        const [rows] = await db.query('SELECT * FROM product LIMIT 5'); 
        rows.forEach(product => {
            const stokGosterimi = product.TotalStock === -1 ? "♾️ Sonsuz" : product.TotalStock
            //buradaki console logu veritabanı doğru çalışıyor mu diye ekledim silinebilir sorun yok
            console.log(`Ürün: ${product.ProductName} - Stok: ${stokGosterimi}`);
        });
        console.log("-----------------------------------------");
        console.log("✅ Veritabanı bağlantısı BAŞARILI.");
        console.log(`Bağlantı kuruldu ve ${rows.length} ürün bulundu.`);
        if (rows.length > 0) {
            console.log(" İlk 5 Ürün (Kontrol):", rows);
        } else {
             console.log("ℹ️ Product tablosunda henüz veri yok. INSERT sorgularını çalıştırmanız gerekiyor.");
        }
        console.log("-----------------------------------------");

    } catch (error) {
        console.error(" Veritabanı Bağlantısı VEYA Sorgu BAŞARISIZ OLDU!");
        console.error("Hata Detayı:", error.message);
        console.error("Lütfen .env dosyasındaki DB_PASSWORD'un doğru olduğundan emin olun.");
        console.log("-----------------------------------------");
    }
}

// Uygulama başlatıldığında bağlantıyı test edin
testDatabaseConnection();

// Buraya Express sunucusunun başlatma kodu eklenebilir (örneğin app.listen(3000, ...))