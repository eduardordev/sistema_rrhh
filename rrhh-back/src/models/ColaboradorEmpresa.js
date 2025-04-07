const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Colaborador = require('./Colaborador');
const Empresa = require('./Empresa');

const ColaboradorEmpresa = sequelize.define('ColaboradorEmpresa', {
  id_colaborador: {
    type: DataTypes.INTEGER,
    references: { model: Colaborador, key: 'id' }
  },
  id_empresa: {
    type: DataTypes.INTEGER,
    references: { model: Empresa, key: 'id' }
  }
}, {
  tableName: 'colaborador_empresa',
  timestamps: false
});

Colaborador.belongsToMany(Empresa, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_colaborador'
});
Empresa.belongsToMany(Colaborador, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_empresa'
});

module.exports = ColaboradorEmpresa;
