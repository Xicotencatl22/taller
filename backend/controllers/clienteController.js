const pool = require('../db');
const bcrypt = require('bcryptjs');

const createCliente = async (req, res) => {
  try {
    const { nombre, apellido, correo, telefono } = req.body;
    const fullName = apellido ? `${nombre} ${apellido}`.trim() : nombre;

    const { rows: roleRow } = await pool.query('SELECT idRoles FROM Roles WHERE nombre = $1', ['Cliente']);
    if (!roleRow.length) {
      return res.status(500).json({ error: 'No se encontró el rol Cliente' });
    }

    const { rows: existing } = await pool.query('SELECT idUsuarios FROM Usuarios WHERE email = $1', [correo]);
    if (existing.length) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Assign a default password for created clients, e.g., '123456'
    const hashedPassword = await bcrypt.hash('123456', 10);

    const result = await pool.query(
      'INSERT INTO Usuarios (idRoles, email, contrasena, nombre, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING idUsuarios, nombre, email as correo, telefono',
      [roleRow[0].idroles, correo, hashedPassword, fullName, telefono || '']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createCliente };
