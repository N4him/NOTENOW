const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authMiddleware');
const noteController = require('../controllers/noteController')

// Ruta para registrar un nuevo usuario
router.post('/register', userController.createUser);

// Ruta para obtener usuarios por rol (sólo usuarios con rol "user")
router.get('/users', authenticateUser, userController.getUsers);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);




module.exports = router;
