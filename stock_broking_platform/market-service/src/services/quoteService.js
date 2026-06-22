const axios = require('axios');
const { redis } = require('../redis/redisClient');

const KEY = process.env.POLYGON_KEY;

async function fetchQuote(symbol) {
  symbol = symbol.toUpperCase();

  const cacheKey = `price:${symbol}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const url =
    `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${KEY}`;

  const response = await axios.get(url);

  const item = response.data.results?.[0];

  if (!item) {
    throw new Error('Invalid symbol');
  }

  const quote = {
    symbol,
    price: item.c,
    open: item.o,
    high: item.h,
    low: item.l,
    volume: item.v,
    change: item.c - item.o,
    percent: ((item.c - item.o) / item.o) * 100,
    time: new Date().toISOString(),
    source: 'Polygon'
  };

  await redis.setEx(cacheKey, 5, JSON.stringify(quote));

  return quote;
}

async function fetchMany(symbols) {
  const arr = symbols
    .split(',')
    .map(s => s.trim().toUpperCase());

  const results = [];

  for (const symbol of arr) {
    try {
      const q = await fetchQuote(symbol);
      results.push(q);
    } catch (err) {}
  }

  return results;
}

async function fetchChart(symbol, days = 30) {
  symbol = symbol.toUpperCase();

  const end = new Date();
  const start = new Date();

  start.setDate(end.getDate() - Number(days));

  const from = start.toISOString().slice(0, 10);
  const to = end.toISOString().slice(0, 10);

  const url =
    `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${KEY}`;

  const response = await axios.get(url);

  return response.data.results || [];
}

module.exports = {
  fetchQuote,
  fetchMany,
  fetchChart
};