const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cgpa: { type: Number },
  branch: { type: String },
  skills: { type: [String] },
  resume: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);