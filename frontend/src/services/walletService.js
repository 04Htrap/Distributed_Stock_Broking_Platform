import api from '../api/axios';

export async function getWallet() {
  const { data } = await api.get('/api/wallet');
  return data;
}

export async function deposit(amount) {
  const { data } = await api.post('/api/wallet/deposit', { amount });
  return data;
}
