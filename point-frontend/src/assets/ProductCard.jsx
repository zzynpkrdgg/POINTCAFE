import ProductIcon from './ProductIcon';

function ProductCard({ product, onAdd, onRemove, cartItems }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Ürün Resmi Alanı */}
      <div className="h-40 relative">
        <ProductIcon product={product} className="w-full h-full" iconSize="text-6xl" />

        {/* Stok Tükendi Overlay */}
        {product.TotalStock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm backdrop-blur-[2px]">
            TÜKENDİ
          </div>
        )}
      </div>


      {/* İçerik */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-gray-800 text-lg leading-tight capitalize">{product.name}</h3>
          <span className="font-bold text-rose-600">{product.price}₺</span>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || "Ürün açıklaması yakında eklenecek."}</p>

        <div className="mt-auto">
          {product.TotalStock === 0 ? (
            /* Stokta Yok Durumu */
            <button
              disabled
              className="w-full py-2 rounded-lg font-semibold text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
            >
              Stokta Yok
            </button>
          ) : cartItems?.find(item => item.id === product.ProductID) ? (
            /* Eğer Ürün Sepette Varsa: +/- Kontrolleri */
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => onRemove(product.ProductID)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-rose-600 font-bold hover:bg-rose-50 transition-colors"
              >
                -
              </button>

              <span className="font-bold text-gray-800">
                {cartItems.find(item => item.id === product.ProductID).quantity}
              </span>

              <button
                onClick={() => onAdd(product)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm text-green-600 font-bold hover:bg-green-50 transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            /* Eğer Ürün Sepette Yoksa: Normal Ekle Butonu */
            <button
              onClick={() => onAdd(product)}
              className="w-full py-2 rounded-lg font-semibold text-sm bg-gray-900 text-white hover:bg-rose-700 transition-colors shadow-sm"
            >
              Sepete Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductCard;