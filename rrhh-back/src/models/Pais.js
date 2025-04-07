const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Pais = sequelize.define('Pais', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'pais',
  timestamps: false
});

module.exports = Pais;
