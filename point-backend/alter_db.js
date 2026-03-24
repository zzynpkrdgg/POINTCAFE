import mysql from 'mysql2/promise';

async function alterDb() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'yzm2025',
        database: 'point_cafe'
    });

    try {
        // Note column
        await connection.query('ALTER TABLE ORDERS ADD COLUMN Note VARCHAR(255) NULL;');
        console.log("Note column added.");
    } catch (e) { console.log(e.message); }

    try {
        // PickupTime column
        await connection.query('ALTER TABLE ORDERS ADD COLUMN PickupTime VARCHAR(50) NULL;');
        console.log("PickupTime column added.");
    } catch (e) { console.log(e.message); }

    await connection.end();
}

alterDb();
