import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [formType, setFormType] = useState('login'); // 'login' veya 'register'
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' veya 'owner'
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // --- KURUMSAL GİRİŞ KONTROLÜ (UX & GÜVENLİK) ---
    
    // 1. Personel sekmesinde öğrenci maili kullanılamaz
    if (activeTab === 'owner' && !email.endsWith('@point.com')) {
      setErrorMessage("Öğrenciler lütfen 'Öğrenci' sekmesini kullanarak giriş yapınız.");
      setIsLoading(false);
      return;
    }

    // 2. Öğrenci sekmesinde personel/admin maili kullanılamaz
    if (activeTab === 'customer' && email.endsWith('@point.com')) {
      setErrorMessage("Yöneticiler lütfen 'Personel' sekmesini kullanarak giriş yapınız.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Ekstra Kontrol: Backend'den gelen rol, seçilen sekmeyle uyumlu mu?
        if (data.user.role !== activeTab) {
          const beklenenRol = activeTab === 'owner' ? 'Personel' : 'Öğrenci';
            setErrorMessage("Bu hesap seçili giriş türü (Öğrenci/Personel) ile uyumlu değil!");
            setIsLoading(false);
            return;
        }
        
        setErrorMessage('');
        setIsLoading(false);
        onLogin(data.user);
      } else {
        setErrorMessage(data.message || "E-posta veya şifre hatalı! Lütfen bilgilerinizi kontrol edin.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Bağlantı hatası:", error);
      setErrorMessage("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validation
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password) {
      setErrorMessage("Tüm alanlar doldurulmalıdır!");
      setIsLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Şifreler eşleşmiyor!");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMessage("Şifre en az 6 karakter olmalıdır!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: registerData.firstName,
          userSurname: registerData.lastName,
          email: registerData.email,
          password: registerData.password,
          phoneNumber: registerData.phoneNumber || null
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
        setIsLoading(false);
        setTimeout(() => {
          setFormType('login');
          setActiveTab('customer');
          setEmail(registerData.email);
          setSuccessMessage('');
        }, 2000);
      } else {
        setErrorMessage(data.message || "Kayıt sırasında bir hata oluştu.");
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage("Sunucuya bağlanılamadı.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo ve Başlık */}
      <div className="mb-8 text-center">
        <div className="bg-rose-900 text-white w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mx-auto shadow-xl border-4 border-rose-100">
          P
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">POINT CAFE</h1>
        <p className="text-gray-500 text-sm mt-1">Kampüsün Lezzet Noktası</p>
      </div>

      <div className={`bg-white p-8 rounded-3xl shadow-xl w-full border border-gray-100 ${
        formType === 'register' ? 'max-w-md' : 'max-w-sm'
      }`}>
        
        {/* GİRİŞ/KAYIT SEKME SEÇİCİ */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button 
            type="button"
            onClick={() => { 
              setFormType('login'); 
              setErrorMessage('');
              setSuccessMessage('');
            }} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formType === 'login' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
          >
            Giriş Yap
          </button>
          <button 
            type="button"
            onClick={() => { 
              setFormType('register'); 
              setErrorMessage('');
              setSuccessMessage('');
            }} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formType === 'register' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* LOGIN FORM */}
        {formType === 'login' && (
          <>
            {/* Öğrenci/Personel Sekmesi - Sadece login'de göster */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button 
                type="button"
                onClick={() => { setActiveTab('customer'); setEmail(''); setErrorMessage(''); }} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'customer' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
              >
                Öğrenci
              </button>
              <button 
                type="button"
                onClick={() => { setActiveTab('owner'); setEmail(''); setErrorMessage(''); }} 
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'owner' ? 'bg-white text-rose-900 shadow-sm' : 'text-gray-400'}`}
              >
                Personel
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
              {activeTab === 'customer' ? 'Öğrenci E-Posta' : 'Personel E-Posta'}
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage(''); // Kullanıcı yazmaya başladığında hata mesajını temizle
              }}
              placeholder={activeTab === 'customer' ? "ogrenci@ankara.edu.tr" : "admin@point.com"}
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
              }`}
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage(''); // Kullanıcı yazmaya başladığında hata mesajını temizle
              }}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
              }`}
              required 
            />
          </div>

          {/* Hata Mesajı */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 mt-4 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Giriş yapılıyor...' : (activeTab === 'customer' ? 'Giriş Yap' : 'Yönetici Girişi')}
          </button>
        </form>
          </>
        )}

        {/* REGISTER FORM */}
        {formType === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Ad</label>
                <input 
                  type="text" 
                  value={registerData.firstName}
                  onChange={(e) => {
                    setRegisterData({...registerData, firstName: e.target.value});
                    setErrorMessage('');
                  }}
                  placeholder="Adınız"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                    errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
                  }`}
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Soyad</label>
                <input 
                  type="text" 
                  value={registerData.lastName}
                  onChange={(e) => {
                    setRegisterData({...registerData, lastName: e.target.value});
                    setErrorMessage('');
                  }}
                  placeholder="Soyadınız"
                  className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                    errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
                  }`}
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">E-Posta</label>
              <input 
                type="email" 
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({...registerData, email: e.target.value});
                  setErrorMessage('');
                }}
                placeholder="ornek@ankara.edu.tr"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                  errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
                }`}
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Telefon (Opsiyonel)</label>
              <input 
                type="tel" 
                value={registerData.phoneNumber}
                onChange={(e) => {
                  setRegisterData({...registerData, phoneNumber: e.target.value});
                  setErrorMessage('');
                }}
                placeholder="05XX XXX XX XX"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none transition text-sm focus:ring-2 focus:ring-rose-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Şifre</label>
              <input 
                type="password" 
                value={registerData.password}
                onChange={(e) => {
                  setRegisterData({...registerData, password: e.target.value});
                  setErrorMessage('');
                }}
                placeholder="En az 6 karakter"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                  errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
                }`}
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Şifre Tekrar</label>
              <input 
                type="password" 
                value={registerData.confirmPassword}
                onChange={(e) => {
                  setRegisterData({...registerData, confirmPassword: e.target.value});
                  setErrorMessage('');
                }}
                placeholder="Şifrenizi tekrar girin"
                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none transition text-sm focus:ring-2 ${
                  errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-rose-900'
                }`}
                required 
              />
            </div>

            {/* Başarı Mesajı */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Hata Mesajı */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95 mt-4 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;