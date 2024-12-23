const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: 'Access Denied' });

  const token = authHeader.split(' ')[1]; // Extract token after "Bearer"
  if (!token) return res.status(401).json({ message: 'Token Missing' });

  try {
    console.log(token, 'token');
    console.log(process.env.JWT_SECRET, 'secret');

    const verified = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is loaded
    req.user = verified;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    res.status(400).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
