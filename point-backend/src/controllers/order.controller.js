import { createOrder } from "../services/order.service.js";

export const addOrder = async (req, res) => {
  try {
    const newOrder = await createOrder(req.body);
    res.status(201).json({
      success: true,
      message: "Sipariş başarıyla oluşturuldu",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Sipariş oluşturulamadı: " + error.message
    });
  }
};

// Hata almamak için şimdilik bunları da ekleyelim
export const getOrders = async (req, res) => {
    res.json({ message: "Sipariş listeleme henüz hazır değil" });
};

export const updateOrderStatus = async (req, res) => {
    res.json({ message: "Sipariş güncelleme henüz hazır değil" });
};