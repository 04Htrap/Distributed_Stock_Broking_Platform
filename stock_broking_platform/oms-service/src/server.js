require('dotenv').config();

const express = require('express');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
const orderbookRoutes = require('./routes/orderbookRoutes');

const { connectProducer } = require('./kafka/producer');
const { startOrderConsumer } = require('./kafka/consumers/orderConsumer');
const { startOmsTradeConsumer } = require('./kafka/consumers/omsTradeConsumer');
const { startOmsOrderUpdateConsumer } = require('./kafka/consumers/omsOrderUpdateConsumer');
const { startEventBridge } = require('./kafka/eventBridge');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('OMS Service Alive');
});

app.use('/api/orders', orderRoutes);
app.use('/api/orderbook', orderbookRoutes);

async function start() {
  await connectProducer();

  startEventBridge();

  await startOrderConsumer();
  await startOmsTradeConsumer();
  await startOmsOrderUpdateConsumer();

  app.listen(3001, () => {
    console.log('🚀 OMS Service running on port 3001');
  });
}

start();