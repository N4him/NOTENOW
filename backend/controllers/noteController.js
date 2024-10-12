const Note = require('../models/noteModel'); // Importa el modelo de nota
const mongoose = require('mongoose');

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

  // 1. Agregar logs para verificar la entrada
  console.log('Request Body:', req.body);
  console.log('User ID:', userId);

  try {
    // 2. Validar que se recibieron todos los campos requeridos
    if (!title || !content || !category) {
      console.log('Error: Faltan campos requeridos');
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const newNote = new Note({
      title,
      content,
      category, // Guardar categoría
      user: userId, // Asociamos la nota al usuario autenticado
    });

    await newNote.save();
    console.log('Nota creada:', newNote);
    res.status(201).json({ message: 'Nota creada con éxito', note: newNote });
  } catch (error) {
    // 3. Imprimir el error para diagnósticos
    console.error('Error al crear la nota:', error);
    res.status(500).json({ message: 'Error al crear la nota', error: error.message });
  }
};


// Obtener todas las notas de un usuario con paginación, filtrado por categoría y título
// Ej de peticion: /api/notes?category=Estudio&title=tercera nota&limit=3&page=1
exports.getNotesByUser = async (req, res) => {
  const userId = req.user.id; // El userId proviene del token JWT
  const { category, title } = req.query; // Extraer parámetros desde los query params
  const page = parseInt(req.query.page) || 1; // Obtener la página desde los query params

  const filter = { user: userId }; // Filtrar por el ID del usuario

  // Agregar categoría al filtro si se proporciona
  if (category) {
    filter.category = category;
  }

  // Agregar título al filtro si se proporciona (búsqueda por coincidencia parcial)
  if (title) {
    filter.title = { $regex: title, $options: 'i' }; // 'i' hace que sea insensible a mayúsculas
  }

  try {
    // Calcular el total de notas que cumplen con el filtro (antes de aplicar la paginación)
    const totalNotes = await Note.countDocuments(filter);

    // Fijar el tamaño de la página (7 objetos por página)
    const pageSize = 7;

    // Asegurarse de que page tenga un valor válido o usar el valor por defecto (1)
    const currentPage = page && !isNaN(page) ? Math.max(Number(page), 1) : 1;

    // Obtener las notas con paginación
    const notes = await Note.find(filter)
      .limit(pageSize) // Limitar el número de objetos por página
      .skip(pageSize * (currentPage - 1)) // Calcular el offset según la página actual
      .exec();

    // Verificar si se encontraron notas
    if (!notes.length) {
      return res.status(404).json({ message: 'No se encontraron notas para este usuario' });
    }

    // Calcular el número total de páginas
    const totalPages = Math.ceil(totalNotes / pageSize);

    // Devolver las notas y datos de la paginación
    res.status(200).json({
      notes,
      currentPage, // Número de página actual
      pagination: {
        totalNotes,
        totalPages,
        currentPage,
        pageSize,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
};



// Obtener una nota por su ID (asegurarse de que pertenezca al usuario autenticado)
exports.searchNotes = async (req, res) => {
  const { query } = req.query; // Obtiene el parámetro de búsqueda de la consulta
  const userId = req.user.id; // Obtiene el ID del usuario del token JWT

  try {
    if (!query) {
      return res.status(400).json({ message: 'El parámetro de búsqueda es obligatorio' });
    }

    // Busca notas que coincidan con la consulta y que pertenezcan al usuario autenticado
    const notes = await Note.find({
      user: userId, // Asegúrate de que las notas pertenezcan al usuario
      $or: [
        { title: { $regex: query, $options: 'i' } }, // Búsqueda por título
        { content: { $regex: query, $options: 'i' } } // Búsqueda por contenido
      ]
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar notas' });
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


exports.getCategoriesByUser = async (req, res) => {
  const userId = req.user.id; // El userId proviene del token JWT

  try {
    // Verificar que el userId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID de usuario no válido' });
    }

    // Obtener las categorías únicas de las notas del usuario
    const categories = await Note.distinct('category', { user: userId });

    if (!categories.length) {
      return res.status(404).json({ message: 'No se encontraron categorías para este usuario' });
    }

    res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};


  
