import mysql from 'mysql2/promise';

async function createTrigger() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'yzm2025',
        database: 'point_cafe'
    });

    const triggerSQL = `
    CREATE TRIGGER trg_reduce_stock_after_order
    AFTER INSERT ON ORDER_ITEM
    FOR EACH ROW
    BEGIN
        UPDATE PRODUCT 
        SET TotalStock = TotalStock - NEW.Quantity 
        WHERE ProductID = NEW.ProductID;
    END;
  `;

    try {
        await connection.query('DROP TRIGGER IF EXISTS trg_reduce_stock_after_order');
        await connection.query(triggerSQL);
        console.log("Trigger başarıyla oluşturuldu.");
    } catch (error) {
        console.error("Trigger oluşturulurken hata oluştu:", error);
    } finally {
        await connection.end();
    }
}

createTrigger();
