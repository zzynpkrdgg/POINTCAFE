import React, { useState } from 'react';
import { Trash2, ArrowLeft, MessageSquare, Plus, Minus } from 'lucide-react';

// PROPS'a onClear ve onAdd eklendi (App.jsx'ten gönderdiğin fonksiyonlar)
function CartPage({ cartItems, onRemove, onClear, onAdd, onGoBack, onConfirm }) {
  const [note, setNote] = useState('');

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sepetiniz Boş</h2>
        <p className="text-gray-500 mb-6">Henüz bir ürün eklemediniz.</p>
        <button 
          onClick={onGoBack}
          className="bg-rose-800 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-900 transition"
        >
          Menüye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onGoBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Sepetim</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* SOL TARAF: Ürün Listesi */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100 shrink-0" />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                
                {/* MİKTAR KONTROLÜ (SEPET İÇİNDE) */}
                <div className="flex items-center gap-3 mt-3 bg-gray-50 w-fit px-2 py-1 rounded-lg border border-gray-100">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-rose-600 hover:bg-rose-100 p-1 rounded transition"
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <span className="font-bold text-gray-800 min-w-[20px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onAdd(item)}
                    className="text-green-600 hover:bg-green-100 p-1 rounded transition"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-2 shrink-0">
                <span className="font-bold text-lg text-gray-900">{item.price * item.quantity}₺</span>
                
                {/* TÜMÜNÜ SİL BUTONU (ÇÖP KUTUSU) */}
                <button 
                  onClick={() => onClear(item.id)}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                  title="Ürünü tamamen kaldır"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Kaldır</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SAĞ TARAF: Özet */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Sipariş Özeti</h2>
            
            <div className="mb-6">
              <label className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <MessageSquare size={16} className="text-rose-600" /> Sipariş Notu
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: Ketçap olmasın..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-600"
                rows="3"
              />
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{totalPrice}₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>KDV (%10)</span>
                <span>{(totalPrice * 0.10).toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                <span>Toplam</span>
                <span>{(totalPrice * 1.10).toFixed(2)}₺</span>
              </div>
            </div>

            <button 
              onClick={() => onConfirm(note)}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 transition shadow-lg active:scale-95"
            >
              Sepeti Onayla
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">Siparişiniz hazırlık sırasına alınacaktır.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;