import React from 'react';
import { X } from 'lucide-react'; // Kapat ikonunu import edelim (yoksa 'X' harfi koy)

function OrderDetailsModal({ order, onClose }) {
  if (!order) return null; // Sipariş yoksa gösterme

  return (
    // Arka planı karartan katman (Overlay)
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* Modal Kutusu */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        
        {/* Başlık ve Kapat Butonu */}
        <div className="bg-rose-900 text-white p-4 flex justify-between items-center">
          <h2 className="text-lg font-bold">Sipariş Detayı #{order.id}</h2>
          <button onClick={onClose} className="p-1 hover:bg-rose-800 rounded-full transition">
            <X size={20} /> {/* İkon yoksa buraya "X" yaz */}
          </button>
        </div>

        {/* İçerik */}
        <div className="p-6">
          
          {/* Durum ve Saat */}
          <div className="flex justify-between items-center mb-6 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Teslim Saati</p>
              <p className="text-xl font-bold text-rose-900">{order.pickupTime}</p>
            </div>
            <div className="h-8 w-px bg-rose-200"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase font-bold">Durum</p>
              <p className="text-green-600 font-bold animate-pulse">{order.status}</p>
            </div>
          </div>

          {/* Ürün Listesi */}
          <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">Ürünler</h3>
          <ul className="space-y-3 mb-6 max-h-40 overflow-y-auto">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded text-xs">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <span className="font-medium text-gray-600">{item.price * item.quantity}₺</span>
              </li>
            ))}
          </ul>

          {/* Sipariş Notu */}
          {order.note && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2 text-xs uppercase">Sipariş Notu</h3>
              <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm italic border border-yellow-100">
                "{order.note}"
              </div>
            </div>
          )}

          {/* Toplam Tutar */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-gray-500 font-medium">Toplam Tutar</span>
            <span className="text-2xl font-bold text-rose-900">{order.totalAmount}₺</span>
          </div>

        </div>
        
        {/* Alt Buton */}
        <div className="p-4 bg-gray-50 border-t">
          <button 
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderDetailsModal;