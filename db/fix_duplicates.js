import db from "../point-backend/src/config/db.js";

async function fixDuplicates() {
    try {
        console.log("🧹 Tekrar eden ürünler temizleniyor...");

        // 1. Tüm ürünleri çek
        const [products] = await db.execute("SELECT ProductID, ProductName, CategoryID FROM PRODUCT ORDER BY ProductID");

        // 2. Gruplandır (Ad ve Kategoriye göre)
        const groups = {};
        products.forEach(p => {
            const key = `${p.ProductName.trim().toLowerCase()}_${p.CategoryID}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(p.ProductID);
        });

        let deletedCount = 0;

        // 3. Her grubu işle
        for (const key in groups) {
            const ids = groups[key];
            if (ids.length > 1) {
                // İlk ID'yi (en eski) ana ürün kabul et
                const masterId = ids[0];
                const duplicates = ids.slice(1);

                console.log(`\nBulundu: ${key} -> Ana ID: ${masterId}, Silinecekler: ${duplicates.join(', ')}`);

                for (const dupId of duplicates) {
                    // A. Siparişleri Ana ID'ye kaydır (Varsa)
                    // Try/Catch kullanıyoruz çünkü FOREIGN KEY hatalarını önlemek istiyoruz
                    try {
                        await db.execute("UPDATE ORDER_ITEM SET ProductID = ? WHERE ProductID = ?", [masterId, dupId]);
                    } catch (err) {
                        console.log(`   ⚠️ Sipariş güncellenemedi (${dupId} -> ${masterId}): ${err.message}`);
                    }

                    // B. Ürünü Sil
                    try {
                        await db.execute("DELETE FROM PRODUCT WHERE ProductID = ?", [dupId]);
                        console.log(`   ✅ Silindi: ${dupId}`);
                        deletedCount++;
                    } catch (err) {
                        console.error(`   ❌ Silinemedi ${dupId}: ${err.message}`);
                    }
                }
            }
        }

        console.log(`\n🏁 İşlem Tamamlandı. Toplam ${deletedCount} tekrar eden ürün silindi.`);

    } catch (err) {
        console.error("Genel Hata:", err);
    } finally {
        process.exit();
    }
}

fixDuplicates();
