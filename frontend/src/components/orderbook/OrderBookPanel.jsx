import { useState, useEffect, useCallback } from 'react';
import { getOrderBook } from '../../services/orderbookService';
import { useAuth } from '../../context/AuthContext';
import { usePolling } from '../../hooks/usePolling';
import { formatNumber } from '../../utils/format';
import SkeletonLoader from '../ui/SkeletonLoader';
import EmptyState from '../ui/EmptyState';

export default function OrderBookPanel() {
  const { selectedSymbol } = useAuth();
  const [book, setBook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(false);

  const fetchBook = useCallback(async () => {
    if (!selectedSymbol) return;
    try {
      const data = await getOrderBook(selectedSymbol);
      setBook(data);
    } catch {
      setBook({ bids: [], asks: [] });
    } finally {
      setLoading(false);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true);
      fetchBook();
    }
  }, [selectedSymbol, fetchBook]);

  usePolling(fetchBook, 5000, Boolean(selectedSymbol));

  if (!selectedSymbol) {
    return (
      <EmptyState
        icon="📖"
        title="Order book"
        description="Select a symbol to view bids and asks"
      />
    );
  }

  if (loading) {
    return <SkeletonLoader lines={6} />;
  }

  const maxRows = Math.max(book.bids.length, book.asks.length, 5);

  return (
    <div className="orderbook">
      <div>
        <div className="orderbook-side__title orderbook-side__title--bid">Bids</div>
        {book.bids.length === 0 ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No bids</div>
        ) : (
          book.bids.slice(0, maxRows).map((row, i) => (
            <div key={`bid-${i}`} className="orderbook-row orderbook-row--bid">
              <span>{formatNumber(row.price)}</span>
              <span className="orderbook-row__qty">{formatNumber(row.quantity, 0)}</span>
            </div>
          ))
        )}
      </div>
      <div>
        <div className="orderbook-side__title orderbook-side__title--ask">Asks</div>
        {book.asks.length === 0 ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No asks</div>
        ) : (
          book.asks.slice(0, maxRows).map((row, i) => (
            <div key={`ask-${i}`} className="orderbook-row orderbook-row--ask">
              <span>{formatNumber(row.price)}</span>
              <span className="orderbook-row__qty">{formatNumber(row.quantity, 0)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
