const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log("Decoded token user:", user);  // 👈 see role in console
    req.user = user;
    next();
  });
}


function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
}


module.exports = { authenticateToken, authorizeRole };