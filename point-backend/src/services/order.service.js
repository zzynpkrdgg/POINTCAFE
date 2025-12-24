import db from "../config/db.js";

export const createOrder = async (orderData) => {
  console.log("Frontend'den gelen veri:", orderData);

  // 1. Ana sipariş bilgilerini hazırlıyoruz
  const UserID = orderData.UserID;
  // Fiyatı backend'de tekrar hesaplamak güvenlidir
  const Total_Price = orderData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const OrderStatus = orderData.status || 'Hazırlanıyor';
  // Frontend'den gelen teslim saatini alıyoruz, yoksa şu anki saati kullanıyoruz
  const OrderTime = orderData.pickupTime || new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // A. ORDERS tablosuna kayıt
    const [result] = await connection.execute(
      "INSERT INTO ORDERS (UserID, OrderTime, Total_Price, OrderStatus, Note, CreatedAt) VALUES (?, ?, ?, ?, ?, NOW())",
      [UserID, OrderTime, Total_Price, OrderStatus, orderData.note || '']
    );

    const newOrderId = result.insertId;
    console.log("Oluşturulan Sipariş ID:", newOrderId);

    // B. ORDER_ITEM Kaydı ve Stok Düşme
    for (const item of orderData.items) {
      // 1. İlişki tablosuna ekle
      await connection.execute(
        "INSERT INTO ORDER_ITEM (OrderID, ProductID, Quantity) VALUES (?, ?, ?)",
        [newOrderId, item.id, item.quantity]
      );

      // 2. Stoktan şimdilik düşmüyoruz, teslim edildiğinde düşeceğiz.
      // await connection.execute(
      //   "UPDATE PRODUCT SET TotalStock = TotalStock - ? WHERE ProductID = ?",
      //   [item.quantity, item.id]
      // );
    }

    await connection.commit();
    // Frontend'in beklediği 'totalAmount' alanını ekliyoruz
    return { OrderID: newOrderId, totalAmount: Total_Price, ...orderData };

  } catch (error) {
    await connection.rollback();
    console.error("❌ Sipariş Oluşturma Hatası:", error.message);
    throw error;
  } finally {
    connection.release();
  }
};