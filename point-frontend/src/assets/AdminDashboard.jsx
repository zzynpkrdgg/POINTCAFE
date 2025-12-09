import React, { useState } from 'react';

// AdminDashboard bileşeni: Yönetici ve Personel ekranıdır.
// PROPS AÇIKLAMASI:
// - products: App.js'den gelen güncel ürün listesi (Stok durumlarını görmek için).
// - onUpdateStock: App.js'deki stok değiştirme fonksiyonunu tetiklemek için.
// - onLogout: Çıkış yapıp Login ekranına dönmek için.
const AdminDashboard = ({ products, onUpdateStock, onLogout }) => {
  
  // Hangi sekmenin açık olduğunu tutan state (Siparişler mi? Ürünler mi?)
  const [activeTab, setActiveTab] = useState('orders'); 

  // --- MOCK DATA (SAHTE VERİ) ---
  // Backend henüz hazır olmadığı için, sanki veritabanından sipariş gelmiş gibi
  // manuel bir liste oluşturuyoruz. Sunumda "Backend bağlanınca burası API'den dolacak" denilecek.
  const [orders, setOrders] = useState([
    {
      id: 101,
      customer: "Fikret Kutluay",
      items: [{ name: "Filtre Kahve", qty: 1 }, { name: "Cheesecake", qty: 1 }],
      total: 140,
      pickupTime: "10:30", // KRİTİK: Rapordaki "Teslim Saati" özelliği
      status: "pending", // Durumlar: pending (bekliyor), preparing (hazırlanıyor), ready (hazır)
      note: "Kahve çok sıcak olsun."
    },
    {
      id: 102,
      customer: "Zeynep Karadağ",
      items: [{ name: "Tost", qty: 1 }, { name: "Çay", qty: 2 }],
      total: 110,
      pickupTime: "10:45",
      status: "preparing",
      note: ""
    },
    {
      id: 103,
      customer: "Mehmet Yılmaz",
      items: [{ name: "Latte", qty: 1 }],
      total: 60,
      pickupTime: "11:00",
      status: "pending",
      note: "Laktozsuz süt lütfen."
    }
  ]);

  // Siparişin durumunu (Bekliyor -> Hazırlanıyor -> Tamamlandı) değiştiren fonksiyon
  const handleStatusChange = (orderId, newStatus) => {
    // map() ile tüm siparişleri geziyoruz, ID'si eşleşeni bulup status'ünü güncelliyoruz.
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* --- SOL TARAFTAKİ MENÜ (SIDEBAR) --- */}
      <div className="w-64 bg-rose-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-center border-b border-rose-800">
          <h1 className="text-2xl font-bold">YÖNETİCİ</h1>
          <p className="text-xs text-rose-200 opacity-70">Point Cafe Panel v1.0</p>
        </div>
        
        {/* Navigasyon Butonları */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Siparişler Butonu */}
          <button 
            onClick={() => setActiveTab('orders')}
            // Eğer bu sekme aktifse arka planı beyaz yap, değilse şeffaf bırak
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3">📋</span> Aktif Siparişler
            
            {/* Bildirim Rozeti (Badge): Teslim edilmemiş sipariş sayısını gösterir */}
            {orders.filter(o => o.status !== 'delivered').length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {orders.filter(o => o.status !== 'delivered').length}
              </span>
            )}
          </button>

          {/* Ürün Yönetimi Butonu */}
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3">📦</span> Ürün & Stok
          </button>
        </nav>

        {/* Çıkış Yap Butonu */}
        <div className="p-4 border-t border-rose-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-rose-200 hover:text-white hover:bg-rose-800 rounded-xl transition"
          >
            <span className="mr-3">🚪</span> Çıkış Yap
          </button>
        </div>
      </div>

      {/* --- SAĞ TARAFTAKİ ANA İÇERİK ALANI --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* === SİPARİŞLER EKRANI === */}
        {/* Koşullu Renderlama: Sadece activeTab 'orders' ise burayı göster */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              Mutfak Ekranı 
              <span className="ml-3 text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border">
                Teslim Saati Sıralı
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders
                // SORT FONKSİYONU: Siparişleri saatine göre (Time) sıralar.
                // a.pickupTime (10:30) ile b.pickupTime (10:45) karşılaştırılır.
                .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime)) 
                .map((order) => (
                // Kart Rengi: Duruma göre border rengini değiştiriyoruz (Kırmızı: Yeni, Sarı: Hazırlanıyor)
                <div key={order.id} className={`bg-white rounded-2xl shadow-sm border-l-8 overflow-hidden relative ${
                  order.status === 'pending' ? 'border-red-500' : 
                  order.status === 'preparing' ? 'border-yellow-400' : 'border-green-500'
                }`}>
                  
                  {/* Kart Üst Bilgisi */}
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                    <div>
                      {/* Teslim Saati: Çalışanın en çok dikkat etmesi gereken yer */}
                      <span className="block text-2xl font-black text-gray-800">{order.pickupTime}</span>
                      <span className="text-sm text-gray-500">#{order.id} - {order.customer}</span>
                    </div>
                    {/* Yeni Sipariş İkonu */}
                    {order.status === 'pending' && <span className="animate-pulse text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">YENİ</span>}
                  </div>

                  {/* Sipariş İçeriği (Liste) */}
                  <div className="p-4">
                    <ul className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-gray-700 font-medium">
                          <span>{item.qty}x {item.name}</span>
                        </li>
                      ))}
                    </ul>
                    {/* Sipariş Notu Varsa Göster */}
                    {order.note && (
                      <div className="bg-yellow-50 text-yellow-800 text-sm p-2 rounded mb-4 border border-yellow-100">
                        📝 Not: {order.note}
                      </div>
                    )}
                  </div>

                  {/* Aksiyon Butonları: Duruma göre buton değişir */}
                  <div className="p-4 bg-gray-50 flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded-lg transition"
                      >
                        Hazırla 🍳
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
                      >
                        Tamamlandı ✅
                      </button>
                    )}
                    {order.status === 'ready' && (
                       <div className="flex-1 text-center font-bold text-green-600 py-2 border border-green-200 bg-green-50 rounded-lg">
                         Servise Hazır 🛎️
                       </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === STOK YÖNETİMİ EKRANI === */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Menü ve Stok Yönetimi</h2>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Ürün Adı</th>
                    <th className="p-4 font-semibold text-gray-600">Kategori</th>
                    <th className="p-4 font-semibold text-gray-600">Fiyat</th>
                    <th className="p-4 font-semibold text-gray-600">Stok Durumu</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Ürünleri App.js'den gelen props üzerinden listeliyoruz */}
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 rounded-full object-cover bg-gray-200"/>
                        <span className="font-medium text-gray-800">{product.name}</span>
                      </td>
                      <td className="p-4 text-gray-500">{product.category}</td>
                      <td className="p-4 text-gray-800 font-bold">{product.price}₺</td>
                      <td className="p-4">
                        
                        {/* Stok Aç/Kapa Anahtarı (Toggle Switch) */}
                        <button 
                          onClick={() => onUpdateStock(product.id)} // Tıklanınca App.js'deki fonksiyonu çalıştır
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.inStock ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        
                        <span className={`ml-3 text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
                          {product.inStock ? 'Stokta Var' : 'Tükendi'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;