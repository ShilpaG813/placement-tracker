const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { startCronJob } = require('./utils/cronJob');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/reminders', require('./routes/reminder'));

// Test route
app.get('/', (req, res) => {
  res.send('Placement Tracker API Running!');
});

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected!');
    startCronJob();
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log(err));