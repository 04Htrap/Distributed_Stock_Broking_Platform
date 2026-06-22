const OrderBook = require('./OrderBook');
const Trade = require('../../../matching-engine/src/models/Trade');
const EventBus = require('../../../matching-engine/src/utils/EventBus');
const crypto = require('crypto');

class MatchingEngine {
  constructor() {
    this.orderBooks = new Map(); // symbol → OrderBook
  }

  // 🔥 INTERNAL: Always return REAL OrderBook
  _getOrCreateOrderBook(symbol) {
    if (!this.orderBooks.has(symbol)) {
      this.orderBooks.set(symbol, new OrderBook());
    }
    return this.orderBooks.get(symbol);
  }

  // 🔥 PUBLIC: Used by API (formatted output)
  getOrderBook(symbol) {
    const book = this.orderBooks.get(symbol);

    if (!book) {
      return { bids: [], asks: [] };
    }

    return {
      bids: book.buyOrders.heap.map(order => ({
        price: order.price,
        quantity: order.remaining
      })),
      asks: book.sellOrders.heap.map(order => ({
        price: order.price,
        quantity: order.remaining
      }))
    };
  }

  // 🔥 CORE ENTRY
  processOrder(order) {
    const orderBook = this._getOrCreateOrderBook(order.symbol);
    const trades = [];

    console.log("🧠 Processing order:", order.side, order.price);

    if (order.side === "BUY") {
      this._matchBuy(order, orderBook, trades);
    } else {
      this._matchSell(order, orderBook, trades);
    }

    console.log("Remaining after match:", order.remaining);

    // 🔥 If still remaining
    if (order.remaining > 0) {
      if (order.type === "LIMIT") {
        console.log("📌 Adding to orderbook");

        orderBook.addOrder(order);

        this._updateOrderStatus(order);
        EventBus.emit("ORDER_UPDATED", order);
      } else {
        // MARKET leftover discarded
        this._updateOrderStatus(order);
        EventBus.emit("ORDER_UPDATED", order);
      }
    }

    // ❌ No else block
    // If fully matched, update already emitted inside match loop

    return trades;
  }

  // 🔥 BUY matching
  _matchBuy(order, orderBook, trades) {
    while (
      order.remaining > 0 &&
      orderBook.sellOrders.heap.length > 0
    ) {
      const bestSell = orderBook.sellOrders.peek();

      if (order.type === "LIMIT" && bestSell.price > order.price) {
        break;
      }

      const matchQty = Math.min(order.remaining, bestSell.remaining);

      const trade = new Trade({
        tradeId: crypto.randomUUID(),
        buyOrderId: order.id,
        sellOrderId: bestSell.id,
        buyUserId: order.userId,
        sellUserId: bestSell.userId,
        symbol: order.symbol,
        price: bestSell.price,
        quantity: matchQty,
        executedAt: new Date().toISOString(),
      });

      trades.push(trade);
      EventBus.emit("TRADE_EXECUTED", trade);

      order.remaining -= matchQty;
      bestSell.remaining -= matchQty;

      this._updateOrderStatus(order);
      this._updateOrderStatus(bestSell);

      EventBus.emit("ORDER_UPDATED", order);
      EventBus.emit("ORDER_UPDATED", bestSell);

      if (bestSell.remaining === 0) {
        orderBook.sellOrders.pop();
      }
    }
  }

  // 🔥 SELL matching
  _matchSell(order, orderBook, trades) {
    while (
      order.remaining > 0 &&
      orderBook.buyOrders.heap.length > 0
    ) {
      const bestBuy = orderBook.buyOrders.peek();

      if (order.type === "LIMIT" && bestBuy.price < order.price) {
        break;
      }

      const matchQty = Math.min(order.remaining, bestBuy.remaining);

      const trade = new Trade({
        tradeId: crypto.randomUUID(),
        buyOrderId: bestBuy.id,
        sellOrderId: order.id,
        buyUserId: bestBuy.userId,
        sellUserId: order.userId,
        symbol: order.symbol,
        price: bestBuy.price,
        quantity: matchQty,
        executedAt: new Date().toISOString()
      });

      trades.push(trade);
      EventBus.emit("TRADE_EXECUTED", trade);

      order.remaining -= matchQty;
      bestBuy.remaining -= matchQty;

      this._updateOrderStatus(order);
      this._updateOrderStatus(bestBuy);

      EventBus.emit("ORDER_UPDATED", order);
      EventBus.emit("ORDER_UPDATED", bestBuy);

      if (bestBuy.remaining === 0) {
        orderBook.buyOrders.pop();
      }
    }
  }

  _updateOrderStatus(order) {
    if (order.remaining === 0) {
      order.status = "FILLED";
    } else if (order.remaining < order.quantity) {
      order.status = "PARTIAL";
    } else {
      order.status = "PENDING";
    }
  }
}

module.exports = MatchingEngine;