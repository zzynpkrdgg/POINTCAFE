import db from "../config/db.js";
import bcrypt from "bcrypt";

// KULLANICI KAYIT (Register)
export const registerUser = async (userData) => {
  const { UserName, UserSurname, Email, Password, PhoneNumber } = userData;
  try {
    // 1. Şifreyi şifrele (Hash)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // 2. Senin sütun isimlerine göre MySQL'e kaydet
    const [result] = await db.execute(
      "INSERT INTO USERS (UserName, UserSurname, Email, Password, PhoneNumber, Is_Deleted) VALUES (?, ?, ?, ?, ?, 0)",
      [UserName, UserSurname, Email, hashedPassword, PhoneNumber]
    );

    return { id: result.insertId, UserName, Email };
  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
};

// KULLANICI GİRİŞİ (Login)
export const loginUser = async (Email, Password) => {
  try {
    // Senin sütun ismin olan Email ile ara
    const [rows] = await db.execute("SELECT * FROM USERS WHERE Email = ? AND Is_Deleted = 0", [Email]);
    const user = rows[0];

    if (!user) return null;

    // Şifreleri karşılaştır
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return null;

    // Şifreyi güvenlik için çıkarıp geri dön
    const { Password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
};

