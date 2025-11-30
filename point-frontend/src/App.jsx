import { useState } from 'react';
import Navbar from './assets/NavBar';
import TimeSelector from './assets/TimeSelector';
import ProductCard from './assets/ProductCard';
import CartPage from './assets/CartPage'; // Yeni sayfamızı çağırdık

function App() {
  // --- STATE YÖNETİMİ ---
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState("menu"); // "menu" veya "cart" olabilir
  const [activeCategory, setActiveCategory] = useState("Tümü");

  // --- ÜRÜN VERİLERİ (Senin verilerin) ---
  const categories = ["Tümü", "Yemekler", "Soğuk İçecekler", "Sıcak İçecekler"];
  const products = [
    { id: 1, name: "Filtre Kahve", price: 45, category: "Sıcak İçecekler", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", description: "Yoğun aromalı taze demlenmiş kahve.", inStock: true },
    { id: 2, name: "Latte", price: 60, category: "Sıcak İçecekler", image: "/Images/latte.jpg", description: "Espresso ve sıcak sütün mükemmel uyumu.", inStock: true },
    { id: 3, name: "Limonata", price: 55, category: "Soğuk İçecekler", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80", description: "Naneli ferahlatıcı lezzet.", inStock: true },
    { id: 4, name: "Körili Makarna", price: 95, category: "Yemekler", image: "/Images/koriliMakarna.jpg", description: "", inStock: true },
    { id: 5, name: "Tavuk Pilav", price: 70, category: "Yemekler", image: "/Images/tavukpilav.jpg", description: "", inStock: false },
    { id: 6, name: "Oralet", price: 80, category: "Sıcak İçecekler", image: "/Images/oralet.jpg", description: "", inStock: true },
  ];

  // --- FONKSİYONLAR ---
  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    // Ürün eklenince ister uyarı ver, ister direkt sepete git (şu an uyarı veriyor)
    // setActiveTab("cart"); // Bunu açarsan her eklemede sepete atar
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const filteredProducts = activeCategory === "Tümü" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Navbar: Tıklamalara göre sayfayı (activeTab) değiştiriyoruz */}
      <Navbar 
        cartCount={cartItems.length} 
        onGoHome={() => setActiveTab("menu")}
        onGoCart={() => setActiveTab("cart")}
      />

      {/* --- SAYFA DEĞİŞTİRME MANTIĞI --- */}
      {activeTab === "cart" ? (
        // EĞER SEPET SEKMESİNDEYSEK BUNU GÖSTER:
        <CartPage 
          cartItems={cartItems} 
          onRemove={handleRemoveFromCart} 
          onGoBack={() => setActiveTab("menu")} 
        />
      ) : (
        // EĞER MENÜ SEKMESİNDEYSEK (Varsayılan) BUNU GÖSTER:
        <>
          <div className="bg-white pb-6 rounded-b-3xl shadow-sm mb-6">
            <TimeSelector />
          </div>

          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex overflow-x-auto gap-3 pb-4 mb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? "bg-rose-900 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">{activeCategory} Menüsü</h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAdd={handleAddToCart} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">Bu kategoride ürün bulunamadı.</div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default App;