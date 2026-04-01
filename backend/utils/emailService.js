const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendReminderEmail = async (toEmail, name, company, role, roundType, interviewDate, type) => {
  const dateStr = new Date(interviewDate).toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const subjects = {
    day_before: `Reminder: ${roundType} at ${company} is tomorrow!`,
    two_hours: `Your ${roundType} at ${company} is in 2 hours!`,
    thirty_mins: `Starting in 30 mins: ${roundType} at ${company}!`
  };

  const intros = {
    day_before: 'You have an interview <strong>tomorrow</strong>. Make sure you are prepared!',
    two_hours: 'Your interview is in <strong>2 hours</strong>. Get ready!',
    thirty_mins: 'Your interview starts in <strong>30 minutes</strong>. All the best!'
  };

  const colors = {
    day_before: '#2563eb',
    two_hours: '#d97706',
    thirty_mins: '#dc2626'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: subjects[type],
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: ${colors[type]};">Interview Reminder</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>${intros[type]}</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Round:</strong> ${roundType}</p>
          <p><strong>Date and Time:</strong> ${dateStr}</p>
        </div>
        <p style="color: ${colors[type]}; font-weight: bold;">Best of luck!</p>
        <p style="color: #6b7280; font-size: 12px;">- Placement Tracker</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendReminderEmail };