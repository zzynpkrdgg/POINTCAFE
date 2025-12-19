import React from 'react';
import { LogOut, ShoppingBag } from 'lucide-react';

function Navbar({ cartCount, onGoHome, onGoCart, onLogout, cartItems }) {
  // Toplam tutarı hesapla
  const totalAmount = cartItems?.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2);

  return (
    <nav className="bg-rose-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center max-w-5xl">
        
        {/* LOGO ALANI */}
        <div 
        onClick={onGoHome} 
        className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
      >
        {/* P Logosu - Tam Daire Versiyonu */}
        <div className="bg-white text-rose-900 w-11 h-11 rounded-full flex items-center justify-center font-black text-2xl shadow-sm group-hover:scale-105 transition-transform shrink-0">
          P
        </div>

        {/* Yazı Grubu */}
        <div className="flex flex-col justify-center border-l-2 border-rose-400/30 pl-3">
          <h1 className="font-black text-xl leading-none tracking-tighter text-white">
            POINT
          </h1>
          <span className="text-[10px] font-light tracking-[0.3em] text-rose-200 leading-none mt-1 uppercase">
            Cafe
          </span>
        </div>
      </div>

        {/* SAĞ TARAF: Sepet ve Çıkış */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* SEPET BUTONU (SABİT GENİŞLİKLİ TASARIM) */}
          <button 
            onClick={onGoCart} 
            className="flex items-center bg-rose-800 hover:bg-rose-900 text-white rounded-xl transition-all active:scale-95 shadow-lg group overflow-hidden border border-rose-700/50 w-32 sm:w-40 h-10"
          >
            {/* Sol: Sabit Alanlı Adet Kısmı */}
            <div className="bg-yellow-400 text-rose-900 w-1/4 h-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              {cartCount > 99 ? '99+' : cartCount}
            </div>

            {/* Sağ: İkon ve Tutar (Yazılar sığmazsa küçülür) */}
            <div className="flex-1 px-2 flex items-center justify-center gap-2 overflow-hidden">
              <ShoppingBag size={16} className="shrink-0 hidden sm:block" />
              
              <div className="flex flex-col items-center sm:items-start leading-tight overflow-hidden">
                <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80 hidden md:block">
                  Toplam
                </span>
                <span className="text-[11px] sm:text-sm font-bold whitespace-nowrap">
                  {totalAmount}₺
                </span>
              </div>
            </div>
          </button>

          {/* AYIRAÇ ÇİZGİ */}
          <div className="w-px h-6 bg-rose-700 mx-1 shrink-0"></div>

          {/* ÇIKIŞ BUTONU */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 p-2 hover:bg-rose-800 rounded-xl transition text-rose-200 hover:text-white shrink-0"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
            <span className="hidden md:inline text-sm font-bold">Çıkış</span>
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;