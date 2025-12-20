import { loginUser, registerUser } from "../services/auth.service.js";

// KULLANICI KAYIT (Register)
export const register = async (req, res) => {
  try {
    // Debug: Gelen request body'yi logla
    console.log("🔍 Register Controller - req.body:", JSON.stringify(req.body));
    
    // req.body kontrolü
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: "İstek gövdesi boş olamaz!"
      });
    }

    const user = await registerUser(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla kaydedildi",
      user: user
    });
  } catch (error) {
    console.error("❌ Register Controller Hatası:", error);
    // E-posta zaten kayıtlı hatası için 409 (Conflict) kullan
    const statusCode = error.message.includes("zaten kayıtlı") ? 409 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Kayıt sırasında bir hata oluştu"
    });
  }
};

// KULLANICI GİRİŞİ (Login)
export const login = async (req, res) => {
  // Frontend'den küçük harfle (email, password) veya büyük harfle (Email, Password) gelebilir
  const Email = req.body.Email || req.body.email;
  const Password = req.body.Password || req.body.password;

  // Email ve Password kontrolü
  if (!Email || !Password) {
    return res.status(400).json({
      success: false,
      message: "E-posta ve şifre gereklidir!"
    });
  }

  try {
    const user = await loginUser(Email, Password);

    if (user) {
      return res.json({
        success: true,
        message: "Giriş başarılı",
        user: user
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "E-posta veya şifre hatalı!"
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Sunucu hatası: " + error.message
    });
  }
};

