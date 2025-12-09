import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

// PROPS:
// - order: Puanlanacak siparişin bilgileri
// - onClose: Modalı kapatma fonksiyonu
// - onSubmit: Puanı ve yorumu kaydedip siparişi arşivleyen fonksiyon
function RatingModal({ order, onClose, onSubmit }) {
  const [rating, setRating] = useState(0); // 1-5 Yıldız
  const [comment, setComment] = useState(''); // Kullanıcı yorumu

  const handleSubmit = () => {
    // Validasyon: En az 1 yıldız verilmeli
    if (rating === 0) {
      alert("Lütfen en az 1 yıldız veriniz!");
      return;
    }
    onSubmit(order.id, rating, comment);
  };

  return (
    // Overlay (Arka plan karartma)
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-rose-900 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold">Siparişi Değerlendir</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            <span className="font-bold text-rose-900">#{order.id}</span> numaralı siparişinden memnun kaldın mı?
          </p>

          {/* Yıldızlar Döngüsü */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star 
                  size={32} 
                  fill={star <= rating ? "#FBBF24" : "none"} // Eğer puan bu yıldıza eşit veya büyükse sarı yap
                  stroke={star <= rating ? "#FBBF24" : "#D1D5DB"}
                />
              </button>
            ))}
          </div>

          {/* Yorum Alanı */}
          <textarea
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-900 outline-none resize-none"
            rows="3"
            placeholder="Düşüncelerini yaz (İsteğe bağlı)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <button
            onClick={handleSubmit}
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3 rounded-xl mt-4 transition"
          >
            Gönder ve Arşivle
          </button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;