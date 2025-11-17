const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
require('dotenv').config();

// ---------------- REGISTER ----------------
router.post(
  '/register',
  [
    body('username', 'Username is required').notEmpty(),
    body('email', 'Valid email required').isEmail(),
    body('password', 'Password must be 6+ characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      let existing = await User.findOne({ email });
      if (existing)
        return res
          .status(400)
          .json({ success: false, message: 'User already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        username,
        email,
        passwordHash,
      });
      await user.save();

      // Generate token
      const payload = { user: { id: user.id } };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
        },
      });
    } catch (err) {
      console.error('Register error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid credentials (user not found)' });

    if (!user.passwordHash)
      return res.status(400).json({ success: false, message: 'User data incomplete — please register again' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid credentials (wrong password)' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
module.exports = router;

