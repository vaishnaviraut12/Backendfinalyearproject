const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Profile = require("../models/Profile");

// ─── HELPER: GENERATE JWT TOKEN ───────────────────────────────
function generateToken(id) {
  // Safety Check: Ensure secret exists
  if (!process.env.JWT_SECRET) {
    console.error("⚠️ FATAL ERROR: JWT_SECRET is missing in environment variables.");
    throw new Error("Server configuration error: JWT_SECRET missing");
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

// ─── REGISTER ─────────────────────────────────────────────────
// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 2. Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 3. Create User (Password hashing should happen in the User Model)
    const user = await User.create({ name, email, password });

    // 4. Create associated Profile
    await Profile.create({ email: user.email, username: name });

    // 5. Respond
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    // Handle potential Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

// ─── LOGIN ────────────────────────────────────────────────────
// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // 2. Find User (Important: .select('+password') might be needed if password is excluded by default)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Check Password (Calls the method defined in your User Model)
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Respond
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;