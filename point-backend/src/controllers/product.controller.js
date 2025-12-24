import { getAllProducts, updateStock } from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    // 4. Hata durumunda konsola detay yazdır (Hangi parametrenin undefined olduğunu görmek için)
    console.error("getProducts Hatası:", error.message);
    res.status(500).json({ message: "Ürünler yüklenirken bir hata oluştu." });
  }
};

export const updateProductStock = async (req, res) => {
  const { id } = req.params;
  const { newStock } = req.body;

  try {
    const success = await updateStock(id, newStock);
    if (success) {
      res.json({ success: true, message: "Stok güncellendi." });
    } else {
      res.status(404).json({ success: false, message: "Ürün bulunamadı." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Stok güncellenemedi." });
  }
};
