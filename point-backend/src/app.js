import express from "express";
import cors from "cors";
import db from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send("☕ PointCafe API çalışıyor");
});

export async function initApp() {
  try {
    console.log("🔍 Veritabanı test ediliyor...");
    await db.query("SELECT 1");
    console.log("✅ Veritabanı hazır");
    return app;
  } catch (err) {
    console.error("❌ Veritabanı hatası:", err.message);
    process.exit(1);
  }
}

export default app;
