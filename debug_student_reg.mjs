import db from './point-backend/src/config/db.js';
import { registerUser } from './point-backend/src/services/auth.service.js';
import dotenv from 'dotenv';
dotenv.config();

const testStudent = async () => {
    console.log("🚀 Testing Student Registration...");

    const mockUser = {
        userName: "Test",
        userSurname: "Student",
        email: `test_student_${Date.now()}@ankara.edu.tr`,
        password: "password123",
        phoneNumber: "5551234567"
    };

    try {
        console.log("Attempting to register:", mockUser.email);
        const result = await registerUser(mockUser);
        console.log("✅ Registration Successful!", result);
    } catch (error) {
        console.error("❌ Registration Failed!");
        console.error("Error Message:", error.message);
        console.error("Full Error:", error);
    } finally {
        process.exit();
    }
};

testStudent();
