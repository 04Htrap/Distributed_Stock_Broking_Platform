import { useState, useEffect } from 'react';
import { placeOrder } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import { normalizeError } from '../../utils/errors';
import { formatCurrency, formatNumber } from '../../utils/format';
import toast from 'react-hot-toast';

export default function OrderForm({ onOrderPlaced }) {
  const { selectedSymbol, userId } = useAuth();
  const [side, setSide] = useState('BUY');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrice('');
    setQuantity('');
  }, [selectedSymbol]);

  const priceNum = Number(price);
  const qtyNum = Number(quantity);
  const isValid = selectedSymbol && priceNum > 0 && qtyNum > 0;
  const estimatedValue = isValid ? priceNum * qtyNum : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setLoading(true);
    try {
      await placeOrder({
        userId,
        symbol: selectedSymbol,
        side,
        type: 'LIMIT',
        price: priceNum,
        quantity: qtyNum,
      });
      toast.success(`${side} order placed for ${selectedSymbol}`);
      setPrice('');
      setQuantity('');
      onOrderPlaced?.();
    } catch (err) {
      toast.error(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card__label" style={{ marginBottom: '0.75rem' }}>
        Place Order — {selectedSymbol || 'No symbol'}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="toggle-group">
          <button
            type="button"
            className={`toggle-btn toggle-btn--buy${side === 'BUY' ? ' active' : ''}`}
            onClick={() => setSide('BUY')}
          >
            BUY
          </button>
          <button
            type="button"
            className={`toggle-btn toggle-btn--sell${side === 'SELL' ? ' active' : ''}`}
            onClick={() => setSide('SELL')}
          >
            SELL
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Order Type</label>
          <input type="text" value="LIMIT" disabled />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="order-symbol">
            Symbol
          </label>
          <input id="order-symbol" type="text" value={selectedSymbol || ''} disabled />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="order-price">
            Price
          </label>
          <input
            id="order-price"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={!selectedSymbol}
          />
          {price && priceNum <= 0 && (
            <div className="form-error">Price must be greater than 0</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="order-qty">
            Quantity
          </label>
          <input
            id="order-qty"
            type="number"
            min="1"
            step="1"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={!selectedSymbol}
          />
          {quantity && qtyNum <= 0 && (
            <div className="form-error">Quantity must be greater than 0</div>
          )}
        </div>

        <div className="form-hint" style={{ marginBottom: '1rem' }}>
          Est. value:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(estimatedValue)}
          </strong>
          {isValid && (
            <span>
              {' '}
              ({formatNumber(qtyNum, 0)} × {formatNumber(priceNum)})
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`btn btn--full${side === 'BUY' ? ' btn--buy' : ' btn--sell'}`}
          disabled={!isValid || loading || !selectedSymbol}
        >
          {loading ? 'Placing...' : `${side} ${selectedSymbol || ''}`}
        </button>
      </form>
    </div>
  );
}
