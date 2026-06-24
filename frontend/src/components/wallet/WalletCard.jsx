import { useState, useEffect, useCallback } from 'react';
import { getWallet } from '../../services/walletService';
import { usePolling } from '../../hooks/usePolling';
import { formatCurrency } from '../../utils/format';
import { SkeletonCard } from '../ui/SkeletonLoader';
import DepositModal from './DepositModal';

export default function WalletCard({ onBalanceChange }) {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await getWallet();
      setWallet(data);
      onBalanceChange?.(data);
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false);
    }
  }, [onBalanceChange]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  usePolling(fetchWallet, 15000, !loading);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="card__label">Available Balance</div>
            <div className="card__value">
              {formatCurrency(wallet?.available_balance ?? 0)}
            </div>
            {wallet?.locked_balance > 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Locked: {formatCurrency(wallet.locked_balance)}
              </div>
            )}
          </div>
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setShowDeposit(true)}>
            Deposit
          </button>
        </div>
      </div>

      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onSuccess={() => {
            setShowDeposit(false);
            fetchWallet();
          }}
        />
      )}
    </>
  );
}
