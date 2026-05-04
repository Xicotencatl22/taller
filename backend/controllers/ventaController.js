const pool = require('../db');

/**
 * GET /api/ventas
 */
const getVentas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        v.idVenta as id,
        v.total,
        v.metodo_pago,
        v.fecha,
        u.nombre as cliente,
        u.email as cliente_correo,
        p.nombre as producto_nombre,
        p.precio_venta as precio_unitario
      FROM Venta v
      LEFT JOIN Usuarios u ON v.idUsuarios = u.idUsuarios
      LEFT JOIN Productos p ON v.idProductos = p.idProductos
      ORDER BY v.idVenta DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/ventas
 */
const createVenta = async (req, res) => {
  const { idProductos, idUsuarios, metodo_pago, total } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO Venta (idProductos, idUsuarios, metodo_pago, total)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [idProductos, idUsuarios, metodo_pago, total]
    );
    
    // Si la venta se registra, deberíamos descontar el stock del producto
    if (idProductos) {
      await pool.query(
        'UPDATE Productos SET stock_actual = stock_actual - 1 WHERE idProductos = $1',
        [idProductos]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getVentas, createVenta };
