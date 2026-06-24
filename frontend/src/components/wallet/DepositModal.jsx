import { useState } from 'react';
import { deposit } from '../../services/walletService';
import { normalizeError } from '../../utils/errors';
import toast from 'react-hot-toast';

export default function DepositModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(amount);

    if (!value || value <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await deposit(value);
      toast.success('Deposit successful');
      onSuccess();
    } catch (err) {
      toast.error(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="modal__title">Deposit Funds</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="deposit-amount">
              Amount (INR)
            </label>
            <input
              id="deposit-amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal__actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Processing...' : 'Deposit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
