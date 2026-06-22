const express = require('express');
const router = express.Router();

const engine = require('../../../oms-service/src/engine/engineSingleton');
console.log("API engine:", engine);

router.get('/orderbook', (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "symbol required" });
  }

  const book = engine.getOrderBook(symbol);

  res.json(book);
});

module.exports = router;