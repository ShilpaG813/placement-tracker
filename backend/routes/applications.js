const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const authMiddleware = require('../middleware/auth');

// Get all applications
router.get('/', authMiddleware, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add application
router.post('/', authMiddleware, async (req, res) => {
  try {
    const app = new Application({ ...req.body, user: req.user.id });
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update application
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete application
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;