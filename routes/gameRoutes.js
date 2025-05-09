const express = require('express');
const { handleGameLogic } = require('../controller/gameController');
const router = express.Router();

router.post('/gameLogic', handleGameLogic);

module.exports = router;