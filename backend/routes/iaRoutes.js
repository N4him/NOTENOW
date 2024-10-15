const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware')
const iaController = require('../controllers/iaController')

//Ruta para organizar la nota generado por IA
router.post('/upgradeNote', authenticateUser ,iaController.getGroqChatCompletion)

module.exports = router;