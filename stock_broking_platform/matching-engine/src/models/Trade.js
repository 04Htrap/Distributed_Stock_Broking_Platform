class Trade {
  constructor({
    tradeId,
    buyOrderId,
    sellOrderId,
    buyUserId,
    sellUserId,
    symbol,
    price,
    quantity,
    executedAt
  }) {
    this.tradeId = tradeId;
    this.buyOrderId = buyOrderId;
    this.sellOrderId = sellOrderId;
    this.buyUserId = buyUserId;
    this.sellUserId = sellUserId;
    this.symbol = symbol;
    this.price = price;
    this.quantity = quantity;
    this.executedAt = executedAt;
  }
}

module.exports = Trade;