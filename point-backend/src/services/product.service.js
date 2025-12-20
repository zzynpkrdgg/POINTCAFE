import db from "../config/db.js"; // Veri tabanı bağlantı dosyanın yolu

export const getAllProducts = async () => {
  try {
    // Tasarım raporundaki PRODUCT tablosundan tüm verileri çekiyoruz [cite: 282]
    const [rows] = await db.execute("SELECT * FROM PRODUCT");
    return rows;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    throw error;
  }
};

// Raporundaki 'Kategori' ihtiyacı için belirli kategorideki ürünleri getirme [cite: 99, 283]
export const getProductsByCategory = async (categoryId) => {
  try {
    const [rows] = await db.execute("SELECT * FROM PRODUCT WHERE CategoryID = ?", [categoryId]);
    return rows;
  } catch (error) {
    throw error;
  }
};