const express = require('express');
const app = express();

const orderRoutes = require('./routes/orderRoutes');
const orderbookRoutes = require('./routes/orderbookRoutes');
const authRoutes = require('./users/routes/authRoutes');
const walletRoutes = require('./users/routes/walletRoutes');
const watchlistRoutes = require('./users/routes/watchlistRoutes');
const portfolioRoutes = require('./users/routes/portfolioRoutes');

const { connectProducer } = require('./kafka/producer');
const { startOrderConsumer } = require('./kafka/consumers/orderConsumer');
const { startOmsOrderUpdateConsumer } = require('./kafka/consumers/omsOrderUpdateConsumer');
const { startOmsTradeConsumer } = require('./kafka/consumers/omsTradeConsumer');
const { startEventBridge } = require('./kafka/eventBridge');
const { startTradeConsumer } = require('./users/kafka/tradeConsumer');

app.use(express.json());

app.use('/api', orderRoutes);
app.use('/api', orderbookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/portfolio', portfolioRoutes);

async function start() {
  try {
    await connectProducer();
    startEventBridge();
    await startOrderConsumer();
    await startOmsOrderUpdateConsumer();
    await startOmsTradeConsumer();
    await startTradeConsumer();

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ Error starting server:", err);
  }
}

start();  