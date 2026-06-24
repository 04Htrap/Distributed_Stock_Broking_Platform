import api from '../api/axios';

export async function getOrderBook(symbol) {
  const { data } = await api.get(`/api/orderbook/${symbol}`);
  return data;
}
