const engine = require('../engine/engineSingleton');

exports.getOrderBook = (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  const book = engine.getOrderBook(symbol);

  res.json(book);
};