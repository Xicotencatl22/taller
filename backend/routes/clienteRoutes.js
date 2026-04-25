const express = require('express');
const { createCliente } = require('../controllers/clienteController');
const router = express.Router();

router.post('/', createCliente);

module.exports = router;
