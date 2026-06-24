import api from '../api/axios';

export async function getQuote(symbol) {
  const { data } = await api.get(`/api/market/quote/${symbol}`);
  return data;
}

export async function getChart(symbol, range = '1D') {
  const { data } = await api.get(`/api/market/chart/${symbol}`, {
    params: { range },
  });
  return data;
}

export async function getMarketWatchlist(symbols) {
  const { data } = await api.get('/api/market/watchlist', {
    params: { symbols: symbols.join(',') },
  });
  return data;
}

export async function searchStocks(query) {
  const { data } = await api.get('/api/market/search', {
    params: { q: query },
  });
  return data;
}
