import db from "../config/db.js";

export const createOrder = async (orderData) => {
  console.log("Frontend'den gelen veri:", orderData);

  // 1. Ana sipariş bilgilerini alıyoruz
  const UserID = orderData.UserID ?? null;
  const Total_Price = orderData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const OrderStatus = orderData.status || 'Hazırlanıyor';

  try {
    // A. Önce ORDERS tablosuna ana siparişi kaydediyoruz
    const [result] = await db.execute(
      "INSERT INTO ORDERS (UserID, Total_Price, OrderStatus, Note, PickupTime, CreatedAt) VALUES (?, ?, ?, ?, ?, NOW())",
      [UserID, Total_Price, OrderStatus, orderData.note || null, orderData.pickupTime || null]
    );
    // MySQL'in otomatik verdiği ID'yi alıyoruz
    const newOrderId = result.insertId;
    console.log("Oluşturulan Sipariş ID:", newOrderId);

    // B. SİPARİŞ KALEMLERİNİ (ORDER_ITEM) EKLEME: 
    // Trigger devrede olduğu için ORDER_ITEM tablosuna ekleme yapıldığında stok veritabanı tarafından otomatik düşürülecek.
    for (const item of orderData.items) {
      await db.execute(
        "INSERT INTO ORDER_ITEM (OrderID, ProductID, Quantity) VALUES (?, ?, ?)",
        [newOrderId, item.id, item.quantity]
      );
      console.log(`✅ Sipariş kalemi eklendi: ${item.name} - Miktar: ${item.quantity}`);
    }

    return { OrderID: result.insertId, totalAmount: Total_Price, ...orderData };
  } catch (error) {
    await connection.rollback();
    console.error("❌ Sipariş Oluşturma Hatası:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};

export const getOrdersService = async (email) => {
  let query = `
    SELECT o.OrderID as id, o.OrderStatus as status, o.PickupTime as pickupTime, o.Note as note, o.Total_Price as totalAmount,
           u.UserName as userName, u.Email as userEmail
    FROM ORDERS o
    LEFT JOIN USERS u ON o.UserID = u.UserID
    ORDER BY o.CreatedAt DESC
  `;
  const [orders] = await db.execute(query);

  for (let order of orders) {
    const [items] = await db.execute(`
      SELECT oi.Quantity as quantity, p.ProductName as name, p.ProductID as id, p.ProductPrice as price
      FROM ORDER_ITEM oi
      JOIN PRODUCT p ON oi.ProductID = p.ProductID
      WHERE oi.OrderID = ?
    `, [order.id]);
    order.items = items;
  }

  if (email && email !== 'undefined') {
    return orders.filter(o => o.userEmail === email);
  }
  return orders;
};

export const updateOrderStatusService = async (orderId, status, rating, comment) => {
  if (rating !== undefined && comment !== undefined) {
    await db.execute("UPDATE ORDERS SET OrderStatus = ?, Rating = ?, Comment = ? WHERE OrderID = ?", [status, rating, comment, orderId]);
  } else {
    await db.execute("UPDATE ORDERS SET OrderStatus = ? WHERE OrderID = ?", [status, orderId]);
  }
  return { success: true };
};