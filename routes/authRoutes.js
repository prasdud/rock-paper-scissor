const express = require('express');
const router = express.Router();

// Dummy route (just for placeholder)
router.get('/register', (req, res) => {
  res.send('Auth route is working');
});

module.exports = router;
