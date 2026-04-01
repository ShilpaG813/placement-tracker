const mongoose = require('mongoose');


const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  roundType: { type: String, required: true },
  interviewDate: { type: Date, required: true },
  notes: { type: String },
  notified: { type: Boolean, default: false },
  twoHourNotified: { type: Boolean, default: false },
  thirtyMinNotified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', ReminderSchema);
