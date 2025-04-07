const { Colaborador, Empresa } = require('../models');


exports.getAll = async (req, res) => {
  try {
    const colaboradores = await Colaborador.findAll({ include: Empresa });
    res.json(colaboradores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const colaborador = await Colaborador.findByPk(req.params.id, { include: Empresa });
    if (!colaborador) return res.status(404).json({ message: 'No encontrado' });
    res.json(colaborador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre_completo, edad, telefono, correo, empresas } = req.body;
    const colaborador = await Colaborador.create({ nombre_completo, edad, telefono, correo });

    // Asociar empresas si vienen
    if (empresas && empresas.length > 0) {
      await colaborador.setEmpresas(empresas);
    }

    res.status(201).json(colaborador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const colaborador = await Colaborador.findByPk(req.params.id);
    if (!colaborador) return res.status(404).json({ message: 'No encontrado' });

    const { nombre_completo, edad, telefono, correo, empresas } = req.body;
    await colaborador.update({ nombre_completo, edad, telefono, correo });

    if (empresas) {
      await colaborador.setEmpresas(empresas);
    }

    res.json(colaborador);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const colaborador = await Colaborador.findByPk(req.params.id);
    if (!colaborador) return res.status(404).json({ message: 'No encontrado' });

    await colaborador.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
