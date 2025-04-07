const Empresa = require('../models/Empresa');
const Municipio = require('../models/Municipio');

exports.getAll = async (req, res) => {
  try {
    const empresas = await Empresa.findAll({ include: Municipio });
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id, { include: Municipio });
    if (!empresa) return res.status(404).json({ message: 'No encontrada' });
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const empresa = await Empresa.create(req.body);
    res.status(201).json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'No encontrada' });

    await empresa.update(req.body);
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.status(404).json({ message: 'No encontrada' });

    await empresa.destroy();
    res.json({ message: 'Eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
