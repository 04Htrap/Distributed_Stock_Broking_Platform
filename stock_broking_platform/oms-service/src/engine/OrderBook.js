const PriorityQueue = require('./PriorityQueue');
const { buyComparator, sellComparator } = require('../../../matching-engine/src/utils/comparators');

class OrderBook {
  constructor(symbol) {
    this.symbol = symbol;

    this.buyOrders = new PriorityQueue(buyComparator);   // max heap
    this.sellOrders = new PriorityQueue(sellComparator); // min heap
  }

  // 🔥 Add order to correct side
  addOrder(order) {
    if (order.side === "BUY") {
      this.buyOrders.push(order);
    } else {
      this.sellOrders.push(order);
    }
  }

  // 🔥 Best orders (top of heap)
  getBestBuy() {
    return this.buyOrders.peek();
  }

  getBestSell() {
    return this.sellOrders.peek();
  }

  // 🔥 Remove filled orders
  removeBestBuy() {
    return this.buyOrders.pop();
  }

  removeBestSell() {
    return this.sellOrders.pop();
  }

  // 🔥 Safe checks (used optionally)
  hasBuyOrders() {
    return this.buyOrders.heap.length > 0;
  }

  hasSellOrders() {
    return this.sellOrders.heap.length > 0;
  }
}

module.exports = OrderBook;