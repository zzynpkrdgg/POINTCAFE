
import db from "./point-backend/src/config/db.js";

async function checkUsers() {
    try {
        console.log("Checking USERS table...");
        const [users] = await db.execute("SELECT UserID, UserName, Email, Is_Deleted FROM USERS");
        console.log("Found users:", users);

        console.log("\nChecking OWNER table...");
        const [owners] = await db.execute("SELECT * FROM owner");
        console.log("Found owners:", owners);

        console.log("\nChecking CUSTOMER table...");
        const [customers] = await db.execute("SELECT * FROM customer");
        console.log("Found customers:", customers);

    } catch (error) {
        console.error("Error checking users:", error);
    } finally {
        process.exit();
    }
}

checkUsers();
