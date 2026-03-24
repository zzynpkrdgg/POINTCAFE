import React, { useState } from 'react';
import ProductIcon from './ProductIcon';

// PROPS:
// orders: App.js'den gelen canlı sipariş listesi
// onUpdateOrderStatus: Sipariş durumunu değiştiren fonksiyon (Hazırla / Teslim Et)
// onUpdateStock: Ürün stoğunu açıp kapatan fonksiyon
const AdminDashboard = ({ products, orders, onUpdateStock, onUpdateStockCount, onUpdateOrderStatus, onLogout }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'delivered'
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Kart içi ürün detayı için
  const [stockSearchQuery, setStockSearchQuery] = useState(""); // Stok araması için state

  // Siparişleri Durumlarına Göre Ayır
  const activeOrdersList = orders ? orders.filter(o => ['Hazırlanıyor', 'Hazır'].includes(o.status)) : [];
  const deliveredOrdersList = orders ? orders.filter(o => ['Teslim Edildi', 'Tamamlandı'].includes(o.status)) : [];

  // Stok listesi filtreleme
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(stockSearchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 flex font-sans overflow-hidden text-gray-800">

      {/* --- SOL SIDEBAR (SABİT) --- */}
      <div className="w-64 bg-rose-900 text-white flex flex-col shadow-2xl h-screen sticky top-0 shrink-0">
        {/* ... (Sidebar içeriği aynı kalacak) ... */}
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
            {activeOrdersList.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {activeOrdersList.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3 text-xl">📦</span> Ürün & Stok
          </button>

          <button
            onClick={() => setActiveTab('delivered')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'delivered' ? 'bg-white text-rose-900 font-bold shadow-lg' : 'hover:bg-rose-800 text-rose-100'}`}
          >
            <span className="mr-3 text-xl">✅</span> Teslim Edilenler
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

            {activeOrdersList.length === 0 ? (
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
                              {order.items?.map((item, idx) => (
                                <li key={idx} className="flex justify-between border-b border-gray-50 pb-2 text-base font-bold text-gray-800">
                                  <span>{item.quantity}x {item.name}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* 1. BAŞLIK */}
                      <div className="p-5 flex justify-between items-start h-[90px] shrink-0">
                        <div>
                          <span className="block text-3xl font-black text-gray-800 leading-none mb-1">{order.pickupTime}</span>
                          <span className="text-sm text-gray-400 font-bold tracking-tight">#{order.id}</span>
                          <div className="mt-1 text-xs text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-md inline-block">
                            👤 {order.userName}
                          </div>
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

                      {/* 2. ÜRÜNLER LISTESI */}
                      <div className="px-5 h-[120px] shrink-0 flex flex-col justify-start">
                        <ul className="space-y-2">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex justify-between text-gray-800 font-bold text-base pb-1 truncate">
                              <span>{item.quantity}x {item.name}</span>
                            </li>
                          ))}
                        </ul>
                        {order.items.length > 2 && (
                          <button
                            onClick={() => setExpandedOrderId(order.id)}
                            className="mt-auto text-xs text-rose-700 font-bold hover:underline text-left"
                          >
                            ...ve {order.items.length - 3} ürün daha
                          </button>
                        )}
                      </div>

                      {/* 3. NOT ALANI (Sarı Yapışkan Not Stili) */}
                      <div className="px-5 py-2 grow flex flex-col justify-center">
                        {order.note ? (
                          <div className="bg-[#FFF9C4] p-3 rounded-lg shadow-sm border border-yellow-200 transform -rotate-1">
                            <p className="text-yellow-900 italic font-medium text-sm leading-snug">
                              "{order.note}"
                            </p>
                          </div>
                        ) : (
                          // Not yoksa boşluk
                          <div className="h-full"></div>
                        )}
                      </div>

                      {/* 4. ALT KISIM (Butonlar) */}
                      <div className="mt-auto shrink-0 pb-5 px-5">
                        <div className="text-right font-black text-gray-900 text-xl tracking-tight leading-none mb-4">
                          Toplam: {order.totalAmount}₺
                        </div>

                        <div className="flex gap-2">
                          {/* DURUMA GÖRE TEK BUTON GÖSTERİMİ */}

                          {/* Durum: Hazırlanıyor -> Görev: Hazırla (YEŞİL BUTON) */}
                          {order.status === 'Hazırlanıyor' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Hazır')}
                              className="w-full bg-[#22C55E] hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                            >
                              <span>✅</span> Hazırla
                            </button>
                          )}

                          {/* Durum: Hazır -> Görev: Teslim Et (KOYU BUTON) */}
                          {order.status === 'Hazır' && (
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'Teslim Edildi')}
                              className="w-full bg-[#0F172A] hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                            >
                              <span>📦</span> Teslim Et
                            </button>
                          )}

                          {/* Diğer durumlar için buton gerekirse buraya eklenir */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* === TESLİM EDİLENLER TABI === */}
        {activeTab === 'delivered' && (
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Teslim Edilen Siparişler</h2>

            {deliveredOrdersList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-500">Henüz teslim edilen sipariş yok.</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {deliveredOrdersList
                  .sort((a, b) => b.id - a.id)
                  .map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow">

                      {/* 1. Sol: Zaman ve ID */}
                      <div className="flex flex-col items-center justify-center w-24 border-r border-gray-100 pr-4 shrink-0">
                        <span className="text-2xl font-black text-gray-800 leading-none">{order.pickupTime}</span>
                        <span className="text-xs text-gray-400 font-bold mt-1">#{order.id}</span>
                        <span className="text-[10px] text-gray-500 font-bold mt-1 truncate max-w-full">{order.userName}</span>
                      </div>

                      {/* 2. Orta Sol: Ürün Listesi */}
                      <div className="flex-1 px-6">
                        <ul className="space-y-1">
                          {order.items?.map((item, idx) => (
                            <li key={idx} className="text-sm font-semibold text-gray-700">
                              {item.quantity}x {item.name}
                            </li>
                          ))}
                        </ul>
                        {order.note && (
                          <div className="mt-2 text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded inline-block">
                            Not: "{order.note}"
                          </div>
                        )}
                      </div>

                      {/* 3. Orta Sağ: Kullanıcı Değerlendirmesi */}
                      <div className="w-64 px-4 border-l border-gray-100 flex flex-col justify-center">
                        {order.rating ? (
                          <div className="text-left">
                            <div className="flex text-yellow-400 text-lg mb-1">
                              {'★'.repeat(order.rating)}{'☆'.repeat(5 - order.rating)}
                            </div>
                            {order.comment ? (
                              <p className="text-xs text-gray-600 italic line-clamp-2">"{order.comment}"</p>
                            ) : (
                              <span className="text-xs text-gray-400">Yorum yok</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 italic text-center block">Henüz değerlendirilmedi</span>
                        )}
                      </div>

                      {/* 4. Sağ: Fiyat ve Durum */}
                      <div className="flex flex-col items-end justify-center w-32 pl-4 border-l border-gray-100 shrink-0">
                        <div className="font-black text-gray-900 text-xl mb-1">{order.totalAmount}₺</div>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                          Teslim Edildi
                        </span>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-sans">Menü & Stok Yönetimi</h2>

              {/* Stok Arama Çubuğu */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Ürün Ara..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-900 text-sm shadow-sm"
                />
                <svg className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {stockSearchQuery && (
                  <button
                    onClick={() => setStockSearchQuery('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 font-bold text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

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