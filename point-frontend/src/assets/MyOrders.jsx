import React from 'react';

// PROPS:
// - orders: Sipariş Listesi (Array)
// - onViewDetails: Detay butonuna basılınca çalışacak fonksiyon (ID gönderir)
function MyOrders({ orders, onViewDetails }) {

  // EĞER SİPARİŞ LİSTESİ BOŞSA:
  if (!orders || orders.length === 0) {
    return (
      <div className="h-full min-h-[180px] p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">🧾</span>
        <h3 className="font-bold text-gray-600">Siparişlerin</h3>
        <p className="text-sm text-center">Şu an aktif bir siparişin bulunmuyor.</p>
      </div>
    );
  }

  // EĞER SİPARİŞ VARSA LİSTELE (Scroll edilebilir alan):
  return (
    <div className="h-full max-h-[400px] overflow-y-auto pr-1 space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="p-5 bg-white rounded-xl shadow-md border-l-4 border-rose-500 relative group transition hover:shadow-lg">
          
          {/* Üst Kısım */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                Sipariş #{order.id}
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </h2>
              <p className="text-xs text-rose-600 font-semibold">{order.status}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-xs mb-1">
                ⏰ {order.pickupTime}
              </div>
            </div>
          </div>

          {/* İlerleme Çubuğu */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
            <div className="bg-rose-500 h-1.5 rounded-full w-[60%]"></div>
          </div>

          {/* Alt Kısım ve Buton */}
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">{order.totalAmount}₺</span>
            <button 
              onClick={() => onViewDetails(order)} // Tıklanınca o siparişi aç
              className="text-xs font-bold text-white bg-rose-900 px-3 py-1.5 rounded-lg hover:bg-rose-800 transition"
            >
              Detay
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;