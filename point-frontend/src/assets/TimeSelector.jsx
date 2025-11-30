// src/components/TimeSelector.jsx
import { useState } from 'react';

function TimeSelector() {
  // Seçilen saati tutmak için "state" kullanıyoruz
  const [selectedTime, setSelectedTime] = useState(null);

  // Örnek ders arası saatleri (Bunu sonra backend'den çekeceğiz)
  const timeSlots = [
    "09:45", "10:30", "11:15", "12:00", "13:30", "14:15", "15:00"
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Sipariş Saati Seçin ⏰
      </h2>
      
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`
              py-2 px-4 rounded-lg font-medium transition-all duration-200
              ${selectedTime === time 
                ? "bg-rose-700 text-white shadow-md scale-105" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200" 
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {selectedTime && (
        <div className="mt-6 p-3 bg-green-50 text-green-700 text-center rounded-lg border border-green-200">
          Siparişiniz <strong>{selectedTime}</strong> saatinde hazırlanmaya başlayacak!
        </div>
      )}
    </div>
  );
}

export default TimeSelector;