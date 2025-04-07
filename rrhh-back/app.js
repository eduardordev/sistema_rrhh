const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/sequelize');
require('dotenv').config();
require('./src/models');


const app = express();
app.use(cors());
app.use(express.json());

const paisRoutes = require('./src/routes/pais.routes');
app.use('/api/paises', paisRoutes);

const departamentoRoutes = require('./src/routes/departamento.routes');
app.use('/api/departamentos', departamentoRoutes);

const municipioRoutes = require('./src/routes/municipio.routes');
app.use('/api/municipios', municipioRoutes);

const empresaRoutes = require('./src/routes/empresa.routes');
app.use('/api/empresas', empresaRoutes);

const colaboradorRoutes = require('./src/routes/colaborador.routes');
app.use('/api/colaboradores', colaboradorRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Conexión Sequelize => MySQL exitosa');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados');
  })
  .catch(err => {
    console.error('Error al conectar con Sequelize:', err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
