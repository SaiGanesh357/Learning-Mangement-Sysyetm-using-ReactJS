const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Register user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Save token in MongoDB
    user.tokens.push({ token });
    await user.save();

    // Send token in secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
      maxAge: 3600000,
    });

    res.json({ msg: "Login successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.tokens = []; // clear all tokens
      await user.save();
    }
    res.clearCookie("token");
    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
