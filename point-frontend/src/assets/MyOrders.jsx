import React from 'react';

// PROPS: onRate -> Puanla butonuna basınca çalışacak
function MyOrders({ orders, onViewDetails, onRate }) {

  if (!orders || orders.length === 0) {
    // ... (Boş durum aynı kalsın) ...
    return (
      <div className="h-full min-h-[180px] p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">🧾</span>
        <h3 className="font-bold text-gray-600">Siparişlerin</h3>
        <p className="text-sm text-center">Şu an aktif bir siparişin bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="h-full max-h-[400px] overflow-y-auto pr-1 space-y-4">
      {orders.map((order) => (
        <div key={order.id} className={`p-5 bg-white rounded-xl shadow-md border-l-4 relative group transition hover:shadow-lg ${order.status === 'Teslim Edildi' ? 'border-green-500 bg-green-50/30' : 'border-rose-500'}`}>
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                Sipariş #{order.id}
                {/* Duruma göre nokta rengi değişsin */}
                <span className={`w-2 h-2 rounded-full animate-pulse ${order.status === 'Teslim Edildi' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              </h2>
              <p className="text-xs text-gray-500 font-semibold">{order.status}</p>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-xs mb-1">
                ⏰ {order.pickupTime}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-gray-800">{order.totalAmount}₺</span>
            
            {/* EĞER TESLİM EDİLDİYSE PUANLA BUTONU, YOKSA DETAY BUTONU */}
            {order.status === 'Teslim Edildi' ? (
               <button 
                 onClick={() => onRate(order)} 
                 className="text-xs font-bold text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-md animate-bounce-short"
               >
                 ⭐ Puanla
               </button>
            ) : (
               <button 
                 onClick={() => onViewDetails(order)} 
                 className="text-xs font-bold text-white bg-rose-900 px-3 py-1.5 rounded-lg hover:bg-rose-800 transition"
               >
                 Detay
               </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;