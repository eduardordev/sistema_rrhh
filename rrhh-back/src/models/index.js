const Empresa = require('./Empresa');
const Colaborador = require('./Colaborador');
const ColaboradorEmpresa = require('./ColaboradorEmpresa');

Colaborador.belongsToMany(Empresa, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_colaborador'
});
Empresa.belongsToMany(Colaborador, {
  through: ColaboradorEmpresa,
  foreignKey: 'id_empresa'
});

module.exports = {
  Empresa,
  Colaborador,
  ColaboradorEmpresa
};
