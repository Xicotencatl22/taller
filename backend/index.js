require('dotenv').config();
const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const bcrypt = require('bcryptjs');
const { createPool } = require('./db');
=======

// Importar rutas
const marcaRoutes = require('./routes/marcaRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_ROLES = [
  {
    nombre: 'Administrador',
    descripcion: 'Acceso completo al sistema',
    permisos: ['Dashboard','Citas','Vehículos','Servicios','Productos','Ventas','Compras','Cotizaciones','Reportes','Usuarios','Roles'],
    color: '#8B5CF6',
  },
  {
    nombre: 'Técnico',
    descripcion: 'Acceso a servicios y mantenimiento',
    permisos: ['Citas','Vehículos','Servicios'],
    color: '#60A5FA',
  },
  {
    nombre: 'Cliente',
    descripcion: 'Acceso al portal de clientes',
    permisos: ['Cotizaciones','Reportes'],
    color: '#34D399',
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

const quoteIdentifier = (identifier) => `\`${identifier}\``;

let pool;
let userPasswordColumn = 'contrasena';
let userRoleIdColumn = 'Roles_id';

const initializeDatabase = async () => {
  pool = await createPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL UNIQUE,
      descripcion TEXT,
      permisos LONGTEXT,
      color VARCHAR(30) DEFAULT '#A78BFA'
    );
  `);

  const [rolePermColumns] = await pool.query("SHOW COLUMNS FROM roles LIKE 'permisos'");
  if (rolePermColumns.length && !/text/i.test(rolePermColumns[0].Type) && !/longtext/i.test(rolePermColumns[0].Type)) {
    await pool.query('ALTER TABLE roles MODIFY permisos LONGTEXT');
  }

  const [roleDescColumns] = await pool.query("SHOW COLUMNS FROM roles LIKE 'descripcion'");
  if (roleDescColumns.length && !/text/i.test(roleDescColumns[0].Type)) {
    await pool.query('ALTER TABLE roles MODIFY descripcion TEXT');
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      idUsuarios INT AUTO_INCREMENT PRIMARY KEY,
      Roles_id INT NOT NULL,
      email VARCHAR(128) NOT NULL UNIQUE,
      contrasena VARCHAR(255) NOT NULL,
      nombre VARCHAR(150) NOT NULL,
      telefono VARCHAR(50) DEFAULT '',
      FOREIGN KEY (Roles_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `);

  const [userPasswordColumns] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'contrasena'");
  const [userPasswordAccentColumns] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'contraseña'");
  if (userPasswordColumns.length) {
    userPasswordColumn = 'contrasena';
  } else if (userPasswordAccentColumns.length) {
    userPasswordColumn = 'contraseña';
  } else {
    await pool.query("ALTER TABLE usuarios ADD COLUMN contrasena VARCHAR(255) NOT NULL AFTER email");
    userPasswordColumn = 'contrasena';
  }

  const [roleIdColumns] = await pool.query("SHOW COLUMNS FROM usuarios LIKE 'Roles_id'");
  if (roleIdColumns.length) {
    userRoleIdColumn = 'Roles_id';
  } else {
    userRoleIdColumn = 'roles_id';
  }

  for (const role of DEFAULT_ROLES) {
    const [existing] = await pool.query('SELECT id, permisos, color FROM roles WHERE nombre = ?', [role.nombre]);
    if (existing.length === 0) {
      await pool.query(
        'INSERT INTO roles (nombre, descripcion, permisos, color) VALUES (?, ?, ?, ?)',
        [role.nombre, role.descripcion, JSON.stringify(role.permisos), role.color]
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
        'UPDATE roles SET permisos = ? WHERE id = ?',
        [JSON.stringify(role.permisos), existingRole.id]
      );
    }

    if (!existingRole.color) {
      await pool.query('UPDATE roles SET color = ? WHERE id = ?', [role.color, existingRole.id]);
    }
  }

  const [adminRole] = await pool.query('SELECT id FROM roles WHERE nombre = ?', ['Administrador']);
  if (adminRole.length > 0) {
    const [adminUser] = await pool.query('SELECT idusuarios FROM usuarios WHERE email = ?', ['admin@admin.com']);
    if (adminUser.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await pool.query(
        `INSERT INTO usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES (?, ?, ?, ?, ?)`,
        [adminRole[0].id, 'admin@admin.com', hashedPassword, 'Administrador', '']
      );
    }
  }
};

const formatRoleRow = (row) => ({
  id: row.id,
  name: row.nombre,
  description: row.descripcion,
  permissions: Array.isArray(row.permisos) ? row.permisos : JSON.parse(row.permisos || '[]'),
  color: row.color || '#A78BFA',
});

const formatUserRow = (row) => ({
  id: row.idusuarios,
  roleId: row[userRoleIdColumn] ?? row.roles_id ?? row.Roles_id,
  email: row.email,
  name: row.nombre,
  phone: row.telefono || '',
  role: row.roleName,
});

app.get('/', (req, res) => {
  res.send('Backend en funcionamiento');
});

<<<<<<< HEAD
app.get('/api/roles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(rows.map(formatRoleRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener roles' });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { name, description, permissions, color } = req.body;
    if (!validateName(name) || !description || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Datos de rol inválidos' });
    }
    const [result] = await pool.query(
      'INSERT INTO roles (nombre, descripcion, permisos, color) VALUES (?, ?, ?, ?)',
      [name.trim(), description.trim(), JSON.stringify(permissions), color || '#A78BFA']
    );
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [result.insertId]);
    res.json(formatRoleRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El nombre del rol ya existe' });
    }
    res.status(500).json({ error: 'Error al crear el rol' });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  try {
    const roleId = Number(req.params.id);
    const { name, description, permissions, color } = req.body;
    if (Number.isNaN(roleId) || !validateName(name) || !description || !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Datos de rol inválidos' });
    }
    await pool.query(
      'UPDATE roles SET nombre = ?, descripcion = ?, permisos = ?, color = ? WHERE id = ?',
      [name.trim(), description.trim(), JSON.stringify(permissions), color || '#A78BFA', roleId]
    );
    const [rows] = await pool.query('SELECT * FROM roles WHERE id = ?', [roleId]);
    if (!rows.length) return res.status(404).json({ error: 'Rol no encontrado' });
    res.json(formatRoleRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
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
    await pool.query('DELETE FROM roles WHERE id = ?', [roleId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el rol' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.idusuarios, u.roles_id, u.email, u.nombre, u.telefono, r.nombre AS roleName
       FROM usuarios u
       JOIN roles r ON u.roles_id = r.id
       ORDER BY u.idusuarios`
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
    const [roleRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [role]);
    if (!roleRow.length) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES (?, ?, ?, ?, ?)`,
      [roleRow[0].id, email.trim(), hashedPassword, name.trim(), phone || '']
    );
    const [rows] = await pool.query(
      `SELECT u.idusuarios, u.${userRoleIdColumn}, u.email, u.nombre, u.telefono, r.nombre AS roleName
       FROM usuarios u
       JOIN roles r ON u.${userRoleIdColumn} = r.id WHERE u.idusuarios = ?`,
      [result.insertId]
    );
    res.json(formatUserRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
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
    const [roleRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', [role]);
    if (!roleRow.length) {
      return res.status(400).json({ error: 'Rol no válido' });
    }
    const [existing] = await pool.query('SELECT idusuarios FROM usuarios WHERE idusuarios = ?', [userId]);
    if (!existing.length) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const fields = [roleRow[0].id, email.trim(), name.trim(), phone || '', userId];
    let query = `UPDATE usuarios SET ${quoteIdentifier(userRoleIdColumn)} = ?, email = ?, nombre = ?, telefono = ?`;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, ${quoteIdentifier(userPasswordColumn)} = ?`;
      fields.splice(4, 0, hashedPassword);
    }
    query += ' WHERE idusuarios = ?';
    await pool.query(query, fields);
    const [rows] = await pool.query(
      `SELECT u.idusuarios, u.roles_id, u.email, u.nombre, u.telefono, r.nombre AS roleName
       FROM usuarios u
       JOIN roles r ON u.roles_id = r.id WHERE u.idusuarios = ?`,
      [userId]
    );
    res.json(formatUserRow(rows[0]));
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
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
    await pool.query('DELETE FROM usuarios WHERE idusuarios = ?', [userId]);
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

    const [roleRow] = await pool.query('SELECT id FROM roles WHERE nombre = ?', ['Cliente']);
    if (!roleRow.length) {
      return res.status(500).json({ error: 'No se encontró el rol Cliente' });
    }

    const [existing] = await pool.query('SELECT idusuarios FROM usuarios WHERE email = ?', [email.trim()]);
    if (existing.length) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO usuarios (${quoteIdentifier(userRoleIdColumn)}, email, ${quoteIdentifier(userPasswordColumn)}, nombre, telefono) VALUES (?, ?, ?, ?, ?)`,
      [roleRow[0].id, email.trim(), hashedPassword, name.trim(), phone || '']
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
    const passwordReference = `u.${quoteIdentifier(userPasswordColumn)} AS passwordHash`;
    const [rows] = await pool.query(
      `SELECT u.idusuarios, u.email, ${passwordReference}, u.nombre, u.telefono, r.nombre AS roleName, r.permisos, r.color
       FROM usuarios u
       JOIN roles r ON u.${userRoleIdColumn} = r.id
       WHERE u.email = ?`,
      [email.trim()]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
    const user = rows[0];
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }
    res.json({
      id: user.idusuarios,
      email: user.email,
      name: user.nombre,
      phone: user.telefono || '',
      role: user.roleName,
      permissions: Array.isArray(user.permisos) ? user.permisos : JSON.parse(user.permisos || '[]'),
      color: user.color || '#8B5CF6',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

const PORT = process.env.PORT || 4000;

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
=======
// Rutas base API existentes refactorizadas
app.use('/api/marca', marcaRoutes);
app.use('/api', vehiculoRoutes); // Maneja /api/anio, /api/modelo/:idmarca, /api/motor
app.use('/api/cliente', clienteRoutes);

// Nuevas Rutas (Preparadas para conectarse después)
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
>>>>>>> 556a59881b9f12314f827fd66d2d8b6d6abfcb2c
