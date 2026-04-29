const pool = require('../db');

const getServicios = async (req, res) => {
  try {
    const result = await pool.query('SELECT idServicios AS id, nombre, descripcion, tiempo_estimado AS tiempoEstimado, costo, categoria, mano_obra AS manoObra, refacciones_estimadas AS refaccionesEstimadas FROM Servicios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createServicio = async (req, res) => {
  try {
    const { nombre, categoria, manoObra, tiempoEstimado, descripcion, costo, refaccionesEstimadas } = req.body;
    const result = await pool.query(
      'INSERT INTO Servicios (nombre, categoria, mano_obra, tiempo_estimado, descripcion, costo, refacciones_estimadas) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING idServicios AS id, nombre, descripcion, tiempo_estimado AS tiempoEstimado, costo, categoria, mano_obra AS manoObra, refacciones_estimadas AS refaccionesEstimadas',
      [nombre, categoria || 0, manoObra || 0, tiempoEstimado || 0, descripcion || '', costo || 0, refaccionesEstimadas || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, manoObra, tiempoEstimado, descripcion, costo, refaccionesEstimadas } = req.body;
    
    const result = await pool.query(
      'UPDATE Servicios SET nombre = $1, categoria = $2, mano_obra = $3, tiempo_estimado = $4, descripcion = $5, costo = $6, refacciones_estimadas = $7 WHERE idServicios = $8 RETURNING idServicios AS id, nombre, descripcion, tiempo_estimado AS tiempoEstimado, costo, categoria, mano_obra AS manoObra, refacciones_estimadas AS refaccionesEstimadas',
      [nombre, categoria || 0, manoObra || 0, tiempoEstimado || 0, descripcion || '', costo || 0, refaccionesEstimadas || 0, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteServicio = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Servicios WHERE idServicios = $1', [id]);
    res.json({ message: `Servicio ${id} eliminado.` });
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
