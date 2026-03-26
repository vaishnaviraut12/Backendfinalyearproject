const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    // Create user - password will be hashed by pre-save hook
    const user = new User({ 
      name: name || email.split('@')[0],
      email: email.toLowerCase(), 
      password: password  // Will be hashed automatically
    });
    await user.save();
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.status(201).json({ 
      token, 
      user: { 
        email: user.email, 
        name: user.name,
        id: user._id 
      } 
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Use the matchPassword method from User model
    const isValid = await user.matchPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({ 
      token, 
      user: { 
        email: user.email, 
        name: user.name,
        id: user._id 
      } 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;