import { loginUser } from "../services/auth.service.js";

export const login = (req, res) => {
  const { email, password } = req.body;

  const user = loginUser(email, password);

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
};

