import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('student'); 
  // Input değerlerini tutmak için state ekliyoruz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // BACKEND'E İSTEK ATIYORUZ
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // BAŞARILI: Backend'den gelen kullanıcı verisini App.jsx'e gönder
        onLogin(data.user);
      } else {
        // HATALI: Mesajı göster, App.jsx'e haber verme (içeri giremez)
        alert(data.message || "Giriş başarısız!");
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      alert("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="bg-rose-900 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-xl border-4 border-rose-100">
          P
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">POINT CAFE</h1>
        <p className="text-gray-500 text-sm mt-1">Kampüsün Lezzet Noktası</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setActiveTab('student')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'student' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}>Öğrenci</button>
          <button onClick={() => setActiveTab('staff')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'staff' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}>Personel</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-Posta</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={activeTab === 'student' ? "23291277@ankara.edu.tr" : "yonetici@point.com"}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition text-sm focus:ring-2 focus:ring-rose-900"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition text-sm focus:ring-2 focus:ring-rose-900"
              required 
            />
          </div>

          <button type="submit" className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 mt-4">
            {activeTab === 'student' ? 'Giriş Yap' : 'Yönetici Girişi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;