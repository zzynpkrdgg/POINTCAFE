import { createOrder } from "../services/order.service.js";
import db from "../config/db.js";

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
    const { email } = req.query;
    let query = `
      SELECT o.OrderID as id, o.OrderStatus as status, o.Total_Price as totalAmount, 
             DATE_FORMAT(o.OrderTime, '%H:%i') as pickupTime, o.OrderTime, 
             u.Email, u.UserName as userName, o.Note as note, o.Rating as rating, o.Comment as comment
      FROM ORDERS o
      JOIN USERS u ON o.UserID = u.UserID
    `;
    const params = [];
    if (email) {
      query += " WHERE u.Email = ?";
      params.push(email);
    }

    query += " ORDER BY o.CreatedAt DESC";

    const [orders] = await db.execute(query, params);

    // Her siparişin kalemlerini (items) çekip ekliyoruz
    for (const order of orders) {
      const [items] = await db.execute(`
        SELECT p.ProductName as name, oi.Quantity as quantity
        FROM ORDER_ITEM oi
        JOIN PRODUCT p ON oi.ProductID = p.ProductID
        WHERE oi.OrderID = ?
      `, [order.id]);

      order.items = items;
    }

    res.json({ success: true, orders: orders });
  } catch (error) {
    console.error("Siparişleri getirme hatası:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Sipariş Durumu Güncelleme 
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = id;
    const { status, rating, comment } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "Eksik parametre" });
    }

    // ÖNCE MEVCUT DURUMU BUL (Çift stok düşmeyi önlemek için)
    const [existing] = await db.execute("SELECT OrderStatus FROM ORDERS WHERE OrderID = ?", [orderId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Sipariş bulunamadı" });
    }
    const oldStatus = existing[0].OrderStatus;

    let query = "UPDATE ORDERS SET OrderStatus = ?";
    const params = [status];

    // Eğer puanlama gelmişse onları da güncelle
    if (rating !== undefined) {
      query += ", Rating = ?";
      params.push(rating);
    }
    if (comment !== undefined) {
      query += ", Comment = ?";
      params.push(comment);
    }

    query += " WHERE OrderID = ?";
    params.push(orderId);

    await db.execute(query, params);

    // EĞER SİPARİŞ "TESLİM EDİLDİ" OLARAK İŞARETLENİYORSA VE ESKİDEN DEĞİLSE STOKTAN DÜŞ
    if (status === 'Teslim Edildi' && oldStatus !== 'Teslim Edildi' && oldStatus !== 'Tamamlandı') {
      // 1. Sipariş kalemlerini bul
      const [items] = await db.execute("SELECT ProductID, Quantity FROM ORDER_ITEM WHERE OrderID = ?", [orderId]);

      // 2. Her kalem için stok güncelle
      for (const item of items) {
        await db.execute(
          "UPDATE PRODUCT SET TotalStock = TotalStock - ? WHERE ProductID = ?",
          [item.Quantity, item.ProductID]
        );
      }
    }

    // GÜNCELLENMİŞ SİPARİŞİ FRONTEND FORMATINDA ÇEK
    const queryNew = `
      SELECT o.OrderID as id, o.OrderStatus as status, o.Total_Price as totalAmount, 
             DATE_FORMAT(o.OrderTime, '%H:%i') as pickupTime, o.OrderTime, 
             u.Email, u.UserName as userName, o.Note as note, o.Rating as rating, o.Comment as comment
      FROM ORDERS o
      JOIN USERS u ON o.UserID = u.UserID
      WHERE o.OrderID = ?
    `;
    const [updatedOrders] = await db.execute(queryNew, [orderId]);
    const updatedOrder = updatedOrders[0];

    // Kalemlerini (items) de ekle
    const [items] = await db.execute(`
        SELECT p.ProductName as name, oi.Quantity as quantity
        FROM ORDER_ITEM oi
        JOIN PRODUCT p ON oi.ProductID = p.ProductID
        WHERE oi.OrderID = ?
      `, [orderId]);

    updatedOrder.items = items;

    res.json({ success: true, message: "Sipariş güncellendi", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};