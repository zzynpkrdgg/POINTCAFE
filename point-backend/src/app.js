import express from "express";
import cors from "cors";

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
  res.send(`
    <div style="text-align:center; margin-top:100px; font-family: Arial, sans-serif;">
      <h1 style="color: #2c3e50;">☕ PointCafe API'ye Hoş Geldiniz</h1>
      <p style="color: #7f8c8d;">Backend başarıyla çalışıyor ve veritabanına bağlı.</p>
      <div style="margin-top: 20px;">
        <a href="/api/products" style="text-decoration:none; background:#e67e22; color:white; padding:10px 20px; border-radius:5px; margin:5px;">Ürünleri Listele</a>
      </div>
    </div>
  `);
});

export default app;
