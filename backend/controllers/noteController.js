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

// Obtener una nota por ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la nota', error });
  }
};

// Agregar una nueva nota
exports.addNote = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      category
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar la nota', error });
  }
};

// Editar una nota existente
exports.editNote = async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true } // Retorna la nota actualizada
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Error al editar la nota', error });
  }
};

// Eliminar una nota por su ID
exports.deleteNote = async (req, res) => {
    const { id } = req.params;
  
    try {
      const note = await Note.findByIdAndDelete(id);
  
      if (!note) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }
  
      res.status(200).json({ message: 'Nota eliminada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  
