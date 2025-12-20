import db from "../config/db.js";
import bcrypt from "bcrypt";

// KULLANICI KAYIT (Register)
export const registerUser = async (userData) => {
  // Frontend'den küçük harfle veya büyük harfle gelebilir
  const UserName = userData.UserName || userData.userName || userData.firstName;
  const UserSurname = userData.UserSurname || userData.userSurname || userData.lastName;
  const Email = userData.Email || userData.email;
  const Password = userData.Password || userData.password;
  const PhoneNumber = userData.PhoneNumber || userData.phoneNumber || null;

  // Debug: Gelen verileri logla
  console.log("🔍 Register - req.body:", JSON.stringify(userData));
  console.log("🔍 Register - Parsed:", {
    UserName,
    UserSurname,
    Email,
    Password: Password ? "***" : "undefined",
    PasswordType: typeof Password,
    PhoneNumber
  });

  // Validation - Daha sıkı kontrol
  if (!UserName || UserName.trim() === '') {
    throw new Error("Ad gereklidir!");
  }
  if (!UserSurname || UserSurname.trim() === '') {
    throw new Error("Soyad gereklidir!");
  }
  if (!Email || Email.trim() === '') {
    throw new Error("E-posta gereklidir!");
  }
  if (!Password || Password.trim() === '' || typeof Password !== 'string') {
    throw new Error("Şifre gereklidir!");
  }

  try {
    // 1. Email'in zaten kullanılıp kullanılmadığını kontrol et
    const [existingUsers] = await db.execute(
      "SELECT Email FROM USERS WHERE Email = ? AND Is_Deleted = 0",
      [Email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Bu e-posta adresi zaten kayıtlı!");
    }

    // 2. Şifreyi şifrele (Hash) - Password'un string olduğundan ve geçerli olduğundan emin ol
    if (!Password || typeof Password !== 'string' || Password.trim().length === 0) {
      console.error("❌ Password hatası - Password:", Password, "Type:", typeof Password);
      throw new Error("Geçerli bir şifre giriniz!");
    }
    
    // Password'u trim'le ve kontrol et
    const trimmedPassword = Password.trim();
    if (trimmedPassword.length < 6) {
      throw new Error("Şifre en az 6 karakter olmalıdır!");
    }
    
    console.log("🔍 Password hash'leniyor - Length:", trimmedPassword.length);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(trimmedPassword, salt);

    // 3. Senin sütun isimlerine göre MySQL'e kaydet
    const [result] = await db.execute(
      "INSERT INTO USERS (UserName, UserSurname, Email, Password, PhoneNumber, Is_Deleted) VALUES (?, ?, ?, ?, ?, 0)",
      [UserName, UserSurname, Email, hashedPassword, PhoneNumber]
    );

    // 4. Email'e göre role belirle
    const role = Email.endsWith('@point.com') ? 'staff' : 'student';
    
    // 5. Kaydedilen kullanıcıyı döndür (şifre hariç)
    return { 
      UserID: result.insertId, 
      UserName, 
      UserSurname,
      Email,
      PhoneNumber,
      role
    };
  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
};

// KULLANICI GİRİŞİ (Login)
export const loginUser = async (Email, Password) => {
  try {
    // Email ve Password kontrolü
    if (!Email || !Password) {
      throw new Error("E-posta ve şifre gereklidir");
    }

    // Senin sütun ismin olan Email ile ara
    const [rows] = await db.execute("SELECT * FROM USERS WHERE Email = ? AND Is_Deleted = 0", [Email]);
    const user = rows[0];

    if (!user) return null;

    // Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return null;

    // Şifreyi güvenlik için çıkarıp geri dön
    const { Password: _, ...userWithoutPassword } = user;
    
    // Email'e göre role ekle
    const role = Email.endsWith('@point.com') ? 'staff' : 'student';
    
    return {
      ...userWithoutPassword,
      role
    };
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
};

