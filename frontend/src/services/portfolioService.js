import api from '../api/axios';

export async function getPortfolio() {
  const { data } = await api.get('/api/portfolio');
  return data;
}
