require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const walletRoutes = require('./routes/walletRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const { startTradeConsumer } =
require('./kafka/tradeConsumer');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('User Service Alive');
});

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);

async function start() {
  await startTradeConsumer();

  app.listen(3002, () => {
    console.log(
      '🚀 User Service running on port 3002'
    );
  });
}

start();