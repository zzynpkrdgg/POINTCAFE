import React from 'react';
import { LogOut, ShoppingBag } from 'lucide-react'; // İkonları import ettik

// PROPS:
// - cartCount: Sepetteki ürün sayısı
// - onGoHome: Logoya basınca ana sayfaya dön
// - onGoCart: Sepet ikonuna basınca sepete git
// - onLogout: YENİ - Çıkış yap butonuna basınca çalışacak
function Navbar({ cartCount, onGoHome, onGoCart, onLogout }) {
  
  return (
    <nav className="bg-rose-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-5xl">
        
        {/* LOGO ALANI */}
        <div 
          onClick={onGoHome} 
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="bg-white text-rose-900 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border-2 border-rose-200">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-wide">POINT</h1>
            <span className="text-xs text-rose-200 font-medium tracking-widest">CAFE</span>
          </div>
        </div>

        {/* SAĞ TARAF: Sepet ve Çıkış */}
        <div className="flex items-center gap-3">
          
          {/* SEPET BUTONU */}
          <button 
            onClick={onGoCart} 
            className="relative p-2 hover:bg-rose-800 rounded-xl transition group"
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-rose-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-rose-900 transform group-hover:scale-110 transition">
                {cartCount}
              </span>
            )}
          </button>

          {/* AYIRAÇ ÇİZGİ */}
          <div className="w-px h-6 bg-rose-700 mx-1"></div>

          {/* ÇIKIŞ BUTONU (YENİ) */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 p-2 hover:bg-rose-800 rounded-xl transition text-rose-200 hover:text-white"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
            {/* Mobilde yer kaplamasın diye yazıyı gizleyip sadece ikonu gösterebiliriz */}
            <span className="hidden md:inline text-sm font-bold">Çıkış</span>
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;