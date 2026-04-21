const pool = require('../db');

const createCliente = async (req, res) => {
  try{
    const { nombre, apellido, correo, telefono } = req.body;
    const result = await pool.query(
      'INSERT INTO cliente (nombre, apellido, correo, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, apellido, correo, telefono]
    );
    res.json(result.rows[0]);
  } catch (err){
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createCliente };
