const express = require("express");
const router = express.Router();
const db = require("../db"); // Your SQLite DB connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// Fallback in case env is missing
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// ==================== LOGIN ROUTE ====================
router.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const query = `SELECT id, email, password, role FROM users WHERE email = ?`;

    db.get(query, [email], (err, row) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!row) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Compare password
      const isMatch = bcrypt.compareSync(password, row.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Prepare JWT payload
      const payload = {
        id: row.id,
        role: row.role,
        email: row.email,
      };

      // Sign token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

      return res.json({
        message: "Login successful",
        token,
        role: row.role,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ==================== EXPORT ====================
module.exports = router;
