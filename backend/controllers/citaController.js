const pool = require('../db');

const getAllCitas = async (req, res) => {
  try {
    // PREPARADO: Consultar citas para el panel de admin
    // const result = await pool.query('SELECT * FROM cita');
    // res.json(result.rows);
    res.json({ message: "Obtener todas las citas. Listo para conectar DB." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCita = async (req, res) => {
  try {
    const { id_cliente, fecha, hora, id_servicio, vehiculo_detalles, observaciones } = req.body;
    // PREPARADO: Insertar la cita
    // const result = await pool.query(
    //   'INSERT INTO cita (id_cliente, fecha, hora, id_servicio, vehiculo_detalles, observaciones, estado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    //   [id_cliente, fecha, hora, id_servicio, vehiculo_detalles, observaciones, 'pendiente']
    // );
    // res.json(result.rows[0]);
    res.json({ message: "Cita agendada correctamente. Listo para conectar DB.", data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCitaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'confirmada', 'cancelada', etc.
    // PREPARADO: Actualizar estado de la cita
    res.json({ message: `Estado de la cita ${id} actualizado a ${estado}. Listo para conectar DB.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCitas,
  createCita,
  updateCitaStatus
};
