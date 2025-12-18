import { useState, useEffect } from 'react';

// --- BİLEŞENLERİN İÇE AKTARILMASI (COMPONENT IMPORTS) ---
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
import RatingModal from './assets/RatingModal';
import ProfilePage from './assets/ProfilePage';

function App() {
  // ========================================================================
  // 1. STATE YÖNETİMİ (DURUM KONTROLÜ)
  // ========================================================================

  // Kullanıcı Oturum Bilgileri
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userInfo, setUserInfo] = useState(null); // Giriş yapanın Ad, Soyad, Rol bilgisi

  // Navigasyon Yönetimi (Hangi ekranın aktif olduğunu tutar)
  // Değerler: 'menu', 'cart', 'payment', 'success', 'profile'
  const [activeTab, setActiveTab] = useState("menu"); 
  const [activeCategory, setActiveCategory] = useState("Tümü");

  // Sipariş Süreç Verileri
  const [cartItems, setCartItems] = useState([]); // Sepetteki anlık ürünler
  const [pickupTime, setPickupTime] = useState(null); // Kullanıcının seçtiği teslim saati
  
  // Veritabanı Simülasyonu (Backend olmadığı için listeleri burada tutuyoruz)
  // activeOrders: Mutfaktaki veya yoldaki siparişler
  // pastOrders: Tamamlanmış ve puanlanmış siparişler
  const [activeOrders, setActiveOrders] = useState([]); 
  const [pastOrders, setPastOrders] = useState([]); 
  
  // Modal (Açılır Pencere) Kontrolleri
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null); // Detay penceresi için
  const [ratingOrder, setRatingOrder] = useState(null); // Puanlama penceresi için

  // Ürün Kataloğu (Yönetici panelinden stok durumu değiştirilebilir)
  // BAŞLANGIÇTA BOŞ DİZİ OLUŞTURUYORUZ
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  

  const categories = ["Tümü", "Yemekler", "Soğuk İçecekler", "Sıcak İçecekler"];

  // SAYFA YÜKLENDİĞİNDE BACKEND'DEN VERİ ÇEKME (FETCH)
  useEffect(() => {
  fetch("http://127.0.0.1:5001/api/products")
    .then(res => res.json())
    .then(data => {
      console.log("Backend'den gelen ürünler:", data);
      
      // Görseli olmayan ürünlere kategoriye göre geçici görsel atama
      const enrichedData = data.map(p => {
        if (p.image) return p; // Görsel varsa dokunma
        let img = "https://via.placeholder.com/300x200?text=PointCafe";
        if (p.category === "Yemekler") img = "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60";
        else if (p.category === "Soğuk İçecekler") img = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60";
        else if (p.category === "Sıcak İçecekler") img = "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60";
        return { ...p, image: img };
      });

      setProducts(enrichedData);
      setFilteredProducts(enrichedData); 
    })
    .catch(err => console.error(err));
}, []);

  useEffect(() => {
  if (activeCategory === "Tümü") {
    setFilteredProducts(products);
  } else {
    setFilteredProducts(
      products.filter(p => p.category === activeCategory)
    );
  }
}, [activeCategory, products]);


  // ========================================================================
  // 2. İŞ MANTIĞI FONKSİYONLARI (BUSINESS LOGIC)
  // ========================================================================

  /**
   * Giriş başarılı olduğunda çalışır.
   * Backend simülasyonu yaparak kullanıcı rolüne göre veri atar.
   */
  const handleLoginSuccess = (role) => {
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

  /**
   * Çıkış yapma işlemi.
   * NOT: activeOrders ve pastOrders bilerek silinmiyor. 
   * Böylece demo sırasında öğrenci sipariş verip çıkınca, admin girip o siparişi görebilir.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setCartItems([]);
  };

  // Yönetici Panelinden Stok Durumu (Var/Yok) Değiştirme
  const handleStockToggle = (productId) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p));
  };

  // Sepete Ürün Ekleme (Aynı ürün varsa miktar artırır)
  const handleAddToCart = (product) => {
    if (!product.inStock) return; // Stok kontrolü
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten Ürün Silme
  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleTimeSelected = (time) => {
    setPickupTime(time);
  };

  /**
   * Ödeme Başarılı Olduğunda Çalışır.
   * Sepeti boşaltır ve yeni bir 'Aktif Sipariş' oluşturur.
   */
  const handleOrderCompleted = (note) => {
    const newOrder = {
        id: Math.floor(Math.random() * 10000) + 1000, // 4 haneli rastgele ID
        items: [...cartItems],
        totalAmount: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        pickupTime: pickupTime,
        note: note,
        status: 'Hazırlanıyor',
        date: new Date().toLocaleDateString('tr-TR')
    };
    // Yeni siparişi listenin en başına ekle (LIFO mantığına benzer görünüm için)
    setActiveOrders(prevOrders => [newOrder, ...prevOrders]);
    setCartItems([]); 
    setActiveTab("success");
  };

  /**
   * Yönetici Panelinden Sipariş Durumu Güncelleme.
   * Eğer durum 'Teslim Edildi' olursa, sipariş silinmez; durumu güncellenir.
   * Böylece öğrenci panelinde 'Puanla' butonu aktif olur.
   */
  const handleOrderStatusUpdate = (orderId, newStatus) => {
     setActiveOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
     ));
  };

  /**
   * Puanlama ve Arşivleme İşlemi.
   * Sipariş 'Aktif' listeden çıkarılıp 'Geçmiş' listesine taşınır.
   */
  const handleRateAndArchive = (orderId, rating, comment) => {
    const orderToArchive = activeOrders.find(o => o.id === orderId);
    if (orderToArchive) {
        const archivedOrder = { ...orderToArchive, rating, comment, status: 'Tamamlandı' };
        setPastOrders(prev => [archivedOrder, ...prev]);
        setActiveOrders(prev => prev.filter(o => o.id !== orderId));
        setRatingOrder(null);
    }
  };

  // ========================================================================
  // 3. RENDER (GÖRÜNÜM KATMANI)
  // ========================================================================

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;
  
  // Personel Girişi -> Admin Paneli Render Edilir
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

  // Öğrenci Girişi -> Ana Uygulama Render Edilir
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* --- MODALLAR (Sayfanın en üst katmanı) --- */}
      {selectedOrderForModal && (
        <OrderDetailsModal 
          order={selectedOrderForModal} 
          onClose={() => setSelectedOrderForModal(null)} 
        />
      )}

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
      />

      {/* --- SAYFA YÖNLENDİRMELERİ (ROUTING SİMÜLASYONU) --- */}

      {/* 1. PROFİL SAYFASI */}
      {activeTab === "profile" ? (
         <ProfilePage 
            userInfo={userInfo}
            pastOrders={pastOrders}
            onGoBack={() => setActiveTab("menu")}
         />

      /* 2. SEPET SAYFASI */
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
      
      /* 3. ÖDEME SAYFASI */
      ) : activeTab === "payment" ? (
        <PaymentPage 
           totalAmount={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
           pickupTime={pickupTime}
           onBack={() => setActiveTab("cart")}
           onCompleteOrder={handleOrderCompleted}
        />

      /* 4. BAŞARI SAYFASI */
      ) : activeTab === "success" ? (
        <OrderSuccess 
           pickupTime={pickupTime}
           onGoHome={() => setActiveTab("menu")}
        />

      /* 5. VARSAYILAN: MENÜ SAYFASI */
      ) : (
        <>
          {/* Üst Profil Butonu */}
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

          {/* Bilgi ve Takip Alanı */}
          <div className="bg-white pb-6 rounded-b-3xl shadow-sm mb-6 pt-4">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sol: Saat Seçici */}
                    <div>
                        <TimeSelector onTimeSelect={handleTimeSelected} />
                        {pickupTime && (
                             <div className="text-center mt-2 text-rose-900 font-bold text-sm bg-rose-50 py-1 rounded">
                                Seçilen Saat: {pickupTime}
                            </div>
                        )}
                    </div>
                    {/* Sağ: Sipariş Takibi */}
                    <div>
                        <MyOrders 
                          orders={activeOrders} 
                          onViewDetails={(order) => setSelectedOrderForModal(order)}
                          onRate={(order) => setRatingOrder(order)} 
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* Menü ve Ürünler */}
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
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                Bu kategoride ürün bulunamadı.
              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
}

export default App;