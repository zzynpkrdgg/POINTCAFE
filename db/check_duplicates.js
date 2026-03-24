import db from "../point-backend/src/config/db.js";

async function checkDuplicates() {
    try {
        console.log("🔍 Ürünler kontrol ediliyor...");

        // 1. Tüm ürünleri çek
        const [rows] = await db.execute(`
      SELECT p.ProductID, p.ProductName, c.CategoryName 
      FROM PRODUCT p 
      JOIN CATEGORY c ON p.CategoryID = c.CategoryID
      ORDER BY p.ProductName
    `);

        console.log(`\nToplam ${rows.length} ürün bulundu.\n`);

        // 2. Tekrar edenleri bul
        const counts = {};
        rows.forEach(r => {
            const key = `${r.ProductName} (${r.CategoryName})`;
            counts[key] = (counts[key] || 0) + 1;
        });

        const duplicates = Object.entries(counts).filter(([key, count]) => count > 1);

        if (duplicates.length > 0) {
            console.log("⚠️ TEKRAR EDEN ÜRÜNLER BULUNDU:");
            duplicates.forEach(([key, count]) => {
                console.log(`- ${key}: ${count} adet`);
            });

            // Detaylı listeleme
            console.log("\nDetaylar:");
            rows.filter(r => duplicates.some(d => d[0].startsWith(r.ProductName))).forEach(r => {
                console.log(`ID: ${r.ProductID} - Ad: ${r.ProductName} - Kat: ${r.CategoryName}`);
            });

        } else {
            console.log("✅ Veritabanında isim tekrarı yok. Her ürün tek.");
        }

        // 3. Kategori tablosunu kontrol et
        const [cats] = await db.execute("SELECT * FROM CATEGORY");
        console.log("\nKategoriler:", cats.map(c => `${c.CategoryID}:${c.CategoryName}`).join(", "));

    } catch (err) {
        console.error("Hata:", err.message);
    } finally {
        process.exit();
    }
}

checkDuplicates();
