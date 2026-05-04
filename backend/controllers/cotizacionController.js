/**
 * @file cotizacionController.js
 * @description Controlador CRUD para la gestión de cotizaciones del taller.
 *
 * Permite crear, consultar, actualizar y eliminar cotizaciones almacenadas
 * en la tabla `Cotizacion`. Cada cotización vincula un usuario, un vehículo,
 * un servicio y/o un producto con un total estimado y una fecha.
 *
 * @module controllers/cotizacionController
 */

const pool = require('../db');

/**
 * Obtiene todas las cotizaciones registradas, ordenadas por ID descendente.
 *
 * @async
 * @function getCotizaciones
 * @param {import('express').Request}  req - Objeto de solicitud HTTP (sin parámetros requeridos).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Arreglo JSON de cotizaciones:
 * ```json
 * [{
 *   "id": 1,
 *   "idUsuarios": 3,
 *   "idVehiculos": 2,
 *   "idServicios": 1,
 *   "idProductos": null,
 *   "totalEstimado": 850,
 *   "fecha": "2026-05-01"
 * }]
 * ```
 *
 * @throws {500} Si ocurre un error en la base de datos.
 */
const getCotizaciones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         idCotizacion AS id,
         idUsuarios,
         idVehiculos,
         idServicios,
         idProductos,
         total_estimado AS totalEstimado,
         fecha
       FROM Cotizacion
       ORDER BY idCotizacion DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Obtiene una cotización específica por su ID.
 *
 * @async
 * @function getCotizacionById
 * @param {import('express').Request}  req          - Objeto de solicitud HTTP.
 * @param {Object}                     req.params   - Parámetros de ruta.
 * @param {string}                     req.params.id - ID de la cotización a consultar.
 * @param {import('express').Response} res          - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Objeto JSON con los datos de la cotización (200),
 *   no encontrada (404) o error (500).
 *
 * @example
 * // GET /api/cotizaciones/3
 * // Respuesta: { "id": 3, "idUsuarios": 5, "totalEstimado": 1200, ... }
 */
const getCotizacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT
         idCotizacion AS id,
         idUsuarios,
         idVehiculos,
         idServicios,
         idProductos,
         total_estimado AS totalEstimado,
         fecha
       FROM Cotizacion
       WHERE idCotizacion = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Crea una nueva cotización en la base de datos.
 *
 * Todos los IDs de relaciones son opcionales (se almacenan como NULL si no se proveen).
 * Si no se especifica fecha, se utiliza la fecha actual del servidor.
 *
 * @async
 * @function createCotizacion
 * @param {import('express').Request}  req                        - Objeto de solicitud HTTP.
 * @param {Object}                     req.body                   - Cuerpo de la solicitud.
 * @param {number}                     [req.body.idUsuarios]      - ID del usuario/cliente.
 * @param {number}                     [req.body.idVehiculos]     - ID del vehículo asociado.
 * @param {number}                     [req.body.idServicios]     - ID del servicio cotizado.
 * @param {number}                     [req.body.idProductos]     - ID del producto cotizado.
 * @param {number}                     [req.body.total_estimado]  - Total estimado de la cotización.
 * @param {string}                     [req.body.fecha]           - Fecha de la cotización (YYYY-MM-DD).
 * @param {import('express').Response} res                        - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la cotización creada (201) o un error (500).
 *
 * @example
 * // POST /api/cotizaciones
 * // Body: { "idUsuarios": 3, "idServicios": 1, "total_estimado": 850, "fecha": "2026-05-01" }
 * // Respuesta 201: { "id": 10, "totalEstimado": 850, ... }
 */
const createCotizacion = async (req, res) => {
  try {
    const {
      idUsuarios,
      idVehiculos,
      idServicios,
      idProductos,
      total_estimado,
      fecha,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO Cotizacion
         (idUsuarios, idVehiculos, idServicios, idProductos, total_estimado, fecha)
       VALUES
         ($1, $2, $3, $4, $5, $6)
       RETURNING
         idCotizacion AS id,
         idUsuarios,
         idVehiculos,
         idServicios,
         idProductos,
         total_estimado AS totalEstimado,
         fecha`,
      [
        idUsuarios || null,
        idVehiculos || null,
        idServicios || null,
        idProductos || null,
        total_estimado || 0,
        fecha || new Date().toISOString().slice(0, 10),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza una cotización existente por su ID (actualización completa).
 *
 * Todos los campos del cuerpo son reemplazados. Los IDs de relaciones son
 * opcionales y se convierten en NULL si no se proveen.
 *
 * @async
 * @function updateCotizacion
 * @param {import('express').Request}  req          - Objeto de solicitud HTTP.
 * @param {Object}                     req.params   - Parámetros de ruta.
 * @param {string}                     req.params.id - ID de la cotización a actualizar.
 * @param {Object}                     req.body     - Campos actualizados (mismos que `createCotizacion`).
 * @param {import('express').Response} res          - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la cotización actualizada (200), no encontrada (404) o error (500).
 *
 * @example
 * // PUT /api/cotizaciones/10
 * // Body: { "total_estimado": 950 }
 * // Respuesta: { "id": 10, "totalEstimado": 950, ... }
 */
const updateCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      idUsuarios,
      idVehiculos,
      idServicios,
      idProductos,
      total_estimado,
      fecha,
    } = req.body;

    const result = await pool.query(
      `UPDATE Cotizacion SET
         idUsuarios = $1,
         idVehiculos = $2,
         idServicios = $3,
         idProductos = $4,
         total_estimado = $5,
         fecha = $6
       WHERE idCotizacion = $7
       RETURNING
         idCotizacion AS id,
         idUsuarios,
         idVehiculos,
         idServicios,
         idProductos,
         total_estimado AS totalEstimado,
         fecha`,
      [
        idUsuarios || null,
        idVehiculos || null,
        idServicios || null,
        idProductos || null,
        total_estimado || 0,
        fecha || new Date().toISOString().slice(0, 10),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Elimina una cotización de la base de datos por su ID.
 *
 * @async
 * @function deleteCotizacion
 * @param {import('express').Request}  req          - Objeto de solicitud HTTP.
 * @param {Object}                     req.params   - Parámetros de ruta.
 * @param {string}                     req.params.id - ID de la cotización a eliminar.
 * @param {import('express').Response} res          - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un mensaje de confirmación (200) o error (500).
 *
 * @example
 * // DELETE /api/cotizaciones/10
 * // Respuesta: { "message": "Cotización 10 eliminada" }
 */
const deleteCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Cotizacion WHERE idCotizacion = $1', [id]);
    res.json({ message: `Cotización ${id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCotizaciones,
  getCotizacionById,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
};
