const pool = require('../db');

const getMarcas = async (req, res) => {
  try{
    const result = await pool.query('SELECT idmarca, nombre FROM marca');
    res.json(result.rows);
  } catch (err){
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getMarcas };
