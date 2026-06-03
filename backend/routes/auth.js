const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// POST /auth/signup
router.post("/signup", authController.signup);

// POST /auth/login
router.post("/login", authController.login);

// POST /auth/user/logout  (must be defined BEFORE /user so Express doesn't swallow it)
router.post("/user/logout", authController.logout);
router.get("/user/logout", authController.logout);

// GET /auth/user — protected
router.get("/user", authMiddleware.protect, authController.getMe);

module.exports = router;