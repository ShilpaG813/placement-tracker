require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Connected!');
  
  const Reminder = require('./models/Reminder');
  const User = require('./models/User');
  const { sendReminderEmail } = require('./utils/emailService');

  // Get all reminders for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const reminders = await Reminder.find({
    interviewDate: {
      $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
      $lte: new Date(tomorrow.setHours(23, 59, 59, 999))
    }
  });

  console.log('Reminders found for tomorrow:', reminders.length);

  for (const reminder of reminders) {
    const user = await User.findById(reminder.user);
    if (user) {
      console.log('Sending email to:', user.email);
      await sendReminderEmail(
        user.email,
        user.name,
        reminder.company,
        reminder.role,
        reminder.roundType,
        reminder.interviewDate
      );
      console.log('Email sent to', user.email);
    }
  }

  console.log('Done!');
  mongoose.disconnect();
});