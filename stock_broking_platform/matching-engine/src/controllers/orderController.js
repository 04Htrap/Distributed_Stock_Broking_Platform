const orderService = require('../services/oms/orderService');
const queryService = require('../services/oms/queryService');

exports.placeOrder = async (req, res) => {
  try {
    const result = await orderService.placeOrder(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.query.userId; // temp until JWT added
    const rows = await queryService.getOrdersByUser(userId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const row = await queryService.getOrderById(req.params.id);
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};