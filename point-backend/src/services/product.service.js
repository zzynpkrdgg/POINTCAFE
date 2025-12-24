import db from "../config/db.js";

export const getAllProducts = async () => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        p.ProductID, 
        p.ProductID as id, 
        p.CategoryID,
        p.ProductName as name, 
        p.ProductPrice as price, 
        p.TotalStock, 
        c.CategoryName as category 
       FROM PRODUCT p 
       JOIN CATEGORY c ON p.CategoryID = c.CategoryID`
    );
    return rows;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        p.ProductID, 
        p.ProductID as id, 
        p.CategoryID,
        p.ProductName as name, 
        p.ProductPrice as price, 
        p.TotalStock, 
        c.CategoryName as category 
       FROM PRODUCT p 
       JOIN CATEGORY c ON p.CategoryID = c.CategoryID
       WHERE p.CategoryID = ?`,
      [categoryId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateStock = async (productId, newStock) => {
  try {
    const [result] = await db.execute(
      "UPDATE PRODUCT SET TotalStock = ? WHERE ProductID = ?",
      [newStock, productId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Stok güncelleme hatası:", error);
    throw error;
  }
};