import api from '../api/axios';

export async function placeOrder(order) {
  const { data } = await api.post('/api/orders', order);
  return data;
}

export async function getMyOrders(userId) {
  const { data } = await api.get('/api/orders/me', {
    params: { userId },
  });
  return data;
}
