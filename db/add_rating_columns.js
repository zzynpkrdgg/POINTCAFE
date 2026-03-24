import db from '../point-backend/src/config/db.js';

async function addRatingColumns() {
    try {
        console.log("Checking/Adding Rating and Comment columns to ORDERS table...");
        await db.execute("ALTER TABLE ORDERS ADD COLUMN Rating INT DEFAULT 0");
        await db.execute("ALTER TABLE ORDERS ADD COLUMN Comment TEXT");
        console.log("✅ Başarıyla eklendi.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("ℹ️ Sütunlar zaten var.");
        } else {
            console.error("❌ Hata:", err.message);
        }
    }
    process.exit();
}

addRatingColumns();
