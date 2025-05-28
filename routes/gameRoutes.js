const express = require('express');
const { handleGameLogic } = require('../controller/gameController');
const router = express.Router();

router.post('/gameLogic', handleGameLogic);
//router.post('/startGame', startGame);
module.exports = router;