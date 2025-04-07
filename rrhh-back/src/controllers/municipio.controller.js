const Municipio = require('../models/Municipio');
const Departamento = require('../models/departamento');

exports.getAll = async (req, res) => {
  try {
    const municipios = await Municipio.findAll({ include: Departamento });
    res.json(municipios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const muni = await Municipio.findByPk(req.params.id, { include: Departamento });
    if (!muni) return res.status(404).json({ message: 'No encontrado' });
    res.json(muni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const muni = await Municipio.create(req.body);
    res.status(201).json(muni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const muni = await Municipio.findByPk(req.params.id);
    if (!muni) return res.status(404).json({ message: 'No encontrado' });

    await muni.update(req.body);
    res.json(muni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const muni = await Municipio.findByPk(req.params.id);
    if (!muni) return res.status(404).json({ message: 'No encontrado' });

    await muni.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
