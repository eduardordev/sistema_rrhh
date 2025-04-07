const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Pais = require('./pais'); // Importamos para la relación

const Departamento = sequelize.define('Departamento', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  id_pais: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'departamento',
  timestamps: false
});

Departamento.belongsTo(Pais, { foreignKey: 'id_pais' });
Pais.hasMany(Departamento, { foreignKey: 'id_pais' });

module.exports = Departamento;
