/**
 * @file reportes.js
 * @description Rutas para la generación de reportes del taller.
 *
 * Monta el enrutador bajo `/api/reportes` (definido en server.js).
 *
 * > **NOTA:** Este archivo aún utiliza sintaxis de MySQL (`?` como placeholder y `db.query` con callback).
 * > Debe migrarse a la sintaxis de PostgreSQL (`$1`, `$2`, etc. con `pool.query` async/await)
 * > para ser compatible con el resto del backend.
 *
 * | Método | Ruta                  | Descripción                                         |
 * |--------|-----------------------|-----------------------------------------------------|
 * | GET    | /api/reportes/ventas  | Lista ventas con filtros opcionales de fecha/cliente|
 *
 * @module routes/reportes
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/reportes/ventas
 *
 * Obtiene un listado de ventas con sus totales, con filtros opcionales por rango de fechas
 * y por nombre de cliente.
 *
 * @name GET /ventas
 * @function
 * @param {import('express').Request}  req             - Objeto de solicitud HTTP.
 * @param {Object}                     req.query       - Query params opcionales.
 * @param {string}                     [req.query.inicio] - Fecha de inicio del filtro (YYYY-MM-DD).
 * @param {string}                     [req.query.fin]    - Fecha de fin del filtro (YYYY-MM-DD).
 * @param {string}                     [req.query.cliente] - Nombre del cliente a filtrar ("Todos" para sin filtro).
 * @param {import('express').Response} res             - Objeto de respuesta HTTP.
 * @returns {void} Responde con un objeto JSON:
 * ```json
 * {
 *   "total": 5000,
 *   "cantidad": 3,
 *   "data": [{ "id": 1, "cliente": "Juan", "servicio": "...", "fecha": "...", "total": 1500, "metodo": "..." }]
 * }
 * ```
 *
 * @example
 * // GET /api/reportes/ventas?inicio=2026-01-01&fin=2026-05-01&cliente=Juan
 */
router.get('/ventas', (req, res) => {
  const { inicio, fin, cliente } = req.query;

  let query = `
    SELECT 
      v.id,
      c.nombre AS cliente,
      v.servicio,
      v.fecha,
      v.total,
      v.metodo
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    WHERE 1=1
  `;

  let params = [];

  // Filtro por rango de fechas
  if (inicio && fin) {
    query += ' AND v.fecha BETWEEN ? AND ?';
    params.push(inicio, fin);
  }

  // Filtro por nombre de cliente
  if (cliente && cliente !== 'Todos') {
    query += ' AND c.nombre = ?';
    params.push(cliente);
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    const totalVentas = result.reduce((acc, v) => acc + Number(v.total), 0);

    res.json({
      total: totalVentas,
      cantidad: result.length,
      data: result
    });
  });
});

module.exports = router;
