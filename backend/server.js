const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ─── CORS - Allow Vercel domains ──────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  /^https:\/\/.*\.vercel\.app$/,
  /^https:\/\/.*\.railway\.app$/,
  /^https:\/\/.*\.netlify\.app$/
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".railway.app")
    ) {
      return callback(null, true);
    }
    callback(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ─── DEBUG: log every incoming request ────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || "unknown"}`);
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/nfts",    require("./routes/nfts"));
app.use("/api/history",       require("./routes/priceHistory"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/public",         require("./routes/publicProfile"));

// ─── HEALTH CHECK ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "✅ NFT Marketplace API is running" });
});

// ─── 404 CATCH-ALL ────────────────────────────────────────────────
app.use((req, res) => {
  console.error(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ─── CONNECT DB & START ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });