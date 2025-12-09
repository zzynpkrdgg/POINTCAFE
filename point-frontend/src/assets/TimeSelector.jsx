import { useState } from 'react';

// DEĞİŞİKLİK 1: Parametre olarak { onTimeSelect } ekledik.
// Bu fonksiyon App.jsx'ten geliyor ve oradaki ana veriyi güncelleyecek.
function TimeSelector({ onTimeSelect }) {
  // Görsel olarak butonun kırmızı kalması için kendi state'imizi de tutuyoruz
  const [localSelectedTime, setLocalSelectedTime] = useState(null);

  const timeSlots = [
    "09:45", "10:30", "11:15", "12:00", "13:30", "14:15", "15:00"
  ];

  const handleTimeClick = (time) => {
    // 1. Kendi içimizdeki görüntüyü güncelle (Buton kırmızı olsun)
    setLocalSelectedTime(time);
    
    // 2. Ana yöneticiye (App.js) haber ver (ÖNEMLİ OLAN BU)
    if (onTimeSelect) {
      onTimeSelect(time);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Sipariş Saati Seçin ⏰
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            // DEĞİŞİKLİK 2: Tıklanınca hem rengi değiştirsin hem App.js'e haber versin
            onClick={() => handleTimeClick(time)}
            className={`
              py-2 px-4 rounded-lg font-medium transition-all duration-200
              ${localSelectedTime === time 
                ? "bg-rose-900 text-white shadow-md scale-105" // Renk senin temana uygun rose-900 yapıldı
                : "bg-gray-100 text-gray-600 hover:bg-gray-200" 
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {localSelectedTime && (
        <div className="mt-6 p-3 bg-green-50 text-green-700 text-center rounded-lg border border-green-200 animate-pulse">
          Siparişiniz <strong>{localSelectedTime}</strong> saatinde hazırlanmaya başlayacak!
        </div>
      )}
    </div>
  );
}

export default TimeSelector;