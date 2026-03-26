const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────
// Replace the current app.use(cors(...)) with this:
app.use(cors({
  origin: true, // This allows ALL origins (Vercel, Localhost, etc.)
  credentials: true
}));

// Increase limit to allow base64 NFT images
app.use(express.json({ limit: "10mb" }));

// ─── REQUEST LOGGER ───────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/auth"));
app.use("/api/profile",       require("./routes/profile"));
app.use("/api/nfts",          require("./routes/nfts"));
app.use("/api/history",       require("./routes/priceHistory"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/public",        require("./routes/publicProfile"));

// ─── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status:   "✅ NFT Marketplace API is running",
    database: mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected",
    time:     new Date().toISOString(),
  });
});

// ─── 404 HANDLER ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ─── CONNECT DB & START ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    // FIXED: Added || operator
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // FIXED: Added backticks
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });