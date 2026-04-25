const express = require('express');
const { getAnios, getModelosByMarca, getMotores } = require('../controllers/vehiculoController');
const router = express.Router();

router.get('/anio', getAnios);
router.get('/modelo/:idmarca', getModelosByMarca);
router.get('/motor', getMotores);

module.exports = router;
