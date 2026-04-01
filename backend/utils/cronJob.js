const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const { sendReminderEmail } = require('./emailService');

const startCronJob = () => {

  // CRON 1: Every day at 8 AM — Day before reminder
  cron.schedule('0 8 * * *', async () => {
    console.log('Running day-before reminder check...');
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const reminders = await Reminder.find({
        interviewDate: {
          $gte: new Date(new Date(tomorrow).setHours(0, 0, 0, 0)),
          $lte: new Date(new Date(tomorrow).setHours(23, 59, 59, 999))
        },
        notified: false
      });

      console.log(`Day-before: Found ${reminders.length} reminders`);

      for (const reminder of reminders) {
        const user = await User.findById(reminder.user);
        if (user) {
          await sendReminderEmail(
            user.email,
            user.name,
            reminder.company,
            reminder.role,
            reminder.roundType,
            reminder.interviewDate,
            'day_before'
          );
          reminder.notified = true;
          await reminder.save();
          console.log(`Day-before email sent to ${user.email}`);
        }
      }
    } catch (err) {
      console.error('Day-before cron error:', err);
    }
  });

  // CRON 2: Every hour — 2 hour before reminder
  cron.schedule('0 * * * *', async () => {
    console.log('Running 2-hour before reminder check...');
    try {
      const now = new Date();
      const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      const reminders = await Reminder.find({
        interviewDate: {
          $gte: new Date(twoHoursLater.getTime() - 5 * 60 * 1000),
          $lte: new Date(twoHoursLater.getTime() + 5 * 60 * 1000)
        },
        twoHourNotified: false
      });

      console.log(`2-hour: Found ${reminders.length} reminders`);

      for (const reminder of reminders) {
        const user = await User.findById(reminder.user);
        if (user) {
          await sendReminderEmail(
            user.email,
            user.name,
            reminder.company,
            reminder.role,
            reminder.roundType,
            reminder.interviewDate,
            'two_hours'
          );
          reminder.twoHourNotified = true;
          await reminder.save();
          console.log(`2-hour email sent to ${user.email}`);
        }
      }
    } catch (err) {
      console.error('2-hour cron error:', err);
    }
  });

  // CRON 3: Every 30 mins — 30 min before reminder
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running 30-min before reminder check...');
    try {
      const now = new Date();
      const thirtyMinsLater = new Date(now.getTime() + 30 * 60 * 1000);

      const reminders = await Reminder.find({
        interviewDate: {
          $gte: new Date(thirtyMinsLater.getTime() - 2 * 60 * 1000),
          $lte: new Date(thirtyMinsLater.getTime() + 2 * 60 * 1000)
        },
        thirtyMinNotified: false
      });

      console.log(`30-min: Found ${reminders.length} reminders`);

      for (const reminder of reminders) {
        const user = await User.findById(reminder.user);
        if (user) {
          await sendReminderEmail(
            user.email,
            user.name,
            reminder.company,
            reminder.role,
            reminder.roundType,
            reminder.interviewDate,
            'thirty_mins'
          );
          reminder.thirtyMinNotified = true;
          await reminder.save();
          console.log(`30-min email sent to ${user.email}`);
        }
      }
    } catch (err) {
      console.error('30-min cron error:', err);
    }
  });

  console.log('All cron jobs started!');
};

module.exports = { startCronJob };