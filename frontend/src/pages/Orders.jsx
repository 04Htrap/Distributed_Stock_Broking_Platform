import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { usePolling } from '../hooks/usePolling';
import { normalizeError } from '../utils/errors';
import { formatNumber, formatStatus } from '../utils/format';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

function StatusBadge({ status }) {
  const normalized = (status || '').toUpperCase();
  let cls = 'badge';
  if (normalized === 'PENDING' || normalized === 'PARTIAL') cls += ' badge--pending';
  else if (normalized === 'FILLED') cls += ' badge--filled';
  else if (normalized === 'CANCELLED') cls += ' badge--cancelled';
  return <span className={cls}>{formatStatus(status)}</span>;
}

function SideBadge({ side }) {
  const cls = `badge badge--${(side || '').toLowerCase()}`;
  return <span className={cls}>{side}</span>;
}

export default function Orders() {
  const { userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getMyOrders(userId);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  usePolling(fetchOrders, 15000, Boolean(userId));

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-header__title">Orders</h1>
          <p className="page-header__subtitle">Your order history</p>
        </div>

        {loading ? (
          <LoadingState message="Loading orders..." />
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load orders" description={error} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No orders yet"
            description="Place your first order from the dashboard"
          />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Remaining</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td title={o.id}>{o.id?.slice(0, 8)}…</td>
                    <td style={{ fontWeight: 600 }}>{o.symbol}</td>
                    <td><SideBadge side={o.side} /></td>
                    <td>{formatNumber(o.price)}</td>
                    <td>{formatNumber(o.quantity, 0)}</td>
                    <td>{formatNumber(o.remaining, 0)}</td>
                    <td><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
