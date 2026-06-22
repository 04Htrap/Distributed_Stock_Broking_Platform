const service = require('../services/watchlistService');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const data = await service.add(req.userId, req.body.symbol);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const data = await service.remove(req.userId, req.params.symbol);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};