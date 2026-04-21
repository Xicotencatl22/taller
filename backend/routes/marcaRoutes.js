const express = require('express');
const { getMarcas } = require('../controllers/marcaController');
const router = express.Router();

router.get('/', getMarcas);

module.exports = router;
