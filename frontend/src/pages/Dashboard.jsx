import { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import WatchlistPanel from '../components/watchlist/WatchlistPanel';
import StockChart from '../components/chart/StockChart';
import WalletCard from '../components/wallet/WalletCard';
import OrderForm from '../components/trading/OrderForm';
import OrderBookPanel from '../components/orderbook/OrderBookPanel';

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderPlaced = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-grid">
        <WatchlistPanel />

        <StockChart />

        <div className="dashboard-panel">
          <div className="dashboard-panel__header">
            <h2 className="dashboard-panel__title">Trade</h2>
          </div>
          <div className="dashboard-panel__body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <WalletCard />
            <OrderForm onOrderPlaced={handleOrderPlaced} />
            <div className="card">
              <div className="card__label" style={{ marginBottom: '0.75rem' }}>
                Order Book
              </div>
              <OrderBookPanel key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
