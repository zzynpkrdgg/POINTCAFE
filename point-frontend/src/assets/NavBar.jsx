// Props olarak onGoHome ve onGoCart fonksiyonlarını alıyoruz
function Navbar({ cartCount, onGoHome, onGoCart }) {
  return (
    <nav className="sticky top-0 z-50 bg-rose-800 border-b border-gray-100 shadow-sm px-4 py-3 flex justify-end items-center relative h-16">
      
      {/* Logoya Tıklama Özelliği Ekledik */}
      <div 
        onClick={onGoHome} 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center cursor-pointer"
      >
        <h1 className="text-2xl font-black text-white tracking-tighter">POINT CAFE</h1>
        <span className="text-xs text-rose-50 font-medium">MENU</span>
      </div>
      
      {/* Sepete Tıklama Özelliği Ekledik */}
      <div 
        onClick={onGoCart}
        className="relative p-2 bg-gray-50 rounded-full cursor-pointer hover:bg-rose-50 transition"
      >
        {/* İkonlar aynı kalıyor... */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
            {cartCount}
          </span>
        )}
      </div>
    </nav>
  );
}
export default Navbar;