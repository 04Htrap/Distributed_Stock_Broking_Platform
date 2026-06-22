class Order {
  constructor({
    id,
    userId,
    symbol,
    side,
    type,
    price,
    quantity,
    timestamp
  }) {
    this.id = id;
    this.userId = userId;
    this.symbol = symbol;
    this.side = side;
    this.type = type;

    // 🔥 Ensure numeric values
    this.price = price ? Number(price) : null;
    this.quantity = Number(quantity);

    // 🔥 CRITICAL for matching engine
    this.remaining = Number(quantity);

    // 🔥 Default timestamp if not provided
    this.timestamp = timestamp || Date.now();

    // 🔥 Order lifecycle
    this.status = "PENDING"; // PENDING | PARTIAL | FILLED
  }
}

module.exports = Order;