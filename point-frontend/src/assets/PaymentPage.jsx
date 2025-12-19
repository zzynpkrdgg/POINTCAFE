import React, { useState } from 'react';

// PROPS AÇIKLAMASI:
// - totalAmount: Sepetteki toplam tutar (App.js'den gelir).
// - pickupTime: Kullanıcının seçtiği teslim saati (App.js'den gelir).
// - onBack: "Geri Dön" butonuna basınca çalışacak fonksiyon (Sepete geri atar).
// - onCompleteOrder: Ödeme başarılı olunca çalışacak fonksiyon (Sipariş notunu iletir).
const PaymentPage = ({ totalAmount, pickupTime, onBack, onCompleteOrder }) => {
  
  // --- STATE (DURUM) YÖNETİMİ ---
  
  // Seçilen ödeme yöntemi: Varsayılan olarak 'credit_card'
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); 
  
  // Kullanıcının girdiği sipariş notu (Örn: "Ketçap olmasın")
  const [orderNote, setOrderNote] = useState('');
  
  // Ödeme butonuna basıldı mı? (Yükleniyor animasyonu için)
  const [isProcessing, setIsProcessing] = useState(false);

  // ÖDEME BUTONUNA BASILINCA ÇALIŞAN FONKSİYON
  const handlePay = (e) => {
  e.preventDefault();
  setIsProcessing(true);
  
  setTimeout(() => {
    setIsProcessing(false);
    onCompleteOrder(); // Artık not parametresi göndermesine gerek yok, not zaten App.jsx'te var.
  }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* --- HEADER (ÜST KISIM) --- */}
      {/* sticky top-0: Sayfa kaydırılsa bile üstte sabit kalır */}
      <div className="bg-white p-4 shadow-sm flex items-center sticky top-0 z-10">
        <button onClick={onBack} className="text-gray-600 hover:text-rose-900 p-2">
          {/* Geri Dön Oku İkonu (SVG) */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-800">Ödemeyi Tamamla</h1>
        <div className="w-8"></div> {/* Başlığı ortalamak için boşluk bırakıcı */}
      </div>

      {/* --- İÇERİK ALANI --- */}
      <div className="p-4 space-y-4 max-w-lg mx-auto w-full pb-24">
        
        {/* 1. ÖZET KARTI (Kırmızı Alan) */}
        <div className="bg-rose-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-rose-200 text-sm mb-1">Toplam Tutar</p>
            <h2 className="text-4xl font-bold mb-4">{totalAmount}₺</h2>
            
            {/* Seçilen Saati Gösteriyoruz - Raporun en önemli özelliği */}
            <div className="flex items-center text-sm bg-rose-800/50 p-2 rounded-lg w-max">
              <span className="mr-2">⏰ Teslim Saati:</span>
              <span className="font-bold text-white">{pickupTime}</span>
            </div>
          </div>
          {/* Görsel Süsleme (Sağ alttaki silik daire) */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        </div>

        {/* 2. ÖDEME YÖNTEMİ SEÇİMİ */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-3">Ödeme Yöntemi</h3>
          <div className="flex gap-3">
            
            {/* Kredi Kartı Seçeneği */}
            <button 
              onClick={() => setPaymentMethod('credit_card')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'credit_card' 
                  ? 'border-rose-900 bg-rose-50 text-rose-900' // Seçiliyse Kırmızı
                  : 'border-gray-200 hover:border-gray-300' // Değilse Gri
              }`}
            >
              <span className="text-2xl">💳</span>
              <span className="text-xs font-bold">Kredi Kartı</span>
            </button>
            
            {/* Kampüs Kart Seçeneği */}
            <button 
              onClick={() => setPaymentMethod('campus_card')}
              className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                paymentMethod === 'campus_card' 
                  ? 'border-rose-900 bg-rose-50 text-rose-900' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">🎓</span>
              <span className="text-xs font-bold">Kampüs Kart</span>
            </button>
          </div>
        </div>

        {/* 3. FORM ALANI (Seçime Göre Değişir) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
          {paymentMethod === 'credit_card' ? (
            // Kredi Kartı Formu (Görseldir, veri göndermez)
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Kart Sahibi</label>
                <input type="text" placeholder="Ad Soyad" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-rose-900 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Kart Numarası</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-rose-900 outline-none text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">SKT</label>
                  <input type="text" placeholder="AA/YY" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-rose-900 outline-none text-sm" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                  <input type="text" placeholder="123" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-rose-900 outline-none text-sm" />
                </div>
              </div>
            </div>
          ) : (
            // Kampüs Kart Bilgisi
            <div className="text-center py-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-lg inline-block mb-2">
                Bakiye: 150.00₺
              </div>
              <p className="text-sm text-gray-500">Ödeme, öğrenci kartı bakiyenizden düşülecektir.</p>
            </div>
          )}
        </div>

        {/* 4. SİPARİŞ NOTU ALANI */}
      </div>

      {/* --- ALT SABİT BUTON --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-20">
        <div className="max-w-lg mx-auto">
          <button 
            onClick={handlePay}
            disabled={isProcessing} // İşlenirken tıklanamaz yap
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg text-lg flex items-center justify-center transition-all ${
              isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-900 hover:bg-rose-800 active:scale-95'
            }`}
          >
            {isProcessing ? (
              // Dönen yükleme ikonu (Spinner)
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                İşleniyor...
              </>
            ) : (
              `Ödemeyi Tamamla (${totalAmount}₺)`
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default PaymentPage;