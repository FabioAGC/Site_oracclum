const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // For test credentials
    if (username === 'admin' && password === 'admin') {
      const token = jwt.sign({ username }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '24h'
      });
      return res.json({ token });
    }

    // For database users
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 