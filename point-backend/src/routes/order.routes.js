// src/routes/order.routes.js
import express from "express";
import { getOrders, addOrder, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", getOrders);           // GET /api/orders
router.post("/", addOrder);          // POST /api/orders
router.patch("/:id", updateOrderStatus); // PATCH /api/orders/:id

export default router;