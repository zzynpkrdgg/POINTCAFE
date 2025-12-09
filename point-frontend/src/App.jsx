import { useState } from 'react';

// BİLEŞENLER
import Navbar from './assets/NavBar';
import TimeSelector from './assets/TimeSelector';
import MyOrders from './assets/MyOrders'; 
import ProductCard from './assets/ProductCard';
import CartPage from './assets/CartPage';
import LoginPage from './assets/LoginPage';
import AdminDashboard from './assets/AdminDashboard';
import PaymentPage from './assets/PaymentPage';
import OrderSuccess from './assets/OrderSuccess';
import OrderDetailsModal from './assets/OrderDetailsModal';
import RatingModal from './assets/RatingModal'; // YENİ
import ProfilePage from './assets/ProfilePage'; // YENİ

function App() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userInfo, setUserInfo] = useState(null); // YENİ: Kullanıcı bilgileri
  const [activeTab, setActiveTab] = useState("menu"); 
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [cartItems, setCartItems] = useState([]); 
  const [pickupTime, setPickupTime] = useState(null); 
  
  // Sipariş Listeleri
  const [activeOrders, setActiveOrders] = useState([]); 
  const [pastOrders, setPastOrders] = useState([]); // YENİ: Geçmiş Siparişler
  
  // Modallar
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null); // YENİ: Puanlanacak sipariş

  // Ürün Verileri
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
    // Burada normalde backend'den kullanıcı bilgisi gelir.
    // Biz simüle ediyoruz:
    const mockUser = role === 'student' ? {
        name: "Fikret Kutluay",
        role: "student",
        studentId: "23291277",
        email: "23291277@ankara.edu.tr"
    } : {
        name: "Kafe Yöneticisi",
        role: "staff",
        studentId: "-",
        email: "admin@point.com"
    };

    setUserInfo(mockUser);
    setIsLoggedIn(true);
    if(role === 'student') setActiveTab("menu");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setCartItems([]);
    // activeOrders ve pastOrders'ı silmiyoruz ki demo sırasında veri kaybolmasın.
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

  const handleOrderCompleted = (note) => {
    const newOrder = {
        id: Math.floor(Math.random() * 10000),
        items: [...cartItems],
        totalAmount: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        pickupTime: pickupTime,
        note: note,
        status: 'Hazırlanıyor',
        date: new Date().toLocaleDateString('tr-TR') // Tarih ekledik
    };
    setActiveOrders(prevOrders => [newOrder, ...prevOrders]);
    setCartItems([]); 
    setActiveTab("success");
  };

  const handleOrderStatusUpdate = (orderId, newStatus) => {
     // Admin "Teslim Edildi" derse, sipariş listeden SİLİNMEZ, sadece durumu güncellenir.
     // Böylece öğrenci "Puanla" butonunu görebilir.
     setActiveOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
     ));
  };

  // YENİ: PUANLAMA ve ARŞİVLEME
  const handleRateAndArchive = (orderId, rating, comment) => {
    // 1. İlgili siparişi bul
    const orderToArchive = activeOrders.find(o => o.id === orderId);
    
    if (orderToArchive) {
        // 2. Puanı ve yorumu ekle
        const archivedOrder = { ...orderToArchive, rating, comment, status: 'Tamamlandı' };
        
        // 3. Geçmiş Siparişlere ekle
        setPastOrders(prev => [archivedOrder, ...prev]);

        // 4. Aktif Siparişlerden sil
        setActiveOrders(prev => prev.filter(o => o.id !== orderId));
        
        // 5. Modalı kapat
        setRatingOrder(null);
    }
  };

  const filteredProducts = activeCategory === "Tümü" ? products : products.filter(p => p.category === activeCategory);

  // --- RENDER ---

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;
  
  if (userInfo?.role === 'staff') {
    return (
      <AdminDashboard 
          products={products} 
          orders={activeOrders} 
          onUpdateStock={handleStockToggle} 
          onUpdateOrderStatus={handleOrderStatusUpdate} 
          onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* MODALLAR */}
      {selectedOrderForModal && (
        <OrderDetailsModal 
          order={selectedOrderForModal} 
          onClose={() => setSelectedOrderForModal(null)} 
        />
      )}

      {/* Puanlama Modalı */}
      {ratingOrder && (
        <RatingModal 
           order={ratingOrder}
           onClose={() => setRatingOrder(null)}
           onSubmit={handleRateAndArchive}
        />
      )}

      <Navbar 
        cartCount={cartItems.length} 
        onGoHome={() => setActiveTab("menu")}
        onGoCart={() => setActiveTab("cart")}
        onLogout={handleLogout}
        // Profil için yeni bir ikon ekleyebiliriz ama şimdilik "Logoya" basınca menüye dönüyor.
        // Profil sayfasına geçiş için Navbar'a yeni bir buton eklemek gerekebilir
        // veya Menüde bir buton olabilir. Şimdilik Navbar'da "Profil" butonu varmış gibi davranalım.
      />

      {/* --- SAYFALAR --- */}

      {activeTab === "profile" ? (
         // YENİ: PROFİL SAYFASI
         <ProfilePage 
            userInfo={userInfo}
            pastOrders={pastOrders}
            onGoBack={() => setActiveTab("menu")}
         />

      ) : activeTab === "cart" ? (
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
           onGoHome={() => setActiveTab("menu")}
        />

      ) : (
        <>
          {/* MENÜ EKRANI */}
          
          {/* Profil Butonu (Menünün Üstüne Ekledim, Hızlı Erişim İçin) */}
          <div className="bg-rose-900 text-white pb-6 pt-2 px-4 shadow-lg">
             <div className="container mx-auto max-w-5xl flex justify-between items-center">
                <span className="text-rose-200 text-sm">Hoş geldin, {userInfo.name} 👋</span>
                <button 
                  onClick={() => setActiveTab("profile")}
                  className="bg-rose-800 hover:bg-rose-700 px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1"
                >
                  👤 Profilim
                </button>
             </div>
          </div>

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
                        <MyOrders 
                          orders={activeOrders} 
                          onViewDetails={(order) => setSelectedOrderForModal(order)}
                          onRate={(order) => setRatingOrder(order)} // Puanla'ya basınca
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