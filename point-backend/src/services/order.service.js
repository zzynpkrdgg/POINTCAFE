import mockOrders from "../data/mockOrders.js";
import mockProducts from "../data/mockProducts.js";

// Sabitler
const TAX_RATE = 0.10; // %10 KDV/Komisyon oranı

// Tüm siparişleri getir
export const getAllOrders = () => {
  return mockOrders;
};

// Yeni sipariş oluştur
export const createOrder = (orderData) => {
  
  // 1. BENZERSİZ ID ÜRETİMİ (4 Haneli #1000-#9999 arası)
  const generateUniqueId = () => {
    let newId;
    let isDuplicate = true;
    while (isDuplicate) {
      newId = Math.floor(1000 + Math.random() * 9000);
      isDuplicate = mockOrders.some(order => order.id === newId);
    }
    return newId;
  };

  // 2. ÜRÜN BİLGİLERİNİ EŞLEŞTİR (Frontend'den gelen ID'lere göre isim ve fiyat atar)
  const itemsWithDetails = orderData.items.map(cartItem => {
    // ID tipini garantiye almak için Number() kullanıyoruz
    const product = mockProducts.find(p => p.id === Number(cartItem.id));
    
    return {
      id: cartItem.id,
      quantity: Number(cartItem.quantity),
      name: product ? product.name : "Bilinmeyen Ürün",
      price: product ? product.price : 0
    };
  });

  // 3. GÜVENLİ HESAPLAMA (Backend'deki fiyatlar üzerinden)
  const subTotal = itemsWithDetails.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // KDV hesaplama ve son tutar (Ara Toplam + (Ara Toplam * 0.10))
  const taxAmount = subTotal * TAX_RATE;
  const finalAmount = (subTotal + taxAmount).toFixed(2);

  // 4. SİPARİŞİ OLUŞTUR VE KAYDET
  const newOrder = {
    ...orderData, // userName, pickupTime, note vb. verileri korur
    id: generateUniqueId(),
    items: itemsWithDetails, // İçinde isim ve fiyat olan zenginleştirilmiş liste
    totalAmount: finalAmount, 
    status: "Hazırlanıyor",
    createdAt: new Date().toISOString()
  };
  
  mockOrders.push(newOrder);
  return newOrder;
};

// Sipariş durumunu güncelle (Admin Paneli veya Teslimat için)
export const updateStatus = (orderId, newStatus, rating = null, comment = null) => {
  // ID'nin sayı olduğundan emin oluyoruz
  const index = mockOrders.findIndex(o => o.id === Number(orderId));
  
  if (index !== -1) {
    mockOrders[index].status = newStatus;
    
    // Eğer değerlendirme/yorum geldiyse ekle
    if (rating !== null) mockOrders[index].rating = rating;
    if (comment !== null) mockOrders[index].comment = comment;
    
    return mockOrders[index];
  }
  return null;
};