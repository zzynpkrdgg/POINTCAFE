import db from "../config/db.js";
import bcrypt from "bcrypt";

// KULLANICI KAYIT (Register)
export const registerUser = async (userData) => {
  try {
    // Frontend'den küçük harfle veya büyük harfle gelebilir
    const UserName = userData.UserName || userData.userName || userData.firstName;
    const UserSurname = userData.UserSurname || userData.userSurname || userData.lastName;
    const Email = (userData.Email || userData.email || "").toLowerCase();
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

    // 0. DOMAIN KONTROLÜ VE ROL BELİRLEME
    const isOwnerDomain = Email.endsWith('@point.com');
    const isStudentDomain = Email.endsWith('@ankara.edu.tr');
    let assignedRole = '';

    if (isOwnerDomain) {
      // 1. Yönetici Kontrolü: Zaten bir yönetici var mı?
      const [existingOwners] = await db.execute("SELECT COUNT(*) as count FROM owner");
      if (existingOwners[0].count > 0) {
        throw new Error("Sistemde zaten 1 yönetici kayıtlı! İkinci bir yönetici kaydı yapılamaz.");
      }
      assignedRole = 'owner';
    } else if (isStudentDomain) {
      assignedRole = 'customer';
    } else {
      throw new Error("Sadece '@ankara.edu.tr' (Öğrenci) veya '@point.com' (Personel) adresleri kabul edilmektedir.");
    }

    // 1. Email kontrolü (Mevcut kullanıcı var mı?)
    const [existingUsers] = await db.execute(
      "SELECT Email FROM USERS WHERE Email = ? AND Is_Deleted = 0",
      [Email]
    );

    if (existingUsers.length > 0) {
      throw new Error("Bu e-posta adresi zaten kayıtlı!");
    }

    // 2. Şifreleme
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password.trim(), salt);

    // 3. USERS tablosuna kayıt
    const [result] = await db.execute(
      "INSERT INTO USERS (UserName, UserSurname, Email, Password, PhoneNumber, Is_Deleted) VALUES (?, ?, ?, ?, ?, 0)",
      [UserName, UserSurname, Email, hashedPassword, PhoneNumber]
    );
    const newUserId = result.insertId;

    // 4. Tablo Dağıtımı (Role Göre)
    if (assignedRole === 'owner') {
      await db.execute("INSERT INTO owner (UserID) VALUES (?)", [newUserId]);
    } else {
      await db.execute("INSERT INTO customer (UserID) VALUES (?)", [newUserId]);
    }

    // 5. Frontend'e dönecek veri (Tek bir return)
    return {
      UserID: newUserId,
      UserName,
      UserSurname,
      Email,
      PhoneNumber,
      role: assignedRole
    };

  } catch (error) {
    console.error("Kayıt hatası:", error);
    throw error;
  }
};

// KULLANICI GİRİŞİ (Login)
export const loginUser = async (Email, Password) => {
  try {
    if (!Email || !Password) {
      throw new Error("E-posta ve şifre gereklidir");
    }

    const [rows] = await db.execute("SELECT * FROM USERS WHERE Email = ? AND Is_Deleted = 0", [Email]);
    const user = rows[0];

    if (!user) return null;

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) return null;

    // Şifreyi objeden çıkar
    const { Password: _, ...userWithoutPassword } = user;

    // ROL KONTROLÜ: Owner tablosunda var mı?
    const [ownerRows] = await db.execute("SELECT UserID FROM owner WHERE UserID = ?", [user.UserID]);
    const role = ownerRows.length > 0 ? 'owner' : 'customer';

    return {
      ...userWithoutPassword,
      role: role
    };
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error;
  }
};

// OWNER KONTROLÜ
export const checkOwnerExists = async () => {
  const [rows] = await db.execute("SELECT COUNT(*) as count FROM owner");
  return rows[0].count > 0;
};