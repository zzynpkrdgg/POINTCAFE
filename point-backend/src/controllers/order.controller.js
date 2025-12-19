// src/controllers/order.controller.js
import * as orderService from "../services/order.service.js";

export const getOrders = (req, res) => {
  const { email } = req.query; 
  let orders = orderService.getAllOrders();

  if (email) {
    orders = orders.filter(order => order.userEmail === email);
  }

  res.json({ success: true, orders });
};

export const addOrder = (req, res) => {
  const newOrder = orderService.createOrder(req.body);
  res.status(201).json({ 
    success: true, 
    message: "Sipariş başarıyla alındı", 
    order: newOrder 
  });
};

export const updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status, rating, comment } = req.body; 
  
  // DEĞİŞİKLİK BURADA: rating ve comment'i doğrudan servise gönderiyoruz
  const updatedOrder = orderService.updateStatus(id, status, rating, comment);
  
  if (updatedOrder) {
    // Servis zaten rating ve comment'i ekleyip güncel objeyi döndürüyor
    res.json({ success: true, order: updatedOrder });
  } else {
    res.status(404).json({ success: false, message: "Sipariş bulunamadı" });
  }
};