import db from '../point-backend/src/config/db.js';

async function migrate() {
    const connection = await db.getConnection();
    try {
        console.log("Checking and updating ORDERS table schema...");

        // 1. Add NOTE column
        try {
            await connection.execute("ALTER TABLE ORDERS ADD COLUMN Note TEXT");
            console.log("✅ 'Note' column added.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ 'Note' column already exists.");
            else console.error("❌ Error adding Note:", err.message);
        }

        // 2. Add RATING column
        try {
            await connection.execute("ALTER TABLE ORDERS ADD COLUMN Rating INT DEFAULT 0");
            console.log("✅ 'Rating' column added.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ 'Rating' column already exists.");
            else console.error("❌ Error adding Rating:", err.message);
        }

        // 3. Add COMMENT column
        try {
            await connection.execute("ALTER TABLE ORDERS ADD COLUMN Comment TEXT");
            console.log("✅ 'Comment' column added.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log("ℹ️ 'Comment' column already exists.");
            else console.error("❌ Error adding Comment:", err.message);
        }

        console.log("Migration completed.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        connection.release();
        process.exit();
    }
}

migrate();
