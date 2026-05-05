/**
 * @file citaController.js
 * @description Controlador para la gestión de citas del taller.
 *
 * Provee las operaciones de:
 * - Listar todas las citas con información enriquecida (cliente, vehículo, servicio, costo).
 * - Crear una nueva cita.
 * - Actualizar campos específicos de una cita existente (actualización parcial).
 *
 * Las citas se almacenan en la tabla `Cita` y se relacionan con
 * `Usuarios`, `Cotizacion`, `Servicios`, `Vehiculos`, `Marca`, `Modelos` y `Anio`.
 *
 * @module controllers/citaController
 */

const pool = require('../db');

/**
 * Obtiene todas las citas con información detallada del cliente, vehículo y servicio.
 *
 * Realiza JOINs contra las tablas relacionadas para enriquecer cada registro:
 * - `Usuarios` → nombre, email y teléfono del cliente
 * - `Cotizacion` → costo estimado y referencia a servicios/vehículo
 * - `Servicios` → nombre del servicio
 * - `Vehiculos`, `Marca`, `Modelos`, `Anio` → descripción completa del vehículo
 *
 * @async
 * @function getAllCitas
 * @param {import('express').Request}  req - Objeto de solicitud HTTP (sin parámetros requeridos).
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Arreglo JSON de citas ordenadas por ID descendente:
 * ```json
 * [{
 *   "id": 1,
 *   "idCotizacion": 2,
 *   "idUsuarios": 3,
 *   "fecha": "2026-05-10",
 *   "hora": "09:00:00",
 *   "nota": "...",
 *   "estado": "Pendiente",
 *   "cliente": "Juan Pérez",
 *   "email": "juan@mail.com",
 *   "telefono": "5551234",
 *   "servicio": "Cambio de aceite",
 *   "costo": 350,
 *   "vehiculo": "Toyota Corolla 2021"
 * }]
 * ```
 *
 * @throws {500} Si ocurre un error en la consulta a la base de datos.
 */
const getAllCitas = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.idCita AS id,
         c.idCotizacion,
         c.idUsuarios,
         c.fecha,
         c.hora,
         c.nota,
         c.estado,
         u.nombre AS cliente,
         u.email,
         u.telefono,
         s.nombre AS servicio,
         COALESCE(cz.total_estimado, 0) AS costo,
         CONCAT(m.nombre, ' ', mo.nombre, ' ', a.anio) AS vehiculo
       FROM Cita c
       LEFT JOIN Usuarios u ON u.idUsuarios = c.idUsuarios
       LEFT JOIN Cotizacion cz ON cz.idCotizacion = c.idCotizacion
       LEFT JOIN Servicios s ON s.idServicios = cz.idServicios
       LEFT JOIN Vehiculos v ON v.idVehiculos = cz.idVehiculos
       LEFT JOIN Marca m ON m.idMarcas = v.idMarcas
       LEFT JOIN Modelos mo ON mo.idModelos = v.idModelos
       LEFT JOIN Anio a ON a.idAnio = v.idAnio
       ORDER BY c.idCita DESC`
    );
    res.json(result.rows.map((row) => ({
      ...row,
      cliente: row.cliente || 'Cliente sin nombre',
      servicio: row.servicio || 'Servicio no definido',
      vehiculo: row.vehiculo || 'Vehículo no definido',
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Crea una nueva cita en la base de datos.
 *
 * El estado por defecto es `"Pendiente"` si no se especifica.
 * Los campos `idCotizacion` e `idUsuarios` son opcionales (se almacenan como NULL si no se proveen).
 *
 * @async
 * @function createCita
 * @param {import('express').Request}  req                    - Objeto de solicitud HTTP.
 * @param {Object}                     req.body               - Cuerpo de la solicitud.
 * @param {number}                     [req.body.idUsuarios]  - ID del usuario/cliente asociado.
 * @param {number}                     [req.body.idCotizacion] - ID de la cotización relacionada.
 * @param {string}                     req.body.fecha         - Fecha de la cita (YYYY-MM-DD).
 * @param {string}                     req.body.hora          - Hora de la cita (HH:MM).
 * @param {string}                     [req.body.nota]        - Nota u observaciones adicionales.
 * @param {string}                     [req.body.estado]      - Estado inicial (por defecto: "Pendiente").
 * @param {import('express').Response} res                    - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la cita creada (201) o un error (500).
 *
 * @example
 * // POST /api/citas
 * // Body: { "idUsuarios": 3, "fecha": "2026-05-15", "hora": "10:00", "nota": "Urgente" }
 * // Respuesta 201: { "id": 8, "fecha": "2026-05-15", "hora": "10:00:00", "estado": "Pendiente", ... }
 */
const createCita = async (req, res) => {
  try {
    const { idUsuarios, idCotizacion, fecha, hora, nota, estado } = req.body;
    const result = await pool.query(
      `INSERT INTO Cita (idCotizacion, idUsuarios, fecha, hora, nota, estado)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING idCita AS id, idCotizacion, idUsuarios, fecha, hora, nota, estado`,
      [idCotizacion || null, idUsuarios || null, fecha, hora, nota || '', estado || 'Pendiente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Actualiza parcialmente una cita existente por su ID.
 *
 * Solo actualiza los campos que se incluyan en el cuerpo de la solicitud.
 * Campos actualizables: `nota`, `estado`, `fecha`, `hora`.
 *
 * @async
 * @function updateCita
 * @param {import('express').Request}  req            - Objeto de solicitud HTTP.
 * @param {Object}                     req.params     - Parámetros de ruta.
 * @param {string}                     req.params.id  - ID de la cita a actualizar.
 * @param {Object}                     req.body       - Campos a actualizar (todos opcionales).
 * @param {string}                     [req.body.nota]   - Nueva nota para la cita.
 * @param {string}                     [req.body.estado] - Nuevo estado (ej. "Confirmada", "Cancelada").
 * @param {string}                     [req.body.fecha]  - Nueva fecha (YYYY-MM-DD).
 * @param {string}                     [req.body.hora]   - Nueva hora (HH:MM).
 * @param {import('express').Response} res            - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con la cita actualizada (200), no encontrada (404),
 *   sin campos (400) o error (500).
 *
 * @example
 * // PATCH /api/citas/8
 * // Body: { "estado": "Confirmada" }
 * // Respuesta: { "id": 8, "estado": "Confirmada", ... }
 */
const updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { nota, estado, fecha, hora } = req.body;
    const updates = [];
    const values = [];
    let index = 1;

    if (nota !== undefined) {
      updates.push(`nota = $${index++}`);
      values.push(nota);
    }
    if (estado !== undefined) {
      updates.push(`estado = $${index++}`);
      values.push(estado);
    }
    if (fecha !== undefined) {
      updates.push(`fecha = $${index++}`);
      values.push(fecha);
    }
    if (hora !== undefined) {
      updates.push(`hora = $${index++}`);
      values.push(hora);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se recibieron campos para actualizar' });
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE Cita SET ${updates.join(', ')} WHERE idCita = $${index} RETURNING idCita AS id, idCotizacion, idUsuarios, fecha, hora, nota, estado`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Elimina una cita de la base de datos por su ID.
 *
 * @async
 * @function deleteCita
 * @param {import('express').Request}  req          - Objeto de solicitud HTTP.
 * @param {Object}                     req.params   - Parámetros de ruta.
 * @param {string}                     req.params.id - ID de la cita a eliminar.
 * @param {import('express').Response} res          - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Responde con un mensaje de confirmación (200) o error (500).
 */
const deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Cita WHERE idCita = $1', [id]);
    res.json({ message: `Cita ${id} eliminada` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllCitas,
  createCita,
  updateCita,
  deleteCita,
};
