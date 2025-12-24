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
          className="p-4 bg-white rounded-xl shadow-md border-l-[6px] border-rose-600 relative flex flex-col justify-between"
        >
          {/* Üst Kısım: Başlık, Durum ve Saat */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                Sipariş #{order.id}
                {/* Sarı nokta göstergesi (Screenshot'taki gibi) */}
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {order.status === 'Hazırlanıyor' ? 'Hazırlanıyor' :
                  order.status === 'Hazırlanıyor_Basladi' ? 'Hazırlanıyor' :
                    order.status}
              </p>
            </div>

            {/* Saat (Screenshot'taki gibi gri butonumsu yapı) */}
            <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg text-sm font-bold text-gray-700">
              <span>⏰</span> {order.pickupTime}
            </div>
          </div>

          {/* Alt Kısım: Fiyat ve Detay Butonu */}
          <div className="flex justify-between items-end mt-4">
            <span className="text-xl font-black text-gray-900">{order.totalAmount}₺</span>

            {order.status === 'Teslim Edildi' ? (
              <button
                onClick={() => onRate(order)}
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition"
              >
                Puanla
              </button>
            ) : (
              <button
                onClick={() => onViewDetails(order)}
                className="bg-rose-900 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition"
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