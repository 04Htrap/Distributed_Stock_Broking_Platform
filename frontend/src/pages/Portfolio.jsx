import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getPortfolio } from '../services/portfolioService';
import { usePolling } from '../hooks/usePolling';
import { normalizeError } from '../utils/errors';
import { formatNumber } from '../utils/format';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await getPortfolio();
      setHoldings(data);
      setError(null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  usePolling(fetchPortfolio, 15000, !loading);

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-header__title">Portfolio</h1>
          <p className="page-header__subtitle">Your current holdings</p>
        </div>

        {loading ? (
          <LoadingState message="Loading portfolio..." />
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load portfolio" description={error} />
        ) : holdings.length === 0 ? (
          <EmptyState
            icon="💼"
            title="No holdings"
            description="Place a BUY order to start building your portfolio"
          />
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Avg Price</th>
                  <th>Locked</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.symbol}>
                    <td style={{ fontWeight: 600 }}>{h.symbol}</td>
                    <td>{formatNumber(h.quantity, 0)}</td>
                    <td>{formatNumber(h.avg_price)}</td>
                    <td>{formatNumber(h.locked_quantity || 0, 0)}</td>
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
