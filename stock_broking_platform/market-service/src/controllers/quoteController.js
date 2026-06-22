const axios = require('axios');
const { getCache, setCache } = require('../services/cacheService');

const BASE_URL = 'https://api.polygon.io/v2/aggs/ticker';

async function fetchQuote(symbol) {
  const url =
`https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`;

  const res = await axios.get(url);

  const data = res.data.results?.[0];

  if (!data) return null;

  return {
    symbol,
    price: data.c,
    open: data.o,
    high: data.h,
    low: data.l,
    close: data.c,
    volume: data.v,
    timestamp: data.t
  };
}

// SINGLE QUOTE
exports.getQuote = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const cacheKey = `quote:${symbol}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const quote = await fetchQuote(symbol);

    if (!quote) {
      return res.status(404).json({ error: 'Symbol not found' });
    }

    await setCache(cacheKey, quote, 15);

    res.json(quote);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// WATCHLIST (BATCH)
exports.getWatchlist = async (req, res) => {
  try {
    let symbols = req.query.symbols;

    if (!symbols) {
      return res.status(400).json({ error: 'symbols required' });
    }

    if (Array.isArray(symbols)) {
      symbols = symbols[0];
    }

    const list = String(symbols)
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const results = [];

    for (const symbol of list) {
      const cacheKey = `quote:${symbol}`;

      let quote = await getCache(cacheKey);

      if (!quote) {
        quote = await fetchQuote(symbol);

        if (quote) {
          await setCache(cacheKey, quote, 15);
        }
      }

      if (quote) results.push(quote);
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};