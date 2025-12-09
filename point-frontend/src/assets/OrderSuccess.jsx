import React from 'react';

// PROPS:
// - pickupTime: Hangi saate sipariş verildi?
// - onGoHome: "Ana Sayfaya Dön" butonuna basınca çalışacak fonksiyon.
const OrderSuccess = ({ pickupTime, onGoHome }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
      
      {/* --- BAŞARI İKONU --- */}
      {/* animate-bounce: İkonun zıplama animasyonu */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Sipariş Alındı!</h1>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto">
        Siparişin başarıyla oluşturuldu ve mutfağa iletildi.
      </p>

      {/* --- DURUM TAKİP KARTI --- */}
      <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-sm border border-gray-100 mb-8">
        
        {/* Saat Bilgisi */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">Teslim Saati</span>
          <span className="text-xl font-bold text-rose-900">{pickupTime}</span>
        </div>
        
        {/* İlerleme Çubuğu (Progress Bar) */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
              Hazırlanıyor
            </div>
          </div>
          {/* Çubuğun kendisi */}
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            {/* Doluluk oranı ve animasyonu (animate-pulse) */}
            <div className="w-1/3 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-400 animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 italic">
          *Siparişin hazır olduğunda bildirim alacaksın.
        </p>
      </div>

      {/* --- ANA SAYFAYA DÖN BUTONU --- */}
      <button 
        onClick={onGoHome}
        className="w-full max-w-sm bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition"
      >
        Ana Sayfaya Dön
      </button>

    </div>
  );
};

export default OrderSuccess;