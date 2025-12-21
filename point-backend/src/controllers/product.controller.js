import { getAllProducts } from "../services/product.service.js";

export const getProducts = async(req, res) => {
  try{
  const products = await getAllProducts();
  res.status(200).json(products);
} catch (error) {
  // 4. Hata durumunda konsola detay yazdır (Hangi parametrenin undefined olduğunu görmek için)
  console.error("getProducts Hatası:", error.message);
  res.status(500).json({ message: "Ürünler yüklenirken bir hata oluştu." });
}
};
