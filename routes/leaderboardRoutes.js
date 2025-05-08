const express = require('express');
const router = express.Router();

// Dummy route (just for placeholder)
router.get('/', (req, res) => {
  res.send('Leaderboard route is working');
});

module.exports = router;
