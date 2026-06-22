const service = require('../services/walletService');

exports.getWallet = async (req, res) => {
  try {
    const data = await service.getWallet(req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deposit = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    const data = await service.deposit(req.userId, amount);

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};