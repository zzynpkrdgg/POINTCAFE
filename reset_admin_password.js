
import db from "./point-backend/src/config/db.js";
import bcrypt from "bcrypt";

async function resetPassword() {
    try {
        const email = "admin@point.com";
        const newPassword = "Adminadmin1.";

        console.log(`Resetting password for ${email}...`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const [result] = await db.execute(
            "UPDATE USERS SET Password = ? WHERE Email = ?",
            [hashedPassword, email]
        );

        if (result.affectedRows > 0) {
            console.log("PASSWORD_RESET_SUCCESS");
        } else {
            console.log("USER_NOT_FOUND");
        }

    } catch (error) {
        console.error("Error resetting password:", error);
    } finally {
        process.exit();
    }
}

resetPassword();
