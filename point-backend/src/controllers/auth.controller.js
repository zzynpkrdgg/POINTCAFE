export const login = (req, res) => {
  const { email } = req.body;

  // Geçici mock login
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email zorunlu"
    });
  }

  res.json({
    success: true,
    user: {
      email,
      role: email === "admin@point.com" ? "staff" : "student"
    }
  });
};
