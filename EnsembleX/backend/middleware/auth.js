const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader)
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded.user; // ✅ sets req.user for routes like posts

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ success: false, message: 'Token invalid' });
  }
};
