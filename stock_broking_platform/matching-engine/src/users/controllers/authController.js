const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await authService.getMe(req.userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};