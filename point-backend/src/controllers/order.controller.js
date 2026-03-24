import { createOrder, getOrdersService, updateOrderStatusService } from "../services/order.service.js";

// Sipariş Ekleme
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

// 2. Siparişleri Getirme 
export const getOrders = async (req, res) => {
  try {
    const email = req.query.email;
    const orders = await getOrdersService(email);
    res.json({ success: true, orders: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Sipariş Durumu Güncelleme 
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rating, comment } = req.body;
    await updateOrderStatusService(id, status, rating, comment);
    res.json({ success: true, message: "Sipariş durumu güncellendi" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};