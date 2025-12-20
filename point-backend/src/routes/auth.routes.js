import express from "express";
import { login, register } from "../controllers/auth.controller.js"; // register'ı buraya ekledik

const router = express.Router();

// Kayıt olma endpoint'i
// POST /api/auth/register
router.post("/register", register); // Bu satırı ekledik

// Giriş yapma endpoint'i
// POST /api/auth/login
router.post("/login", login);

export default router;
