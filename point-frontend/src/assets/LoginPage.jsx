import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  // formType: 'login' | 'register_selection' | 'register_student' | 'register_staff'
  const [formType, setFormType] = useState('login');
  const [activeTab, setActiveTab] = useState('customer'); // Login için 'customer' | 'owner'

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });

  // UI State
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (data.success) {
        if (data.user.role !== activeTab) {
          setErrorMessage("Bu hesap seçili giriş türü ile uyumlu değil!");
          setIsLoading(false);
          return;
        }
        onLogin(data.user);
      } else {
        setErrorMessage(data.message || "Giriş başarısız.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Sunucuya bağlanılamadı.");
      setIsLoading(false);
    }
  };

  // --- REGISTER ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    // Basit Validasyonlar
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      setErrorMessage("Tüm alanlar zorunludur.");
      setIsLoading(false); return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor.");
      setIsLoading(false); return;
    }
    if (registerData.password.length < 6) {
      setErrorMessage("Şifre en az 6 karakter olmalı.");
      setIsLoading(false); return;
    }

    // Domain Kontrolü (Client-Side Güvenlik Ağı)
    const normalizedEmail = registerData.email.toLowerCase();

    if (formType === 'register_student' && !normalizedEmail.endsWith('@ankara.edu.tr')) {
      setErrorMessage("Öğrenci kaydı için sadece @ankara.edu.tr maili kullanılabilir.");
      setIsLoading(false); return;
    }
    if (formType === 'register_staff' && !normalizedEmail.endsWith('@point.com')) {
      setErrorMessage("Personel kaydı için sadece @point.com maili kullanılabilir.");
      setIsLoading(false); return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: registerData.firstName,
          userSurname: registerData.lastName,
          email: normalizedEmail,
          password: registerData.password,
          phoneNumber: registerData.phoneNumber || null
        })
      });
      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Kayıt Başarılı! Giriş ekranına yönlendiriliyorsunuz...");
        setTimeout(() => {
          setFormType('login');
          setEmail(normalizedEmail);
          setSuccessMessage('');
          setRegisterData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
        }, 2000);
      } else {
        setErrorMessage(data.message || "Kayıt başarısız.");
      }
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      setErrorMessage("Sunucu hatası: " + (error.message || "Bilinmiyor"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- OWNER KONTROLÜ ---
  const handleStaffRegisterClick = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/api/auth/check-owner");
      const data = await res.json();

      if (data.exists) {
        setErrorMessage("⛔ Sistemde zaten bir yönetici kayıtlı. İkinci bir yönetici kaydı yapılamaz.");
      } else {
        setFormType('register_staff');
        setErrorMessage('');
      }
    } catch (err) {
      setErrorMessage("Sunucu kontrolü yapılamadı. Bağlantınızı kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <div className="bg-rose-900 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-xl border-4 border-rose-100">
          P
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">POINT CAFE</h1>
        <p className="text-gray-500 text-sm mt-1">Kampüsün Lezzet Noktası</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">

        {/* TOP TABS: GİRİŞ YAP / KAYIT OL */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => { setFormType('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formType === 'login' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => { setFormType('register_selection'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formType.startsWith('register') ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* --- 1. LOGIN SCREEN --- */}
        {formType === 'login' && (
          <>
            {/* SUB TABS: ÖĞRENCİ / PERSONEL */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => { setActiveTab('customer'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'customer' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
              >
                Öğrenci
              </button>
              <button
                onClick={() => { setActiveTab('owner'); setErrorMessage(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'owner' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
              >
                Personel
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{activeTab === 'customer' ? 'Öğrenci Maili' : 'Kurumsal Mail'}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={activeTab === 'customer' ? "ogrenci@ankara.edu.tr" : "admin@point.com"}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-rose-900 transition text-sm"
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
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-rose-900 transition text-sm"
                  required
                />
              </div>

              {errorMessage && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errorMessage}</div>}

              <button type="submit" disabled={isLoading} className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95">
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </>
        )}

        {/* --- 2. REGISTER SELECTION SCREEN --- */}
        {formType === 'register_selection' && (
          <div className="space-y-4">
            <h2 className="text-center text-lg font-bold text-gray-700 mb-4">Kayıt Türünü Seçiniz</h2>

            <button
              onClick={() => { setFormType('register_student'); setErrorMessage(''); }}
              className="w-full py-6 px-4 bg-white border-2 border-rose-100 rounded-2xl hover:border-rose-500 hover:bg-rose-50 transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-rose-500 group-hover:text-white transition">🎓</div>
              <div className="text-left">
                <div className="font-bold text-gray-800 text-lg">Öğrenci Kaydı</div>
                <div className="text-xs text-gray-500">@ankara.edu.tr mail adresinizle</div>
              </div>
            </button>

            <button
              onClick={handleStaffRegisterClick}
              disabled={isLoading}
              className="w-full py-6 px-4 bg-white border-2 border-gray-100 rounded-2xl hover:border-gray-500 hover:bg-gray-50 transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl group-hover:bg-gray-800 group-hover:text-white transition">👔</div>
              <div className="text-left">
                <div className="font-bold text-gray-800 text-lg">Personel Kaydı</div>
                <div className="text-xs text-gray-500">Yalnızca yetkili personel için</div>
              </div>
            </button>

            {errorMessage && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-4 font-bold text-center">{errorMessage}</div>}
          </div>
        )}

        {/* --- 3. REGISTER FORM (Student or Staff) --- */}
        {(formType === 'register_student' || formType === 'register_staff') && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button type="button" onClick={() => setFormType('register_selection')} className="text-gray-400 hover:text-gray-600">
                ← Geri
              </button>
              <h2 className="font-bold text-rose-900 text-lg">
                {formType === 'register_student' ? 'Öğrenci Kaydı' : 'Personel Kaydı'}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text" placeholder="Ad" required
                value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none text-sm focus:ring-2 focus:ring-rose-900"
              />
              <input
                type="text" placeholder="Soyad" required
                value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none text-sm focus:ring-2 focus:ring-rose-900"
              />
            </div>

            <input
              type="email"
              placeholder={formType === 'register_student' ? "ornek@ankara.edu.tr" : "admin@point.com"}
              required
              value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none text-sm focus:ring-2 focus:ring-rose-900"
            />
            {formType === 'register_student' && <p className="text-[10px] text-gray-400 px-1">Sadece @ankara.edu.tr kabul edilir.</p>}

            <input
              type="password" placeholder="Şifre" required
              value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none text-sm focus:ring-2 focus:ring-rose-900"
            />
            <input
              type="password" placeholder="Şifre Tekrar" required
              value={registerData.confirmPassword} onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none text-sm focus:ring-2 focus:ring-rose-900"
            />

            {errorMessage && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{errorMessage}</div>}
            {successMessage && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg">{successMessage}</div>}

            <button type="submit" disabled={isLoading} className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95">
              {isLoading ? 'Kaydediliyor...' : 'Kaydı Tamamla'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default LoginPage;