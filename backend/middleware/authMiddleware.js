const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 FORCE CONSISTENT FORMAT
    req.user = {
      id: decoded.id
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = verifyToken;