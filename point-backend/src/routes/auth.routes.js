import express from "express";
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

// Giriş yapma endpoint'i
// POST /api/auth/login
router.post("/login", login);

export default router;
