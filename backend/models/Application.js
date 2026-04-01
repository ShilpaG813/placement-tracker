const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  type: { type: String, enum: ['Intern', 'Full-time'], default: 'Intern' },
  cgpaCutoff: { type: Number },
  status: { type: String, enum: ['Applied', 'Pending', 'Selected', 'Rejected'], default: 'Applied' },
  rounds: [{
    roundName: String,
    result: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' }
  }],
  notes: { type: String },
  stipend: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);