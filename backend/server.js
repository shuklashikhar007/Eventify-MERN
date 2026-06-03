require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "https://eventify-frontend-b634.vercel.app",
    "http://localhost:5173"
  ]
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", service: "Eventify API" }));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Route not found." }));
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Eventify API running on http://localhost:${PORT}`);
  });
});

module.exports = app;
//  vercel works as a serverless service isliye server.js file ko end mai export karna bahut jaruri hai yaha par
