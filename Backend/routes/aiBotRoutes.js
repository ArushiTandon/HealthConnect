const express = require('express');
const router = express.Router();
const { askBot } = require('../controllers/aiBotController');


router.post('/ask-bot', askBot);

module.exports = router;