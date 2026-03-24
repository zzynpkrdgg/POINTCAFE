
import db from "./point-backend/src/config/db.js";

async function findOwner() {
    try {
        const [owners] = await db.execute(`
      SELECT u.UserID, u.UserName, u.Email 
      FROM owner o 
      JOIN USERS u ON o.UserID = u.UserID
    `);
        console.log("OWNER INFO:", JSON.stringify(owners, null, 2));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

findOwner();
