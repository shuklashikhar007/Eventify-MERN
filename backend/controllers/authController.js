const jwt = require("jsonwebtoken");
const User = require("../models/User");

const ALLOWED_DOMAINS = ["@itbhu.ac.in", "@iitbhu.ac.in"];

function signToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const emailLower = email.toLowerCase().trim();
    const allowed = ALLOWED_DOMAINS.some(function (d) {
      return emailLower.endsWith(d);
    });

    if (!allowed) {
      return res.status(400).json({
        message: "Only @itbhu.ac.in or @iitbhu.ac.in email addresses are allowed.",
      });
    }

    const existing = await User.findOne({ email: emailLower });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name: name, email: emailLower, password: password });
    const token = signToken(user._id);

    return res.status(201).json({
      token: token,
      user: user.toClientJSON(),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(function (e) {
        return e.message;
      });
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error during signup." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);

    return res.status(200).json({
      token: token,
      user: user.toClientJSON(),
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
}

async function getMe(req, res) {
  return res.status(200).json({ user: req.user.toClientJSON() });
}

function logout(req, res) {
  return res.status(200).json({ message: "Logged out successfully." });
}

module.exports = {
  signup: signup,
  login: login,
  getMe: getMe,
  logout: logout,
};