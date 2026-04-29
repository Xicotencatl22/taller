require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bcrypt = require('bcryptjs');
const pool = require('./db');

const marcaRoutes = require('./routes/marcaRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_ROLES = [
  {
    nombre: 'Administrador',
    descripcion: 'Acceso completo al sistema',
    permisos: ['Dashboard', 'Citas', 'Vehículos', 'Servicios', 'Productos', 'Ventas', 'Compras', 'Cotizaciones', 'Reportes', 'Usuarios', 'Roles']
  },
  {
    nombre: 'Técnico',
    descripcion: 'Acceso a servicios y mantenimiento',
    permisos: ['Citas', 'Vehículos', 'Servicios']
  },
  {
    nombre: 'Cliente',
    descripcion: 'Acceso al portal de clientes',
    permisos: ['Cotizaciones', 'Reportes']
  },
];

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && email.length > 0 && email.length < 64 && emailRegex.test(email);
};

const validatePassword = (password) => {
  return typeof password === 'string' && password.length > 6 && /\d/.test(password);
};

const validateName = (name) => {
  return typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 100;
};

const validatePhone = (phone) => {
  if (!phone) return true;
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone);
};

const quoteIdentifier = (identifier) => `"${identifier}"`;

let userPasswordColumn = 'contrasena';
let userRoleIdColumn = 'idroles';

const initializeDatabase = async () => {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Roles (
      idRoles SERIAL PRIMARY KEY,
      nombre VARCHAR(100) UNIQUE,
      descripcion VARCHAR(255),
      permisos TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Usuarios (
      idUsuarios SERIAL PRIMARY KEY,
      idRoles INTEGER REFERENCES Roles(idRoles),
      email VARCHAR(100) UNIQUE,
      contrasena VARCHAR(255),
      nombre VARCHAR(100),
      telefono VARCHAR(20)
    );
  `);

  for (const role of DEFAULT_ROLES) {
    const { rows: existing } = await pool.query('SELECT idRoles, permisos FROM Roles WHERE nombre = $1', [role.nombre]);
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO Roles (nombre, descripcion, permisos) VALUES ($1, $2, $3)',
        [role.nombre, role.descripcion, JSON.stringify(role.permisos)]
      );
      continue;
    }

    const existingRole = existing[0];
    let storedPermissions = [];
    try {
      const parsed = Array.isArray(existingRole.permisos)
        ? existingRole.permisos
        : JSON.parse(existingRole.permisos || '[]');
      if (Array.isArray(parsed)) {
        storedPermissions = parsed;
      }
    } catch (parseError) {
      storedPermissions = [];
    }

    if (storedPermissions.length === 0 && role.permisos.length > 0) {
      await pool.query(
        'UPDATE Roles SET permisos = $1 WHERE idRoles = $2',
        [JSON.stringify(role.permisos), existingRole.idroles]
      );
    }
  }

  const { rows: adminRole } = await pool.query('SELECT idRoles FROM Roles WHERE nombre = $1', ['Administrador']);
  if (adminRole.length > 0) {
    const { rows: adminUser } = await pool.query('SELECT idUsuarios FROM Usuarios WHERE email = $1', ['admin@admin.com']);
    if (adminUser.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO Usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES ($1, $2, $3, $4, $5)`,
        [adminRole[0].idroles, 'admin@admin.com', hashedPassword, 'Administrador', '']
      );
    }
  }
};

const formatRoleRow = (row) => ({
  id: row.idroles,
  name: row.nombre,
  description: row.descripcion,
  permissions: Array.isArray(row.permisos) ? row.permisos : JSON.parse(row.permisos || '[]')
});

const formatUserRow = (row) => ({
  id: row.idusuarios,
  roleId: row.idroles,
  email: row.email,
  name: row.nombre,
  phone: row.telefono || '',
  role: row.rolename,
});

app.get('/', (req, res) => {
  res.send('Backend en funcionamiento');
});

// Rutas base API existentes refactorizadas
app.use('/api/marca', marcaRoutes);
app.use('/api', vehiculoRoutes); // Maneja /api/anio, /api/modelo/:idmarca, /api/motor
app.use('/api/cliente', clienteRoutes);

// Nuevas Rutas (Preparadas para conectarse después)
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

app.get('/api/roles', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM Roles ORDER BY idRoles');
    res.json(rows.map(formatRoleRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    if (!validateName(name) || !description || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Datos de rol inválidos' });
    }
    const result = await pool.query(
      'INSERT INTO Roles (nombre, descripcion, permisos) VALUES ($1, $2, $3) RETURNING idRoles',
      [name.trim(), description.trim(), JSON.stringify(permissions)]
    );
    const { rows } = await pool.query('SELECT * FROM Roles WHERE idRoles = $1', [result.rows[0].idroles]);
    res.json(formatRoleRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El nombre del rol ya existe' });
    }
    res.status(500).json({ error: 'Error al crear el rol' });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    const { name, description, permissions } = req.body;
    if (Number.isNaN(roleId) || !validateName(name) || !description || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Datos de rol inválidos' });
    }
    await pool.query(
      'UPDATE Roles SET nombre = $1, descripcion = $2, permisos = $3 WHERE idRoles = $4',
      [name.trim(), description.trim(), JSON.stringify(permissions), roleId]
    );
    const { rows } = await pool.query('SELECT * FROM Roles WHERE idRoles = $1', [roleId]);
    if (!rows.length) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(formatRoleRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El nombre del rol ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar el rol' });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    if (Number.isNaN(roleId)) {
      return res.status(400).json({ error: 'ID de rol inválido' });
    }
    await pool.query('DELETE FROM Roles WHERE idRoles = $1', [roleId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT u.idUsuarios, u.idRoles, u.email, u.nombre, u.telefono, r.nombre AS rolename
       FROM Usuarios u
       JOIN Roles r ON u.idRoles = r.idRoles
       ORDER BY u.idUsuarios`
    );
    res.json(rows.map(formatUserRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!validateName(name) || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Datos de usuario inválidos' });
    }
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }
    const { rows: roleRow } = await pool.query('SELECT idRoles FROM Roles WHERE nombre = $1', [role]);
    if (!roleRow.length) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO Usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING idUsuarios`,
      [roleRow[0].idroles, email.trim(), hashedPassword, name.trim(), phone || '']
    );
    const { rows } = await pool.query(
      `SELECT u.idUsuarios, u.${userRoleIdColumn}, u.email, u.nombre, u.telefono, r.nombre AS rolename
       FROM Usuarios u
       JOIN Roles r ON u.${userRoleIdColumn} = r.idRoles WHERE u.idUsuarios = $1`,
      [result.rows[0].idusuarios]
    );
    res.json(formatUserRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El correo ya existe' });
    }
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { name, email, password, role, phone } = req.body;
    if (Number.isNaN(userId) || !validateName(name) || !validateEmail(email)) {
      return res.status(400).json({ error: 'Datos de usuario inválidos' });
    }
    if (password && !validatePassword(password)) {
      return res.status(400).json({ error: 'Contraseña inválida' });
    }
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }
    const { rows: roleRow } = await pool.query('SELECT idRoles FROM Roles WHERE nombre = $1', [role]);
    if (!roleRow.length) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const { rows: existing } = await pool.query('SELECT idUsuarios FROM Usuarios WHERE idUsuarios = $1', [userId]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const fields = [roleRow[0].idroles, email.trim(), name.trim(), phone || '', userId];
    let query = `UPDATE Usuarios SET ${quoteIdentifier(userRoleIdColumn)} = $1, email = $2, nombre = $3, telefono = $4`;
    let fieldCount = 4;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldCount++;
      query += `, ${quoteIdentifier(userPasswordColumn)} = $${fieldCount}`;
      fields.splice(4, 0, hashedPassword);
    }
    fieldCount++;
    query += ` WHERE idUsuarios = $${fieldCount}`;
    await pool.query(query, fields);
    const { rows } = await pool.query(
      `SELECT u.idUsuarios, u.idRoles, u.email, u.nombre, u.telefono, r.nombre AS rolename
       FROM Usuarios u
       JOIN Roles r ON u.idRoles = r.idRoles WHERE u.idUsuarios = $1`,
      [userId]
    );
    res.json(formatUserRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'El correo ya existe' });
    }
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }
    await pool.query('DELETE FROM Usuarios WHERE idUsuarios = $1', [userId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!validateName(name) || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Datos de registro inválidos' });
    }
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }

    const { rows: roleRow } = await pool.query('SELECT idRoles FROM Roles WHERE nombre = $1', ['Cliente']);
    if (!roleRow.length) {
      return res.status(500).json({ error: 'No se encontró el rol Cliente' });
    }

    const { rows: existing } = await pool.query('SELECT idUsuarios FROM Usuarios WHERE email = $1', [email.trim()]);
    if (existing.length) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO Usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES ($1, $2, $3, $4, $5)`,
      [roleRow[0].idroles, email.trim(), hashedPassword, name.trim(), phone || '']
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validateEmail(email) || !password) {
      return res.status(400).json({ error: 'Email o contraseña inválidos' });
    }
    const passwordReference = `u.${quoteIdentifier(userPasswordColumn)} AS passwordhash`;
    const { rows } = await pool.query(
      `SELECT u.idUsuarios, u.email, ${passwordReference}, u.nombre, u.telefono, r.nombre AS rolename, r.permisos
       FROM Usuarios u
       JOIN Roles r ON u.${userRoleIdColumn} = r.idRoles
       WHERE u.email = $1`,
      [email.trim()]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.passwordhash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
    res.json({
      id: user.idusuarios,
      email: user.email,
      name: user.nombre,
      phone: user.telefono || '',
      role: user.rolename,
      permissions: Array.isArray(user.permisos) ? user.permisos : JSON.parse(user.permisos || '[]')
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});


const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error inicializando la base de datos:', err);
    process.exit(1);
  });
