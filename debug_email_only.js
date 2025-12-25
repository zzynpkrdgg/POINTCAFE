
import db from "./point-backend/src/config/db.js";

async function getEmail() {
    try {
        const [rows] = await db.execute(`
      SELECT u.Email 
      FROM owner o 
      JOIN USERS u ON o.UserID = u.UserID
      LIMIT 1
    `);
        if (rows.length > 0) {
            console.log("FOUND_EMAIL:" + rows[0].Email);
        } else {
            console.log("NO_OWNER_FOUND");
        }
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}

getEmail();
