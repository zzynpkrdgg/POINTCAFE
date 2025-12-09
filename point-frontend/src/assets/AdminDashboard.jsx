import React, { useState } from 'react';

// PROPS:
// orders: App.js'den gelen canlı sipariş listesi
// onUpdateOrderStatus: Sipariş durumunu değiştiren fonksiyon (Hazırla / Teslim Et)
// onUpdateStock: Ürün stoğunu açıp kapatan fonksiyon
const AdminDashboard = ({ products, orders, onUpdateStock, onUpdateOrderStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' veya 'products' sekmeleri

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* --- SOL SIDEBAR (MENÜ) --- */}
      <div className="w-64 bg-rose-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-center border-b border-rose-800">
          <h1 className="text-2xl font-bold">YÖNETİCİ</h1>
          <p className="text-xs text-rose-200 opacity-70">Point Cafe Panel v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {/* Siparişler Sekmesi */}
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3">📋</span> Siparişler
            {/* Canlı Sipariş Sayısı Bildirimi */}
            {orders && orders.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {orders.length}
              </span>
            )}
          </button>

          {/* Ürün & Stok Sekmesi */}
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3">📦</span> Ürün & Stok
          </button>
        </nav>

        <div className="p-4 border-t border-rose-800">
          <button onClick={onLogout} className="w-full flex items-center p-3 text-rose-200 hover:text-white hover:bg-rose-800 rounded-xl transition">
            <span className="mr-3">🚪</span> Çıkış Yap
          </button>
        </div>
      </div>

      {/* --- SAĞ İÇERİK ALANI --- */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* === SİPARİŞ YÖNETİMİ === */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              Mutfak Ekranı 
              <span className="ml-3 text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border">
                Teslim Saati Sıralı
              </span>
            </h2>

            {/* Sipariş Listesi Kontrolü */}
            {(!orders || orders.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <span className="text-6xl">😴</span>
                <h3 className="text-xl font-bold text-gray-600 mt-4">Bekleyen Sipariş Yok</h3>
                <p className="text-gray-400">Şu an mutfak sakin.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                  // RAPOR GEREKSİNİMİ: Siparişleri 'Teslim Saatine' göre sıralıyoruz.
                  // 09:45 siparişi 10:30 siparişinden önce görünür.
                  .sort((a, b) => (a.pickupTime || "").localeCompare(b.pickupTime || "")) 
                  .map((order) => (
                  <div key={order.id} className={`bg-white rounded-2xl shadow-sm border-l-8 overflow-hidden relative ${
                    order.status === 'Hazırlanıyor' ? 'border-yellow-400' : 
                    order.status === 'Hazır' ? 'border-green-500' : 'border-gray-300'
                  }`}>
                    {/* Kart Başlığı: Saat ve ID */}
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-start">
                      <div>
                        <span className="block text-2xl font-black text-gray-800">{order.pickupTime}</span>
                        <span className="text-sm text-gray-500">#{order.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-800 animate-pulse' : 'bg-green-100 text-green-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Ürün Detayları */}
                    <div className="p-4">
                      <ul className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-gray-700 font-medium border-b border-dashed pb-1 last:border-0">
                            <span>{item.quantity}x {item.name}</span>
                          </li>
                        ))}
                      </ul>
                      {/* Varsa Sipariş Notu */}
                      {order.note && (
                        <div className="bg-yellow-50 text-yellow-800 text-sm p-2 rounded mb-4 border border-yellow-100 italic">
                          "{order.note}"
                        </div>
                      )}
                      <div className="mt-2 text-right font-bold text-gray-800">
                        Toplam: {order.totalAmount}₺
                      </div>
                    </div>

                    {/* Aksiyon Butonları (Durum Değiştirme) */}
                    <div className="p-4 bg-gray-50 flex gap-2">
                      {order.status === 'Hazırlanıyor' && (
                         <button 
                           onClick={() => onUpdateOrderStatus(order.id, 'Hazır')}
                           className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-200"
                         >
                           ✅ Hazırla
                         </button>
                      )}
                      
                      {order.status === 'Hazır' && (
                         <button 
                           onClick={() => onUpdateOrderStatus(order.id, 'Teslim Edildi')}
                           className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-xl transition"
                         >
                           📦 Teslim Et
                         </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === STOK YÖNETİMİ === */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Menü ve Stok Yönetimi</h2>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600">Ürün</th>
                      <th className="p-4 font-semibold text-gray-600">Fiyat</th>
                      <th className="p-4 font-semibold text-gray-600">Stok</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="p-4 flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-full bg-gray-200 object-cover"/>
                          <span>{product.name}</span>
                        </td>
                        <td className="p-4 font-bold">{product.price}₺</td>
                        <td className="p-4">
                           {/* Stok Açma/Kapama Butonu */}
                           <button 
                              onClick={() => onUpdateStock(product.id)}
                              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${product.inStock ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'}`}
                           >
                             {product.inStock ? 'Satışta (Kapat)' : 'Tükendi (Aç)'}
                           </button>
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