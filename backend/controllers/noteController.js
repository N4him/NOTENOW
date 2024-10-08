const Note = require('../models/noteModel'); // Importa el modelo de nota

// Obtener todas las notas
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notas', error });
  }
};

// Crear una nueva nota vinculada a un usuario
exports.createNote = async (req, res) => {
  const { title, content, category } = req.body;  // Incluir categoría
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    const newNote = new Note({
      title,
      content,
      category, // Guardar categoría
      user: userId, // Asociamos la nota al usuario autenticado
    });

    await newNote.save();
    res.status(201).json({ message: 'Nota creada con éxito', note: newNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la nota' });
  }
};

// Obtener todas las notas de un usuario
exports.getNotesByUser = async (req, res) => {
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    const notes = await Note.find({ user: userId }); // Filtrar por el ID del usuario

    if (!notes.length) {
      return res.status(404).json({ message: 'No se encontraron notas para este usuario' });
    }

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
};

// Obtener una nota por su ID (asegurarse de que pertenezca al usuario autenticado)
exports.getNoteById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    const note = await Note.findOne({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada o no pertenece a este usuario' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la nota' });
  }
};

// Editar una nota (asegurarse de que pertenezca al usuario autenticado)
exports.updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body; // Incluir categoría
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId }, // Asegurarse de que la nota pertenece al usuario
      { title, content, category }, // Actualizar título, contenido y categoría
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada o no pertenece a este usuario' });
    }

    res.status(200).json({ message: 'Nota actualizada con éxito', note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la nota' });
  }
};

// Eliminar una nota (asegurarse de que pertenezca al usuario autenticado)
exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    const note = await Note.findOneAndDelete({ _id: id, user: userId });

    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada o no pertenece a este usuario' });
    }

    res.status(200).json({ message: 'Nota eliminada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la nota' });
  }
};
  
