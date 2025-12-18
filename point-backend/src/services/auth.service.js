import mockUsers from "../data/mockUsers.js";

export const loginUser = (email, password) => {
  // Kullanıcıyı listede ara
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) return null;

  // Güvenlik için şifreyi objeden çıkarıp geri kalanı dönüyoruz
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};