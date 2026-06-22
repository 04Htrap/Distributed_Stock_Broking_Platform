require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const OMS = 'http://localhost:3001';
const USER = 'http://localhost:3002';
const MARKET = 'http://localhost:4000';

app.get('/', (req, res) => {
  res.send('Gateway Service Alive');
});

/* ---------------- USER SERVICE ---------------- */

app.use('/api/auth', async (req, res) => {
  proxy(req, res, USER);
});

app.use('/api/wallet', async (req, res) => {
  proxy(req, res, USER);
});

app.use('/api/portfolio', async (req, res) => {
  proxy(req, res, USER);
});

app.use('/api/watchlist', async (req, res) => {
  proxy(req, res, USER);
});

/* ---------------- OMS SERVICE ---------------- */

app.use('/api/orders', async (req, res) => {
  proxy(req, res, OMS);
});

app.use('/api/orderbook', async (req, res) => {
  proxy(req, res, OMS);
});

/* ---------------- MARKET SERVICE ---------------- */

app.use('/api/market', async (req, res) => {
  proxy(req, res, MARKET);
});

/* ---------------- PROXY FUNCTION ---------------- */

async function proxy(req, res, baseUrl) {
  try {
    const url = baseUrl + req.originalUrl;

    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: {
        Authorization: req.headers.authorization || '',
        'Content-Type': 'application/json'
      },
    });

    res.status(response.status).json(response.data);

  } catch (err) {
    const status = err.response?.status || 500;

    res.status(status).json({
      error:
        err.response?.data ||
        err.message
    });
  }
}

app.listen(3000, () => {
  console.log(
    '🚀 Gateway running on port 3000'
  );
});