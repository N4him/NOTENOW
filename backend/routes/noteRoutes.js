const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController')

// Ruta para obtener todas las notas
router.get('/notes', noteController.getAllNotes);

// Ruta para obtener una nota específica por ID
router.get('/notes/:id', noteController.getNoteById);

// Ruta para agregar una nueva nota
router.post('/notes', noteController.addNote);

// Ruta para editar una nota existente por ID
router.put('/notes/:id', noteController.editNote);

// Ruta para eliminar una nota
router.delete('/notes/:id', noteController.deleteNote);



module.exports = router;