const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

/* =========================
   REGISTER USER
========================= */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation (backend safety)
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // check if user exists
    const checkUserSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkUserSql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(insertSql, [name, email, hashedPassword], (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Registration failed" });
        }

        res.json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN USER
========================= */
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    // EMAIL NOT FOUND
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const user = results[0];

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      message: "Login successful"
    });
  });
};