import React, { useState } from 'react';

// PROPS:
// orders: App.js'den gelen canlı sipariş listesi
// onUpdateOrderStatus: Sipariş durumunu değiştiren fonksiyon (Hazırla / Teslim Et)
// onUpdateStock: Ürün stoğunu açıp kapatan fonksiyon
const AdminDashboard = ({ products, orders, onUpdateStock, onUpdateOrderStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' veya 'products' sekmeleri
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Kart içi ürün detayı için

  return (
    <div className="h-screen bg-gray-100 flex font-sans overflow-hidden text-gray-800">

      {/* --- SOL SIDEBAR (SABİT) --- */}
      <div className="w-64 bg-rose-900 text-white flex flex-col shadow-2xl h-screen sticky top-0 shrink-0">
        <div className="p-6 text-center border-b border-rose-800">
          <h1 className="text-2xl font-bold italic tracking-tighter">POINT CAFE</h1>
          <p className="text-xs text-rose-200 opacity-70">Yönetici Paneli v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3 text-xl">📋</span> Siparişler
            {orders && orders.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3 text-xl">📦</span> Ürün & Stok
          </button>
        </nav>

        <div className="p-4 border-t border-rose-800 text-gray-200">
          <button onClick={onLogout} className="w-full flex items-center p-3 hover:text-white hover:bg-rose-800 rounded-xl transition">
            <span className="mr-3 text-xl">🚪</span> Çıkış Yap
          </button>
        </div>
      </div>

      {/* --- SAĞ İÇERİK ALANI --- */}
      <div className="flex-1 p-8 overflow-y-auto h-screen">

        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              Mutfak Ekranı
              <span className="ml-3 text-sm font-normal text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
                Teslim Saati Sıralı
              </span>
            </h2>

            {(!orders || orders.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                <span className="text-6xl block mb-2 text-gray-300">😴</span>
                <h3 className="text-xl font-bold text-gray-600">Bekleyen Sipariş Yok</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                  .sort((a, b) => (a.pickupTime || "").localeCompare(b.pickupTime || ""))
                  .map((order) => (
                    <div key={order.id} className={`bg-white rounded-2xl shadow-sm border-l-8 flex flex-col h-[440px] overflow-hidden relative transition-all ${order.status === 'Hazırlanıyor' ? 'border-yellow-400' :
                        order.status === 'Hazır' ? 'border-green-500' : 'border-gray-300'
                      }`}>

                      {/* --- KART ÜSTÜNE AÇILAN TÜM ÜRÜNLER PANELİ --- */}
                      {expandedOrderId === order.id && (
                        <div className="absolute inset-0 bg-white z-20 flex flex-col animate-in slide-in-from-bottom duration-300">
                          <div className="p-4 border-b bg-rose-50 flex justify-between items-center shrink-0">
                            <span className="font-bold text-rose-900 text-base">Tüm Ürünler ({order.items.length})</span>
                            <button
                              onClick={() => setExpandedOrderId(null)}
                              className="w-10 h-10 flex items-center justify-center bg-rose-200 text-rose-900 rounded-full font-bold hover:bg-rose-300 transition shadow-sm"
                            >✕</button>
                          </div>
                          <div className="p-4 overflow-y-auto flex-1 note-scrollbar">
                            <ul className="space-y-3">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between border-b border-gray-50 pb-2 text-base font-bold text-gray-800">
                                  <span>{item.quantity}x {item.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* 1. BAŞLIK (Senin orijinal status mantığın) */}
                      <div className="p-4 border-b bg-gray-50 flex justify-between items-start h-[80px] shrink-0">
                        <div>
                          <span className="block text-2xl font-black text-gray-800 leading-none">{order.pickupTime}</span>
                          <span className="text-sm text-gray-500 font-mono font-bold tracking-tight">#{order.id}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm border ${order.status === 'Hazırlanıyor' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'Hazırlanıyor_Basladi' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                              order.status === 'Hazır' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {order.status === 'Hazırlanıyor' ? 'SİPARİŞ ALINDI' :
                            order.status === 'Hazırlanıyor_Basladi' ? 'HAZIRLANIYOR' :
                              order.status === 'Hazır' ? 'HAZIR' : order.status.toUpperCase()}
                        </span>
                      </div>

                      {/* 2. ÜRÜNLER (Büyük Puntolu) */}
                      <div className="p-4 h-[110px] shrink-0 flex flex-col justify-start">
                        <ul className="space-y-1.5">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <li key={idx} className="flex justify-between text-gray-800 font-bold text-sm border-b border-dashed border-gray-100 pb-1 last:border-0 truncate">
                              <span>{item.quantity}x {item.name}</span>
                            </li>
                          ))}
                        </ul>
                        {order.items.length > 2 && (
                          <button
                            onClick={() => setExpandedOrderId(order.id)}
                            className="mt-auto text-[11px] text-rose-700 font-bold bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
                          >
                            ▼ +{order.items.length - 2} Ürün Daha (Göster)
                          </button>
                        )}
                      </div>

                      {/* 3. NOT ALANI (Zarif ve İnce Scrollbar) */}
                      <div className="px-4 h-[80px] shrink-0">
                        <div className="h-full bg-amber-50 border border-amber-100 rounded-xl p-3 overflow-y-auto note-scrollbar shadow-inner">
                          {order.note ? (
                            <p className="text-amber-950 italic leading-snug text-[13px] break-words">
                              <span className="font-bold not-italic border-b border-amber-200">📝 Not:</span> {order.note}
                            </p>
                          ) : (
                            <p className="text-gray-300 italic flex items-center h-full justify-center text-xs">Not eklenmemiş</p>
                          )}
                        </div>
                      </div>

                      {/* 4. ALT KISIM (Orijinal Button Mantığın) */}
                      <div className="mt-auto shrink-0 border-t border-gray-100 bg-gray-50">
                        <div className="px-4 py-1 text-right font-black text-gray-900 text-xl tracking-tight leading-none pt-2">
                          {order.totalAmount}₺
                        </div>
                        <div className="p-4 flex gap-2 h-[90px] items-center pt-0">
                          {order.status === 'Hazırlanıyor' && (
                            <button onClick={() => onUpdateOrderStatus(order.id, 'Hazırlanıyor_Basladi')} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-all active:scale-95">👨‍🍳 Hazırlamaya Başla</button>
                          )}
                          {order.status === 'Hazırlanıyor_Basladi' && (
                            <button onClick={() => onUpdateOrderStatus(order.id, 'Hazır')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-all active:scale-95">✅ Hazır</button>
                          )}
                          {order.status === 'Hazır' && (
                            <button onClick={() => onUpdateOrderStatus(order.id, 'Teslim Edildi')} className="flex-1 bg-gray-800 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-all active:scale-95">📦 Teslim Et</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* === STOK YÖNETİMİ === */}
        {activeTab === 'products' && (
          <div className="max-w-4xl mx-auto font-sans">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 font-sans">Menü & Stok Yönetimi</h2>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left font-sans">
                <tbody className="divide-y divide-gray-50 font-sans">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-2xl bg-gray-100 object-cover shadow-sm" />
                        <span className="font-bold text-gray-700 text-base">{product.name}</span>
                      </td>
                      <td className="p-5 font-black text-gray-900 text-lg">{product.price}₺</td>
                      <td className="p-5 text-right pr-8">
                        <button onClick={() => onUpdateStock(product.id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${product.stock !== 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {product.stock !== 0 ? '● SATIŞTA' : '○ TÜKENDİ'}
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

      {/* SAF CSS: ÖZELLİKLE NOT KISMI İÇİN İNCE VE RENKLİ SCROLLBAR */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .note-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .note-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .note-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d9b87e; 
          border-radius: 20px;
        }
        .note-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #bfa06b;
        }
        .note-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d9b87e transparent;
        }
      `}} />
    </div>
  );
};

export default AdminDashboard;