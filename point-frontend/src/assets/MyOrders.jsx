import React from 'react';

function MyOrders({ orders, onViewDetails, onRate }) {

  if (!orders || orders.length === 0) {
    return (
      <div className="h-full min-h-[180px] p-6 bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-gray-400">
        <span className="text-4xl mb-2">🧾</span>
        <h3 className="font-bold text-gray-600">Siparişlerin</h3>
        <p className="text-sm text-center">Şu an aktif bir siparişin bulunmuyor.</p>
      </div>
    );
  }

  return (
    /* BURAYI GÜNCELLEDİK: Sadece custom-scroll bıraktık */
    <div className="h-full max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scroll">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className={`p-5 bg-white rounded-xl shadow-md border-l-4 relative group transition hover:shadow-lg 
            ${order.status === 'Teslim Edildi' ? 'border-green-500 bg-green-50/30' : 
              order.status === 'Hazır' ? 'border-amber-500' : 
              order.status === 'Hazırlanıyor_Basladi' ? 'border-rose-500' : 'border-blue-500'}`}
        >
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                Sipariş #{order.id}
                <span className={`w-2 h-2 rounded-full animate-pulse 
                  ${order.status === 'Teslim Edildi' ? 'bg-green-500' : 
                    order.status === 'Hazır' ? 'bg-amber-500' : 
                    order.status === 'Hazırlanıyor_Basladi' ? 'bg-rose-500' : 'bg-blue-500'}`}>
                </span>
              </h2>
              
              <div className="mt-1">
                {order.status === 'Hazırlanıyor' && (
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                    📩 Sipariş Alındı
                  </span>
                )}
                {order.status === 'Hazırlanıyor_Basladi' && (
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                    👨‍🍳 Hazırlanıyor...
                  </span>
                )}
                {order.status === 'Hazır' && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                    ✅ Hazır (Lütfen Alınız)
                  </span>
                )}
                {order.status === 'Teslim Edildi' && (
                  <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                    🏁 Teslim Edildi
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="bg-gray-100 text-gray-800 font-bold px-2 py-1 rounded text-[10px] mb-1">
                ⏰ {order.pickupTime}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 border-t pt-3 border-gray-50">
            <span className="font-bold text-gray-800 text-sm">{order.totalAmount}₺</span>
            
            <div className="flex gap-2">
              {order.status === 'Teslim Edildi' ? (
                <button 
                  onClick={() => onRate(order)} 
                  className="text-[10px] font-bold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition shadow-md"
                >
                  ⭐ Puanla
                </button>
              ) : (
                <button 
                  onClick={() => onViewDetails(order)} 
                  className="text-[10px] font-bold text-white bg-rose-900 px-3 py-1.5 rounded-lg hover:bg-rose-800 transition shadow-sm"
                >
                  Detay
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;