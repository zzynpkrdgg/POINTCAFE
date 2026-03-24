import { getAllProducts, updateStockService } from "../services/product.service.js";

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

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    await updateStockService(id, stock);
    res.json({ success: true, message: "Stok başarıyla güncellendi." });
  } catch (error) {
    console.error("updateStock Hatası:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
