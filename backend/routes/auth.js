const express = require("express");
const router = express.Router();
const { signup, login, getMe, logout } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// POST /auth/signup
router.post("/signup", signup);

// POST /auth/login
router.post("/login", login);

// GET /auth/user  — protected, matches VITE_BACKEND_URL/auth/user in userStore
router.get("/user", protect, getMe);

// POST /auth/user/logout
router.post("/user/logout", logout);

// Also handle the redirect-style logout the frontend does (window.location.href = LOGOUT_ENDPOINT)
router.get("/user/logout", logout);

module.exports = router;
