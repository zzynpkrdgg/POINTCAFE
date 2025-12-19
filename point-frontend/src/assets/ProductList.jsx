import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Backend API'nizden ürünleri çekmek için fetch kullanıyoruz.
    // URL'i kendi backend endpoint'inizle değiştirin.
    const fetchProducts = async () => {
      try {
        // Örnek URL: http://localhost:5001/api/products
        // Burayı backend'inizin çalıştığı port ve endpoint ile güncelleyin
        const response = await fetch('http://localhost:5001/api/products');
        
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu.');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 mx-auto max-w-md mt-10">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAdd={onAddToCart} 
          />
        ))}
    </div>
  );
}

export default ProductList;
