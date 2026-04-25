const express = require('express');
const { getAllCitas, createCita, updateCitaStatus } = require('../controllers/citaController');
const router = express.Router();

router.get('/', getAllCitas);
router.post('/', createCita);
router.patch('/:id/estado', updateCitaStatus);

module.exports = router;
