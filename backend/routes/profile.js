const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, cgpa, branch, skills, resume } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, cgpa, branch, skills, resume },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;