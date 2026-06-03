require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
// 1. Expanded CORS Configuration
app.use(cors({
  origin: [
    "https://eventify-frontend-mauve.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] // Explicitly allow these headers
}));

// 2. Explicitly handle pre-flight OPTIONS requests for all routes
app.options('*', cors());

app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);

// Health check
app.get("/", (_req, res) => res.json({ status: "ok", service: "Eventify API" }));

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Route not found." }));

// Error Handler
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

// vercel works as a serverless service isliye server.js file ko end mai export karna bahut jaruri hai yaha par
module.exports = app;
