import { Trash2, ArrowLeft } from 'lucide-react';

// PROPS:
// - cartItems: Sepetteki ürünlerin listesi
// - onRemove: Ürünü sepetten silme fonksiyonu
// - onGoBack: Geri (Menü) butonuna basma fonksiyonu
// - onConfirm: "Sepeti Onayla" butonuna basma fonksiyonu
function CartPage({ cartItems, onRemove, onGoBack, onConfirm }) {
  
  // --- FİYAT HESAPLAMALARI ---
  // reduce fonksiyonu ile tüm ürünlerin (fiyat * miktar) toplamını alıyoruz.
  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // EĞER SEPET BOŞSA:
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

  // EĞER ÜRÜN VARSA:
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Başlık ve Geri Dön */}
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
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
              
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
                <div className="mt-2 font-bold text-rose-600">{item.price}₺ <span className="text-gray-400 text-sm font-normal">x {item.quantity}</span></div>
              </div>

              {/* Silme Butonu */}
              <div className="text-right flex flex-col items-end gap-2">
                <span className="font-bold text-lg text-gray-900">{item.price * item.quantity}₺</span>
                <button 
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 size={16} /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SAĞ TARAF: Özet ve Onay Kutusu */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Sipariş Özeti</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Ara Toplam</span>
                <span>{totalPrice}₺</span>
              </div>
              {/* KDV Hesaplaması (Örnek %10) */}
              <div className="flex justify-between text-gray-600">
                <span>KDV (%10)</span>
                <span>{(totalPrice * 0.10).toFixed(2)}₺</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t">
                <span>Toplam</span>
                {/* Toplam = Ara Toplam + KDV */}
                <span>{(totalPrice * 1.10).toFixed(2)}₺</span>
              </div>
            </div>

            {/* ONAY BUTONU: onConfirm tetiklenir */}
            <button 
              onClick={onConfirm}
              className="w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 transition shadow-lg active:scale-95 transform duration-100"
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