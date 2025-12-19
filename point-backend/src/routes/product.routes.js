import express from "express";
import { getProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/test", (req, res) => {
  res.json({ message: "product route çalışıyor" });
});

export default router;
