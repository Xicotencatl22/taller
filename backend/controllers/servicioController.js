const pool = require('../db');

const getServicios = async (req, res) => {
  try {
    // PREPARADO: Aquí irá el SELECT cuando se conecte
    // const result = await pool.query('SELECT * FROM servicio');
    // res.json(result.rows);
    res.json({ message: "Obtener servicios. Listo para conectar DB." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createServicio = async (req, res) => {
  try {
    const { nombre, categoria, manoObra, tiempoEstimado, descripcion } = req.body;
    // PREPARADO: Aquí irá el INSERT
    // const result = await pool.query(
    //   'INSERT INTO servicio (nombre, categoria, mano_obra, tiempo_estimado, descripcion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    //   [nombre, categoria, manoObra, tiempoEstimado, descripcion]
    // );
    // res.json(result.rows[0]);
    res.json({ message: "Servicio creado. Listo para conectar DB.", data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, manoObra, tiempoEstimado, descripcion } = req.body;
    // PREPARADO: Aquí irá el UPDATE
    res.json({ message: `Servicio ${id} actualizado. Listo para conectar DB.`, data: req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;
    // PREPARADO: Aquí irá el DELETE
    // await pool.query('DELETE FROM servicio WHERE id = $1', [id]);
    res.json({ message: `Servicio ${id} eliminado. Listo para conectar DB.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getServicios,
  createServicio,
  updateServicio,
  deleteServicio
};
