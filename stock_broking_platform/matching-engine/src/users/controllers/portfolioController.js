const service = require('../services/portfolioService');

exports.getPortfolio = async (req, res) => {
  try {
    const data = await service.getPortfolio(req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHolding = async (req, res) => {
  try {
    const data = await service.getHolding(
      req.userId,
      req.params.symbol.toUpperCase()
    );

    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};