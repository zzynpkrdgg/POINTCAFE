import db from "../config/db.js";

export const createOrder = async (orderData) => {
  // Postman'den gelen verileri alırken isimlerin tam eşleştiğinden emin oluyoruz
  // Eğer veri gelmezse (undefined ise) hata vermemesi için || null ekliyoruz
  const UserID = orderData.UserID || null;
  const Total_Price = orderData.Total_Price || 0;
  const OrderStatus = orderData.OrderStatus || 'Hazırlanıyor';
  
  try {
    const [result] = await db.execute(
      "INSERT INTO ORDERS (UserID, OrderTime, Total_Price, OrderStatus, CreatedAt) VALUES (?, CURTIME(), ?, ?, NOW())",
      [UserID, Total_Price, OrderStatus]
    );

    return { OrderID: result.insertId, ...orderData };
  } catch (error) {
    console.error("Sipariş oluşturma hatası:", error);
    throw error;
  }
};