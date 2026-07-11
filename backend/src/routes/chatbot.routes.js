const express = require('express');
const router = express.Router();
const { getChatbotSession, handleChatMessage } = require('../controllers/chatbot.controller');

router.get('/session', getChatbotSession);
router.post('/message', handleChatMessage);

module.exports = router;
