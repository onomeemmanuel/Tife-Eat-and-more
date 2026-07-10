const express = require('express');
const router = express.Router();
const { getChatbotSession, handleChatMessage, markOrderPaid } = require('../controllers/chatbot.controller');

router.get('/session', getChatbotSession);
router.post('/message', handleChatMessage);
router.post('/pay', markOrderPaid);

module.exports = router;
