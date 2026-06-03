const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ALLOWED_DOMAINS = ["@itbhu.ac.in", "@iitbhu.ac.in"];

// ── helper ──────────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ── POST /auth/signup ────────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    // Domain check (also enforced at model level, but good to give a clear message here)
    const emailLower = email.toLowerCase().trim();
    const allowed = ALLOWED_DOMAINS.some((d) => emailLower.endsWith(d));
    if (!allowed) {
      return res.status(400).json({
        message: "Only @itbhu.ac.in or @iitbhu.ac.in email addresses are allowed.",
      });
    }

    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email: emailLower, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: user.toClientJSON(),
    });
  } catch (err) {
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error during signup." });
  }
};

// ── POST /auth/login ─────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // select: false on password — must explicitly ask for it
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      token,
      user: user.toClientJSON(),
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
};

// ── GET /auth/user  (requires Bearer token) ───────────────────────────────────
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  return res.status(200).json({ user: req.user.toClientJSON() });
};

// ── POST /auth/user/logout ────────────────────────────────────────────────────
// JWT is stateless — logout is handled client-side by deleting the token.
// This endpoint exists so the frontend's LOGOUT_ENDPOINT redirect works.
const logout = (_req, res) => {
  return res.status(200).json({ message: "Logged out successfully. Please delete your token client-side." });
};

module.exports = { signup, login, getMe, logout };
