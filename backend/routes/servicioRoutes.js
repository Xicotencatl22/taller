const express = require('express');
const { getServicios, createServicio, updateServicio, deleteServicio } = require('../controllers/servicioController');
const router = express.Router();

router.get('/', getServicios);
router.post('/', createServicio);
router.put('/:id', updateServicio);
router.delete('/:id', deleteServicio);

module.exports = router;
