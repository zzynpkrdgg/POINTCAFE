import db from "../config/db.js";

export const getAllProducts = async () => {
  try {
    // Sütun isimlerini frontend'in beklediği isimlere (name, price) çeviriyoruz
    const [rows] = await db.execute(
      "SELECT ProductID as id, ProductName as name, ProductPrice as price, TotalStock as stock FROM PRODUCT"
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
      "SELECT ProductID as id, ProductName as name, ProductPrice as price, TotalStock as stock FROM PRODUCT WHERE CategoryID = ?", 
      [categoryId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};