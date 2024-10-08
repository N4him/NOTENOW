const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cors = require("cors");
const errorMiddleware = require('./middleware/errorMiddleware');
const { port } = require('./config/config');

const app = express();
app.use(cors({
  origin: "http://localhost:3000",
}));

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Rutas
app.use('/api', userRoutes); // Esta línea
app.use('/api', noteRoutes); // Esta línea para las notas

// Error Handling Middleware
app.use(errorMiddleware);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
