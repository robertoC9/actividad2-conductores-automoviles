// index.js
// Servidor Express + PostgreSQL (pg Pool)

require('dotenv').config();
const app = require('./app');
const { Pool } = require('pg');

// Helpers de configuración
function getEnv(name) {
  return process.env[name];
}

// Validación de variables requeridas
const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingEnv = requiredEnv.filter((k) => !getEnv(k));
if (missingEnv.length) {
  console.error('Faltan variables de entorno para PostgreSQL:', missingEnv.join(', '));
}

// Pool de PostgreSQL
const pool = new Pool({
  host: getEnv('DB_HOST'),
  port: getEnv('DB_PORT'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
});

// Utilidad para manejar errores
function apiError(res, status, message) {
  return res.status(status).json({ error: message });
}

// ======= RUTAS =======

// Ruta base
app.get('/', (req, res) => {
  res.json({ mensaje: 'API actividad2 funcionando' });
});

// GET /conductores
app.get('/conductores', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM conductores');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[GET /conductores] error:', err.message);
    return apiError(res, 500, 'Error al obtener conductores');
  }
});

// GET /automoviles
app.get('/automoviles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM automoviles');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[GET /automoviles] error:', err.message);
    return apiError(res, 500, 'Error al obtener automóviles');
  }
});

// GET /conductoressinauto?edad=#
app.get('/conductoressinauto', async (req, res) => {
  const { edad } = req.query;
  const edadNum = Number(edad);

  if (!edad || Number.isNaN(edadNum)) {
    return apiError(res, 400, 'Debe enviar edad');
  }

  try {
    const query = `
      SELECT c.*
      FROM conductores c
      LEFT JOIN automoviles a
        ON a.nombre_conductor = c.nombre
      WHERE a.nombre_conductor IS NULL
        AND c.edad < $1
    `;
    const result = await pool.query(query, [edadNum]);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('[GET /conductoressinauto] error:', err.message);
    return apiError(res, 500, 'Error al obtener conductores sin auto');
  }
});

// GET /solitos
app.get('/solitos', async (req, res) => {
  try {
    const q1 = `
      SELECT c.*
      FROM conductores c
      LEFT JOIN automoviles a
        ON a.nombre_conductor = c.nombre
      WHERE a.nombre_conductor IS NULL
    `;
    const q2 = `
      SELECT a.*
      FROM automoviles a
      LEFT JOIN conductores c
        ON c.nombre = a.nombre_conductor
      WHERE c.nombre IS NULL
    `;

    const [conductores, autos] = await Promise.all([
      pool.query(q1),
      pool.query(q2),
    ]);

    return res.status(200).json({
      conductoresSinAuto: conductores.rows,
      autosSinConductor: autos.rows,
    });
  } catch (err) {
    console.error('[GET /solitos] error:', err.message);
    return apiError(res, 500, 'Error al obtener solitos');
  }
});

// GET /auto?patente=# | /auto?iniciopatente=#
app.get('/auto', async (req, res) => {
  const { patente, iniciopatente } = req.query;

  try {
    if (patente) {
      const query = `
        SELECT a.*, c.edad
        FROM automoviles a
        LEFT JOIN conductores c
          ON c.nombre = a.nombre_conductor
        WHERE a.patente = $1
      `;
      const result = await pool.query(query, [patente]);
      if (result.rows.length === 0) {
        return apiError(res, 404, 'Auto no encontrado');
      }
      return res.status(200).json(result.rows[0]);
    }

    if (iniciopatente) {
      const query = `
        SELECT a.*, c.edad
        FROM automoviles a
        LEFT JOIN conductores c
          ON c.nombre = a.nombre_conductor
        WHERE a.patente LIKE $1
      `;
      const result = await pool.query(query, [iniciopatente + '%']);
      return res.status(200).json(result.rows);
    }

    return apiError(res, 400, 'Debe enviar patente o iniciopatente');
  } catch (err) {
    console.error('[GET /auto] error:', err.message);
    return apiError(res, 500, 'Error al buscar auto');
  }
});

// ======= ERROR HANDLING =======
app.use((err, req, res, next) => {
  console.error('[MIDDLEWARE ERROR]', err.message || err);
  return apiError(res, 500, 'Error interno del servidor');
});

// ======= START SERVER =======
const PORT = process.env.PORT || 3000;
console.log("Backend usando puerto:", PORT);
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});


