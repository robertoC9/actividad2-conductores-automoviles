// app.js
// Configuración Express desacoplada de index.js

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware: CORS
// Nota: Si quieres limitarlo a tu frontend, configura el origin aquí.
app.use(cors());

// Middleware: parseo de JSON
app.use(express.json());

module.exports = app;

