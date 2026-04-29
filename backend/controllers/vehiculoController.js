const pool = require('../db');

const getAnios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Anio');
    res.json(result.rows);
  } catch (err) {
    console.error('Error en getAnios:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getModelosByMarca = async (req, res) => { 
  const idmarca = Number(req.params.idmarca);

  if (isNaN(idmarca)) {
    return res.status(400).json({ error: "idmarca inválido" });
  }

  try {
    const result = await pool.query(
      'SELECT idModelos AS idmodelo, nombre FROM Modelos WHERE idMarcas = $1 ORDER BY nombre',
      [idmarca]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMotores = async (req, res) => {
  try {
    const result = await pool.query('SELECT idMotores AS idmotor, tipo_motor AS nombre FROM Motores');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAnios, getModelosByMarca, getMotores };
