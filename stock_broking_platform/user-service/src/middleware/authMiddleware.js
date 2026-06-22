const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../services/authService');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: 'No token' });
    }

    const token = header.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();

  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};