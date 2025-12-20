import { loginUser, registerUser } from "../services/auth.service.js";

// KULLANICI KAYIT (Register)
export const register = async (req, res) => {
  try {
    // Postman'den gelen verileri alıyoruz
    const user = await registerUser(req.body);
    
    return res.status(201).json({
      success: true,
      message: "Kullanıcı başarıyla kaydedildi",
      user: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Kayıt sırasında bir hata oluştu: " + error.message
    });
  }
};

// KULLANICI GİRİŞİ (Login)
export const login = async (req, res) => {
  const { Email, Password } = req.body; // MySQL sütun isimlerine (Büyük harf) dikkat!

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

