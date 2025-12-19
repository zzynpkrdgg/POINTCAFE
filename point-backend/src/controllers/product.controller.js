import { getAllProducts } from "../services/product.service.js";

export const getProducts = (req, res) => {
  const products = getAllProducts();
  res.status(200).json(products);
};
