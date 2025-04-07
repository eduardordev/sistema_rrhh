const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Colaborador = sequelize.define('Colaborador', {
  nombre_completo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER
  },
  telefono: {
    type: DataTypes.STRING
  },
  correo: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'colaborador',
  timestamps: false
});

module.exports = Colaborador;
