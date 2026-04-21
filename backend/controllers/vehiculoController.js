const pool = require('../db');

const getAnios = async (req, res) => {
  try{
    const result = await pool.query('SELECT * FROM anio');
    res.json(result.rows);
  } catch (err){
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
      'SELECT idmodelo, nombre FROM modelo WHERE idmarca = $1 order by nombre',
      [idmarca]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMotores = async (req, res) => {
  try{
    const result = await pool.query('SELECT idmotor, nombre FROM motor');
    res.json(result.rows);
  } catch (err){
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAnios, getModelosByMarca, getMotores };
