import React, { useState } from 'react';

// PROPS:
// - onLogin: App.js'e kullanıcının hangi rolle giriş yaptığını bildiren fonksiyon.
const LoginPage = ({ onLogin }) => {
  // Kullanıcı tipini (Sekme) tutan state: 'student' veya 'staff'
  const [activeTab, setActiveTab] = useState('student'); 

  // Form gönderildiğinde çalışır
  const handleSubmit = (e) => {
    e.preventDefault(); // Sayfa yenilenmesini engelle
    // Backend olmadığı için şifre kontrolü yapmadan direkt başarılı sayıyoruz.
    // Seçili rolü (activeTab) üst bileşene (App.js) gönderiyoruz.
    onLogin(activeTab);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* --- LOGO VE BAŞLIK ALANI --- */}
      <div className="mb-8 text-center">
        <div className="bg-rose-900 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-xl border-4 border-rose-100">
          P
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">POINT CAFE</h1>
        <p className="text-gray-500 text-sm mt-1">Kampüsün Lezzet Noktası</p>
      </div>

      {/* --- GİRİŞ KARTI --- */}
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
        
        {/* Rol Seçim Sekmeleri (Tabs) */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'student' 
                ? 'bg-white text-rose-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Öğrenci
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              activeTab === 'staff' 
                ? 'bg-white text-rose-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Personel
          </button>
        </div>

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-Posta</label>
            <input 
              type="email" 
              // Rol seçimine göre placeholder değişiyor (UX İyileştirmesi)
              placeholder={activeTab === 'student' ? "23291277@ankara.edu.tr" : "yonetici@point.com"}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-rose-900 focus:border-transparent outline-none transition text-sm"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:ring-2 focus:ring-rose-900 focus:border-transparent outline-none transition text-sm"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-900/30 transition transform active:scale-95 mt-4"
          >
            {activeTab === 'student' ? 'Giriş Yap' : 'Yönetici Girişi'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ankara Üniversitesi Mühendislik Fakültesi
        </p>
      </div>
    </div>
  );
};

export default LoginPage;