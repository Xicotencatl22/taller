require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const marcaRoutes = require('./routes/marcaRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const citaRoutes = require('./routes/citaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', ( req, res) => {
  res.send('Backend en funcionamiento');
});

// Rutas base API existentes refactorizadas
app.use('/api/marca', marcaRoutes);
app.use('/api', vehiculoRoutes); // Maneja /api/anio, /api/modelo/:idmarca, /api/motor
app.use('/api/cliente', clienteRoutes);

// Nuevas Rutas (Preparadas para conectarse después)
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});