const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/register', userController.createUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);




module.exports = router;
