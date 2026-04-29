const pool = require('../db');

const getAllCitas = async (req, res) => {
  try {
    const result = await pool.query('SELECT idCita AS id, idCotizacion, idUsuarios, fecha, hora, nota FROM Cita');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCita = async (req, res) => {
  try {
    // Note: Schema for Cita is (idCita, idCotizacion, idUsuarios, fecha, hora, nota)
    const { idUsuarios, id_cliente, idCotizacion, fecha, hora, nota, observaciones } = req.body;
    
    // Map id_cliente to idUsuarios if needed
    const userId = idUsuarios || id_cliente || null;
    const finalNota = nota || observaciones || '';

    const result = await pool.query(
      'INSERT INTO Cita (idCotizacion, idUsuarios, fecha, hora, nota) VALUES ($1, $2, $3, $4, $5) RETURNING idCita AS id, idCotizacion, idUsuarios, fecha, hora, nota',
      [idCotizacion || null, userId, fecha, hora, finalNota]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCitaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, observaciones } = req.body;
    const finalNota = nota || observaciones;
    
    // Schema does not have an 'estado' column, so we just update the note if provided
    if (finalNota !== undefined) {
      await pool.query('UPDATE Cita SET nota = $1 WHERE idCita = $2', [finalNota, id]);
      res.json({ message: `Cita ${id} actualizada con nueva nota.` });
    } else {
      res.json({ message: `No hay columna de estado en el esquema para la cita ${id}.` });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCitas,
  createCita,
  updateCitaStatus
};
