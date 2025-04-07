const Pais = require('../models/pais');

exports.getAll = async (req, res) => {
  try {
    const paises = await Pais.findAll();
    res.json(paises);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pais = await Pais.findByPk(req.params.id);
    if (!pais) return res.status(404).json({ message: 'No encontrado' });
    res.json(pais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const pais = await Pais.create({ nombre: req.body.nombre });
    res.status(201).json(pais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const pais = await Pais.findByPk(id);
    if (!pais) return res.status(404).json({ message: 'No encontrado' });

    await pais.update({ nombre: req.body.nombre });
    res.json(pais);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const pais = await Pais.findByPk(req.params.id);
    if (!pais) return res.status(404).json({ message: 'No encontrado' });

    await pais.destroy();
    res.json({ message: 'Eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
