const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Municipio = require('./Municipio');

const Empresa = sequelize.define('Empresa', {
  nombre_comercial: {
    type: DataTypes.STRING,
    allowNull: false
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING
  },
  correo: {
    type: DataTypes.STRING
  },
  id_municipio: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'empresa',
  timestamps: false
});

Empresa.belongsTo(Municipio, { foreignKey: 'id_municipio' });
Municipio.hasMany(Empresa, { foreignKey: 'id_municipio' });

module.exports = Empresa;
