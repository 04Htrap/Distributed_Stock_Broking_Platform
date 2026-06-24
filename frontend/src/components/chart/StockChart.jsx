import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { getQuote, getChart } from '../../services/marketService';
import { useAuth } from '../../context/AuthContext';
import { normalizeError } from '../../utils/errors';
import { formatNumber, formatChartTime } from '../../utils/format';
import SkeletonLoader from '../ui/SkeletonLoader';
import EmptyState from '../ui/EmptyState';

const RANGES = ['1D', '1W', '1M', '1Y'];

export default function StockChart() {
  const { selectedSymbol } = useAuth();
  const [range, setRange] = useState('1D');
  const [quote, setQuote] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!selectedSymbol) return;

    setLoading(true);
    setError(null);

    try {
      const [quoteRes, chartRes] = await Promise.all([
        getQuote(selectedSymbol),
        getChart(selectedSymbol, range),
      ]);
      setQuote(quoteRes);
      setChartData(
        chartRes.map((c) => ({
          ...c,
          label: formatChartTime(c.time, range),
        }))
      );
    } catch (err) {
      setError(normalizeError(err));
      setQuote(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedSymbol, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!selectedSymbol) {
    return (
      <div className="dashboard-center">
        <EmptyState
          icon="📈"
          title="Select a symbol"
          description="Choose a stock from your watchlist to view the chart"
        />
      </div>
    );
  }

  const change = quote ? quote.close - quote.open : 0;
  const changePct = quote && quote.open ? ((change / quote.open) * 100).toFixed(2) : 0;
  const isUp = change >= 0;

  return (
    <div className="dashboard-center">
      <div className="chart-header">
        <div>
          <h2 className="chart-header__symbol">{selectedSymbol}</h2>
          {quote && (
            <>
              <div
                className="chart-header__price"
                style={{ color: isUp ? 'var(--green)' : 'var(--red)' }}
              >
                {formatNumber(quote.price)}
                <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>
                  {isUp ? '+' : ''}
                  {changePct}%
                </span>
              </div>
              <div className="chart-header__stats" style={{ marginTop: '0.75rem' }}>
                <div className="chart-stat">
                  <span className="chart-stat__label">Open</span>
                  <span className="chart-stat__value">{formatNumber(quote.open)}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat__label">High</span>
                  <span className="chart-stat__value">{formatNumber(quote.high)}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat__label">Low</span>
                  <span className="chart-stat__value">{formatNumber(quote.low)}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat__label">Volume</span>
                  <span className="chart-stat__value">
                    {quote.volume?.toLocaleString('en-IN') ?? '—'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="range-selector">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              className={`range-btn${range === r ? ' active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-container">
        {loading ? (
          <SkeletonLoader lines={8} />
        ) : error ? (
          <EmptyState icon="⚠️" title="Failed to load chart" description={error} />
        ) : chartData.length === 0 ? (
          <EmptyState icon="📊" title="No chart data" description="Try a different time range" />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? '#26a69a' : '#ef5350'} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isUp ? '#26a69a' : '#ef5350'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2e39" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#787b86', fontSize: 11 }}
                axisLine={{ stroke: '#2a2e39' }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#787b86', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={60}
                tickFormatter={(v) => formatNumber(v, 0)}
              />
              <Tooltip
                contentStyle={{
                  background: '#1e222d',
                  border: '1px solid #2a2e39',
                  borderRadius: 6,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#787b86' }}
                formatter={(value) => [formatNumber(value), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="close"
                stroke={isUp ? '#26a69a' : '#ef5350'}
                strokeWidth={2}
                fill="url(#chartGradient)"
                dot={false}
                activeDot={{ r: 4, fill: isUp ? '#26a69a' : '#ef5350' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
