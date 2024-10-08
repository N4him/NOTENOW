const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Puedes usar otro proveedor si lo prefieres
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // Tu contraseña de correo electrónico
  },
});

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      password: hashedPassword,
      name,
    });

    await user.save();

    // Enviar un correo electrónico de bienvenida
    const mailOptions = {
      from: process.env.EMAIL_USER, // Tu correo electrónico verificado
      to: email,
      subject: 'Bienvenido a nuestra plataforma',
      text: `Hola ${name}, gracias por registrarte en nuestra plataforma.`,
    };

    //await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Login (iniciar sesión)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      id: user._id,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};
