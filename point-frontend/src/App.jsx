import { useState } from 'react';

// --- BİLEŞENLER ---
import Navbar from './assets/NavBar';
import TimeSelector from './assets/TimeSelector';
import MyOrders from './assets/MyOrders'; 
import ProductCard from './assets/ProductCard';
import CartPage from './assets/CartPage';
import LoginPage from './assets/LoginPage';
import AdminDashboard from './assets/AdminDashboard';
import PaymentPage from './assets/PaymentPage';
import OrderSuccess from './assets/OrderSuccess';
import OrderDetailsModal from './assets/OrderDetailsModal'; // YENİ: Modal importu

function App() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userRole, setUserRole] = useState(null); 
  const [activeTab, setActiveTab] = useState("menu"); 
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [cartItems, setCartItems] = useState([]); 
  const [pickupTime, setPickupTime] = useState(null); 
  
  // DEĞİŞİKLİK 1: Artık tek sipariş değil, sipariş LİSTESİ tutuyoruz.
  const [activeOrders, setActiveOrders] = useState([]); 
  
  // DEĞİŞİKLİK 2: Modalda gösterilecek seçili sipariş
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  // --- ÜRÜN VERİLERİ ---
  const [products, setProducts] = useState([
    { id: 1, name: "Filtre Kahve", price: 45, category: "Sıcak İçecekler", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80", description: "Yoğun aromalı taze demlenmiş kahve.", inStock: true },
    { id: 2, name: "Latte", price: 60, category: "Sıcak İçecekler", image: "/Images/latte.jpg", description: "Espresso ve sıcak sütün mükemmel uyumu.", inStock: true },
    { id: 3, name: "Limonata", price: 55, category: "Soğuk İçecekler", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80", description: "Naneli ferahlatıcı lezzet.", inStock: true },
    { id: 4, name: "Körili Makarna", price: 95, category: "Yemekler", image: "/Images/koriliMakarna.jpg", description: "", inStock: true },
    { id: 5, name: "Tavuk Pilav", price: 70, category: "Yemekler", image: "/Images/tavukpilav.jpg", description: "", inStock: false }, 
    { id: 6, name: "Oralet", price: 80, category: "Sıcak İçecekler", image: "/Images/oralet.jpg", description: "", inStock: true },
  ]);

  const categories = ["Tümü", "Yemekler", "Soğuk İçecekler", "Sıcak İçecekler"];

  // --- FONKSİYONLAR ---

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    if(role === 'student') setActiveTab("menu");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCartItems([]);
    setActiveOrders([]); // Çıkışta siparişleri temizle
  };

  const handleStockToggle = (productId) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p));
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) return;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleTimeSelected = (time) => {
    setPickupTime(time);
  };

  // --- SİPARİŞ TAMAMLANINCA ---
  const handleOrderCompleted = (note) => {
    
    const newOrder = {
        id: Math.floor(Math.random() * 10000),
        items: [...cartItems],
        totalAmount: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        pickupTime: pickupTime,
        note: note,
        status: 'Hazırlanıyor'
    };

    // DEĞİŞİKLİK 3: Eski siparişleri silmeden YENİSİNİ LİSTEYE EKLE
    // [newOrder, ...prev] -> Yeni siparişi listenin en başına koyar
    setActiveOrders(prevOrders => [newOrder, ...prevOrders]);

    setCartItems([]); 
    setActiveTab("success");
  };

  const filteredProducts = activeCategory === "Tümü" ? products : products.filter(p => p.category === activeCategory);

  // --- RENDER ---

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;
  if (userRole === 'staff') return <AdminDashboard products={products} onUpdateStock={handleStockToggle} onLogout={handleLogout} />;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* DETAY MODALI: Eğer selectedOrderForModal doluysa modalı göster */}
      {selectedOrderForModal && (
        <OrderDetailsModal 
          order={selectedOrderForModal} 
          onClose={() => setSelectedOrderForModal(null)} 
        />
      )}

      <Navbar 
        cartCount={cartItems.length} 
        onGoHome={() => setActiveTab("menu")}
        onGoCart={() => setActiveTab("cart")}

        onLogout={handleLogout}
      />

      {/* --- SAYFALAR --- */}

      {activeTab === "cart" ? (
        <CartPage 
          cartItems={cartItems} 
          onRemove={handleRemoveFromCart} 
          onGoBack={() => setActiveTab("menu")} 
          onConfirm={() => {
            if (!pickupTime) {
                alert("Lütfen yukarıdaki menüden bir teslim alma saati seçiniz!");
                setActiveTab("menu");
            } else {
                setActiveTab("payment");
            }
          }}
        />
      
      ) : activeTab === "payment" ? (
        <PaymentPage 
           totalAmount={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
           pickupTime={pickupTime}
           onBack={() => setActiveTab("cart")}
           onCompleteOrder={handleOrderCompleted}
        />

      ) : activeTab === "success" ? (
        <OrderSuccess 
           pickupTime={pickupTime}
           onGoHome={() => {
             setActiveTab("menu");
             // Saati sıfırlamıyoruz, belki yine aynı saate ister
           }}
        />

      ) : (
        <>
          {/* MENÜ EKRANI */}
          <div className="bg-white pb-6 rounded-b-3xl shadow-sm mb-6 pt-4">
            <div className="container mx-auto px-4 max-w-5xl">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <TimeSelector onTimeSelect={handleTimeSelected} />
                        {pickupTime && (
                             <div className="text-center mt-2 text-rose-900 font-bold text-sm bg-rose-50 py-1 rounded">
                                Seçilen Saat: {pickupTime}
                            </div>
                        )}
                    </div>

                    <div>
                        {/* DEĞİŞİKLİK 4: activeOrders listesini gönderiyoruz */}
                        <MyOrders 
                          orders={activeOrders} 
                          onViewDetails={(order) => setSelectedOrderForModal(order)} // Modalı aç
                        />
                    </div>
                </div>
            </div>
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