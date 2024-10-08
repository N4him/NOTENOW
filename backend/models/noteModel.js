const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir el esquema de la nota
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Hace referencia al modelo de User
    required: true,
  },
});

// Crear el modelo de Nota a partir del esquema
const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
