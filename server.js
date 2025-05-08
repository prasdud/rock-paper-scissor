const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors')
require('dotenv').config();

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'site/build')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'site/build', 'index.html'));
});



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/vault', require('./routes/vaultRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
