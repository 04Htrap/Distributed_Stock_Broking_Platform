require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectRedis } = require('./redis/redisClient');
const marketRoutes = require('./routes/marketRoutes');

const { startSymbolConsumer } =
require('./kafka/symbolConsumer');

const { startPricePoller } =
require('./jobs/pricePoller');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/market', marketRoutes);

app.get('/', (req, res) => {
  res.send('market service alive');
});

async function start() {
  await connectRedis();

  await startSymbolConsumer();

  startPricePoller();

  app.listen(4000, () => {
    console.log(
      '🚀 Market Service running on port 4000'
    );
  });
}

start();