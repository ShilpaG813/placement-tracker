const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const authMiddleware = require('../middleware/auth');

// Get all reminders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ interviewDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add reminder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const reminder = new Reminder({ ...req.body, user: req.user.id });
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;