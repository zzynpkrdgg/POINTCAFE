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

  const [tempOrderNote, setTempOrderNote] = useState(""); // Geçici not tutucu
  const [lastOrderAmount, setLastOrderAmount] = useState(0);
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

  // 1. OTURUMU HATIRLAMA 
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUserInfo(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  // SAYFA YÜKLENDİĞİNDE VE BELİRLİ ARALIKLARLA BACKEND'DEN VERİ ÇEKME (FETCH)
  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("Backend'den gelen ürünler:", data);

        setProducts(data);
        setFilteredProducts(data);
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

  // Siparişleri düzenli aralıklarla backend'den çekme
  useEffect(() => {
    if (isLoggedIn) {
      const fetchOrders = async () => {
        try {
          let url = "http://127.0.0.1:5001/api/orders";
          if (userInfo && userInfo.role === 'customer') {
            url += `?email=${userInfo.email}`;
          }

          const response = await fetch(url);
          const data = await response.json();

          if (data.success) {
            const active = data.orders
              .filter(o => ['Hazırlanıyor', 'Hazırlanıyor_Basladi', 'Hazır', 'Teslim Edildi'].includes(o.status))
              .map(o => ({
                ...o,
              }));

            const past = data.orders.filter(o => o.status === 'Tamamlandı');

            setActiveOrders(active);
            setPastOrders(past);
          }
        } catch (error) {
          console.error("Siparişler çekilemedi:", error);
        }
      };

      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userInfo]); // userInfo eklendi çünkü email'e ihtiyacımız var

  // ========================================================================
  // 2. İŞ MANTIĞI FONKSİYONLARI (BUSINESS LOGIC)
  // ========================================================================

  /**
   * Giriş başarılı olduğunda çalışır.
   * Backend simülasyonu yaparak kullanıcı rolüne göre veri atar.
   */
  const handleLoginSuccess = (userData) => {
    setUserInfo(userData);
    setIsLoggedIn(true);

    // SAYFA YENİLENİNCE OTURUMUN GİTMEMESİ İÇİN:
    localStorage.setItem('user', JSON.stringify(userData));

    if (userData.role === 'customer') {
      setActiveTab("menu");
    }
  };

  /**
   * Çıkış yapma işlemi.
   * NOT: activeOrders ve pastOrders bilerek silinmiyor. 
   * Böylece demo sırasında öğrenci sipariş verip çıkınca, admin girip o siparişi görebilir.
   */
  const handleLogout = () => {
    localStorage.removeItem('user'); // Hafızayı sil
    setIsLoggedIn(false);
    setUserInfo(null);
    setCartItems([]);
  };

  // Yönetici Panelinden Stok Durumu Değiştirme
  const handleStockToggle = async (productId) => {
    try {
      const productToToggle = products.find(p => p.id === productId);
      if (!productToToggle) return;
      const newStock = productToToggle.stock > 0 ? 0 : 10;

      // Backend'e stok güncelleme isteği gönderiyoruz
      await fetch(`http://127.0.0.1:5001/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });

      // Başarılı olursa veya optimistik olarak frontend state'i güncelliyoruz
      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId
            ? { ...p, stock: newStock }
            : p
        )
      );
    } catch (error) {
      console.error("Stok güncellenemedi:", error);
    }
  };

  // Sepete Ürün Ekleme (Aynı ürün varsa miktar artırır)
  const handleAddToCart = (product) => {
    if (product.stock === 0) return; // Stok kontrolü
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
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        // Miktar 1'den büyükse sadece azalt
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        // Miktar 1 ise veya bulunamadıysa listeden tamamen çıkar
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };

  // Sepetten Ürünü Miktar Gözetmeksizin Tamamen Sil (Yeni)
  const handleClearFromCart = (productId) => {
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
    setCartItems([]);
    setActiveTab("success");
  };

  /**
   * Yönetici Panelinden Sipariş Durumu Güncelleme.
   * Eğer durum 'Teslim Edildi' olursa, sipariş silinmez; durumu güncellenir.
   * Böylece öğrenci panelinde 'Puanla' butonu aktif olur.
   */
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // ÖNEMLİ: Eğer admin "Teslim Edildi" dediyse, bu metin MyOrders.jsx'teki 
        // {order.status === 'Teslim Edildi'} kontrolünü tetikler.
        setActiveOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Durum güncelleme hatası:", error);
    }
  };


  /**
   * Puanlama ve Arşivleme İşlemi (Backend Bağlantılı)
   * Siparişi 'Tamamlandı' yapar ve puan/yorum bilgilerini kaydeder.
   */
  const handleRateAndArchive = async (orderId, rating, comment) => {
    try {
      // 1. Backend'e PATCH isteği gönderiyoruz
      const response = await fetch(`http://127.0.0.1:5001/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Tamamlandı', // Siparişi arşive taşımak için durumunu güncelliyoruz
          rating: rating,       // Yıldız puanı
          comment: comment      // Kullanıcı yorumu
        })
      });

      const data = await response.json();

      // App.jsx içindeki fetchOrders fonksiyonunun içi:
      // App.jsx - fetchOrders içindeki filtreleme kısmı
      // handleRateAndArchive fonksiyonunun data.success bloğu içi
      if (data.success) {
        // 1. Yerel state'den anında sil (Beklememek için)
        setActiveOrders(prev => prev.filter(o => o.id !== orderId));

        // 2. Geçmişe anında ekle
        setPastOrders(prev => [{ ...data.order }, ...prev]);

        // 3. Modalı kapat
        setRatingOrder(null);
      } else {
        alert("Hata: " + data.message);
      }
    } catch (error) {
      console.error("Puanlama kaydedilirken hata oluştu:", error);
      alert("Sunucuya bağlanılamadı, puanlama kaydedilemedi.");
    }
  };

  // ========================================================================
  // 3. RENDER (GÖRÜNÜM KATMANI)
  // ========================================================================

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  // Personel Girişi -> Admin Paneli Render Edilir
  if (userInfo?.role === 'owner') {
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
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onGoHome={() => setActiveTab("menu")}
        onGoCart={() => setActiveTab("cart")}
        onLogout={handleLogout}
        cartItems={cartItems}
      />

      {/* --- SAYFA YÖNLENDİRMELERİ (ROUTING SİMÜLASYONU) --- */}

      {/* 1. PROFİL SAYFASI */}
      {activeTab === "profile" ? (
        <ProfilePage
          userInfo={userInfo}
          pastOrders={pastOrders}
          onGoBack={() => setActiveTab("menu")}
        />

        /* 2. SEPET SAYFASI (activeTab === "cart") */
      ) : activeTab === "cart" ? (
        <CartPage
          cartItems={cartItems}
          onRemove={handleRemoveFromCart}
          onClear={handleClearFromCart}
          onGoBack={() => setActiveTab("menu")}
          onConfirm={async (userNote) => {
            if (!pickupTime) {
              alert("Lütfen bir teslim alma saati seçiniz!");
              setActiveTab("menu");
              return;
            }

            // Backend'e gönderilecek paket (tutar vs. backend'de)
            const orderData = {
              UserID: userInfo?.UserID || null,
              userName: userInfo?.name || userInfo?.UserName || "Bilinmeyen Öğrenci",
              userEmail: userInfo?.email || userInfo?.Email,
              items: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
              })),
              pickupTime: pickupTime,
              note: userNote,
              status: "Hazırlanıyor"
            };

            try {
              const response = await fetch("http://127.0.0.1:5001/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
              });

              const data = await response.json();

              if (data.success) {
                // BACKEND'İN HESAPLADIĞI TUTARI KAYDET
                setLastOrderAmount(data.order.totalAmount);

                if (typeof setTempOrderNote === 'function') {
                  setTempOrderNote(userNote);
                }

                setCartItems([]);
                setActiveTab("payment");
              } else {
                alert("Hata: " + data.message);
              }
            } catch (error) {
              console.error("Hata:", error);
            }
          }}
        />

        /* 3. ÖDEME SAYFASI */
      ) : activeTab === "payment" ? (
        <PaymentPage
          totalAmount={lastOrderAmount}
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              {/* Kategoriler */}
              <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar w-full md:flex-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? "bg-rose-900 text-white shadow-lg transform scale-105" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Arama Çubuğu */}
              <div className="relative w-full md:w-64 shrink-0">
                <input
                  type="text"
                  placeholder="Ürünlerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent text-sm shadow-sm transition-all"
                />
                <svg className="absolute left-3 top-3 text-gray-400 w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">{activeCategory} Menüsü</h2>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                    onRemove={handleRemoveFromCart}
                    cartItems={cartItems}
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