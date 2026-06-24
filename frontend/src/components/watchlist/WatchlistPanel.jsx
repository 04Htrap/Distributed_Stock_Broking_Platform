import { useState, useEffect, useCallback } from 'react';
import { getWatchlist } from '../../services/watchlistService';
import { getMarketWatchlist } from '../../services/marketService';
import { useAuth } from '../../context/AuthContext';
import { usePolling } from '../../hooks/usePolling';
import { normalizeError } from '../../utils/errors';
import { formatNumber } from '../../utils/format';
import SkeletonLoader from '../ui/SkeletonLoader';
import EmptyState from '../ui/EmptyState';
import StockSearch from '../market/StockSearch';

export default function WatchlistPanel() {
  const { selectedSymbol, selectSymbol } = useAuth();
  const [symbols, setSymbols] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      const rows = await getWatchlist();
      const syms = rows.map((r) => r.symbol);
      setSymbols(syms);

      if (syms.length === 0) {
        setQuotes({});
        return;
      }

      const quoteData = await getMarketWatchlist(syms);
      const map = {};
      quoteData.forEach((q) => {
        map[q.symbol] = q;
      });
      setQuotes(map);
      setError(null);
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  useEffect(() => {
    if (!selectedSymbol && symbols.length > 0) {
      selectSymbol(symbols[0]);
    }
  }, [selectedSymbol, symbols, selectSymbol]);

  usePolling(fetchWatchlist, 10000, true);

  const handleSymbolAdded = (symbol) => {
    selectSymbol(symbol);
    setSymbols((current) => (
      current.includes(symbol) ? current : [...current, symbol]
    ));
    fetchWatchlist();
  };

  if (loading) {
    return (
      <div className="dashboard-panel">
        <div className="dashboard-panel__header">
          <h2 className="dashboard-panel__title">Watchlist</h2>
        </div>
        <div className="dashboard-panel__body">
          <SkeletonLoader lines={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__header">
        <h2 className="dashboard-panel__title">Watchlist</h2>
      </div>
      <div className="dashboard-panel__body">
        <StockSearch onSelect={handleSymbolAdded} />

        {error && (
          <p className="form-error" style={{ marginBottom: '0.75rem' }}>
            {error}
          </p>
        )}

        {symbols.length === 0 ? (
          <EmptyState
            icon="👁"
            title="No symbols yet"
            description="Search and add stocks to your watchlist"
          />
        ) : (
          symbols.map((sym) => {
            const quote = quotes[sym];
            const change = quote ? quote.close - quote.open : 0;
            const changeClass = change >= 0 ? 'watchlist-item__change--up' : 'watchlist-item__change--down';

            return (
              <div
                key={sym}
                className={`watchlist-item${selectedSymbol === sym ? ' watchlist-item--active' : ''}`}
                onClick={() => selectSymbol(sym)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && selectSymbol(sym)}
              >
                <div>
                  <div className="watchlist-item__symbol">{sym}</div>
                  {quote && (
                    <div className={`watchlist-item__price ${changeClass}`} style={{ fontSize: '0.75rem' }}>
                      {change >= 0 ? '+' : ''}
                      {formatNumber(change)}
                    </div>
                  )}
                </div>
                {quote && (
                  <div className="watchlist-item__price">{formatNumber(quote.price)}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
