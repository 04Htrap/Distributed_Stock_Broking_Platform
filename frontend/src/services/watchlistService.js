import api from '../api/axios';

export async function getWatchlist() {
  const { data } = await api.get('/api/watchlist');
  return data;
}

export async function addToWatchlist(symbol) {
  const { data } = await api.post('/api/watchlist', { symbol });
  return data;
}

export async function removeFromWatchlist(symbol) {
  const { data } = await api.delete(`/api/watchlist/${symbol}`);
  return data;
}
