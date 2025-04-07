const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Departamento = require('./departamento');

const Municipio = sequelize.define('Municipio', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_departamento: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'municipio',
  timestamps: false
});

Municipio.belongsTo(Departamento, { foreignKey: 'id_departamento' });
Departamento.hasMany(Municipio, { foreignKey: 'id_departamento' });

module.exports = Municipio;