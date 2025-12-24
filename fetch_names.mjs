import db from './point-backend/src/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const fetchProductNames = async () => {
    try {
        const [rows] = await db.execute("SELECT ProductName, CategoryID FROM PRODUCT");
        console.log(JSON.stringify(rows, null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fetchProductNames();
