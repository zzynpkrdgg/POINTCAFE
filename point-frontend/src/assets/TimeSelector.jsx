import { useState } from 'react';

// PROPS:
// - onTimeSelect: Kullanıcı bir saat seçtiğinde bu bilgiyi App.js'e ileten fonksiyon.
function TimeSelector({ onTimeSelect }) {
  
  // Yerel State: Sadece seçili olan butonun rengini değiştirmek (UI) için tutulur.
  // Asıl veri App.js'deki 'pickupTime' state'ine gönderilir.
  const [localSelectedTime, setLocalSelectedTime] = useState(null);

  const timeSlots = [
    "09:45", "10:30", "11:15", "12:00", "13:30", "14:15", "15:00"
  ];

  const handleTimeClick = (time) => {
    // 1. Görsel güncelleme (Butonu boya)
    setLocalSelectedTime(time);
    
    // 2. Veri iletimi (App.js'e haber ver)
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
            onClick={() => handleTimeClick(time)}
            className={`
              py-2 px-4 rounded-lg font-medium transition-all duration-200
              ${localSelectedTime === time 
                ? "bg-rose-900 text-white shadow-md scale-105" // Seçili stil
                : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Normal stil
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Seçim yapıldıysa altta bilgilendirme göster */}
      {localSelectedTime && (
        <div className="mt-6 p-3 bg-green-50 text-green-700 text-center rounded-lg border border-green-200 animate-pulse">
          Siparişiniz <strong>{localSelectedTime}</strong> saatinde hazırlanmaya başlayacak!
        </div>
      )}
    </div>
  );
}

export default TimeSelector;