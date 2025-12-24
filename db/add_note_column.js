import db from '../point-backend/src/config/db.js';

async function addNoteColumn() {
    try {
        console.log("Adding Note column to ORDERS table...");
        await db.execute("ALTER TABLE ORDERS ADD COLUMN Note TEXT");
        console.log("✅ Başarıyla eklendi.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("ℹ️ Note sütunu zaten var.");
        } else {
            console.error("❌ Hata:", err.message);
        }
    }
    process.exit();
}

addNoteColumn();
