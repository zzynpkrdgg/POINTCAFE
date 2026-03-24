import mysql from 'mysql2/promise';

async function alterDb() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'yzm2025',
        database: 'point_cafe'
    });

    try {
        // Rating column
        await connection.query('ALTER TABLE ORDERS ADD COLUMN Rating INT NULL;');
        console.log("Rating column added.");
    } catch (e) { console.log(e.message); }

    try {
        // Comment column
        await connection.query('ALTER TABLE ORDERS ADD COLUMN Comment TEXT NULL;');
        console.log("Comment column added.");
    } catch (e) { console.log(e.message); }

    await connection.end();
}

alterDb();
