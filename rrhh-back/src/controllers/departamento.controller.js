const Departamento = require('../models/departamento');
const Pais = require('../models/pais');

exports.getAll = async (req, res) => {
  try {
    const departamentos = await Departamento.findAll({ include: Pais });
    res.json(departamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const depto = await Departamento.findByPk(req.params.id, { include: Pais });
    if (!depto) return res.status(404).json({ message: 'No encontrado' });
    res.json(depto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const depto = await Departamento.create(req.body);
    res.status(201).json(depto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const depto = await Departamento.findByPk(req.params.id);
    if (!depto) return res.status(404).json({ message: 'No encontrado' });

    await depto.update(req.body);
    res.json(depto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const depto = await Departamento.findByPk(req.params.id);
    if (!depto) return res.status(404).json({ message: 'No encontrado' });

    await depto.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
