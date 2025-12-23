import db from "../config/db.js";

export const createOrder = async (orderData) => {
  console.log("Frontend'den gelen veri işleniyor...");

  // 1. Ana sipariş bilgilerini alıyoruz
  const UserID = orderData.UserID || 1; 
  const Total_Price = orderData.items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const OrderStatus = orderData.status || 'Hazırlanıyor';
  
  try {
    // A. Önce ORDERS tablosuna ana siparişi kaydediyoruz
    const [result] = await db.execute(
      "INSERT INTO ORDERS (UserID, OrderTime, Total_Price, OrderStatus, CreatedAt) VALUES (?, CURTIME(), ?, ?, NOW())",
      [UserID, Total_Price, OrderStatus]
    );

    // B. DİNAMİK STOK DÜŞÜRME: Sepetteki her ürün için döngü çalıştırıyoruz
    // Frontend'den gelen 'items' listesini geziyoruz
    for (const item of orderData.items) {
      await db.execute(
        "UPDATE PRODUCT SET TotalStock = TotalStock - ? WHERE ProductID = ?",
        [item.quantity, item.id] // Terminalde gördüğümüz 'quantity' ve 'id' değerlerini kullanıyoruz
      );
      console.log(`✅ Stok düşürüldü: ${item.name} - Miktar: ${item.quantity}`);
    }

    return { OrderID: result.insertId, ...orderData };
  } catch (error) {
    console.error("❌ Sipariş/Stok Hatası:", error.message);
    throw error;
  }
};