function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Ürün Resmi Alanı */}
      <div className="h-40 bg-gray-200 relative">
        <img 
          src={product.image || "https://via.placeholder.com/300x200?text=Ürün"} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300x200?text=Görsel+Yok"; }}
        />
        {/* Stok durumu kontrolü (Bonus) */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm">
            TÜKENDİ
          </div>
        )}
      </div>

      {/* İçerik */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight">{product.name}</h3>
          <span className="font-bold text-rose-600">{product.price}₺</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || "Ürün açıklaması yakında eklenecek."}</p>
        
        {/* Ekle Butonu */}
        <button 
          onClick={() => onAdd(product)}
          disabled={!product.inStock}
          className={`mt-auto w-full py-2 rounded-lg font-semibold text-sm transition-colors 
            ${product.inStock 
              ? 'bg-gray-900 text-white hover:bg-rose-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
        </button>
      </div>
    </div>
  );
}
export default ProductCard;