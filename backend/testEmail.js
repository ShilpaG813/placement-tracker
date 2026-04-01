require('dotenv').config();
const { sendReminderEmail } = require('./utils/emailService');

sendReminderEmail(
  process.env.EMAIL_USER,
  'Shilpa',
  'Google',
  'SWE Intern',
  'Technical Round 1',
  new Date()
).then(() => {
  console.log('Email sent successfully!');
}).catch((err) => {
  console.log('Email failed:', err.message);
});