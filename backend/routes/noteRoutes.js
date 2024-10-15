const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware')
const noteController = require('../controllers/noteController')

// Ruta para crear una nueva nota
router.post('/notes', authenticateUser, noteController.createNote);

// Ruta para obtener todas las notas del usuario autenticado
router.get('/notes', authenticateUser, noteController.getNotesByUser);

// Ruta para obtener una nota por ID (solo si pertenece al usuario autenticado)
router.get('/notes/search', authenticateUser, noteController.searchNotes);

// Ruta para actualizar una nota (solo si pertenece al usuario autenticado)
router.put('/notes/:id', authenticateUser, noteController.updateNote);

// Ruta para eliminar una nota (solo si pertenece al usuario autenticado)
router.delete('/notes/:id', authenticateUser, noteController.deleteNote);

//Ruta para obtener todas las categorias que hay en las notas (solo si pertenece al usuario autenticado)
router.get('/categories', authenticateUser, noteController.getCategoriesByUser)



module.exports = router;