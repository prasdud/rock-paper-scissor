const express = require('express');
const router = express.Router();

// Dummy route (just for placeholder)
router.get('/', (req, res) => {
  res.send('Game route is working');
});

module.exports = router;
