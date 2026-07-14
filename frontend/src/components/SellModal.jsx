import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SellModal = ({ holding, onClose, onSuccess }) => {
  const { updateUser } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentPrice = holding.currentPrice;
  const totalValue = useMemo(() => (currentPrice * Number(quantity || 0)).toFixed(2), [currentPrice, quantity]);
  const estimatedPL = useMemo(
    () => ((currentPrice - holding.averagePrice) * Number(quantity || 0)).toFixed(2),
    [currentPrice, holding.averagePrice, quantity]
  );
  const exceedsHolding = Number(quantity) > holding.quantity;

  const handleConfirm = async () => {
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (exceedsHolding) {
      toast.error('You cannot sell more shares than you own');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/trade/sell', { stockId: holding.stockId, quantity: Number(quantity) });
      updateUser({ balance: data.balance });
      toast.success(`Sold ${quantity} share(s) of ${holding.symbol}`);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-dark-800 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Sell {holding.symbol}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl">×</button>
        </div>

        <p className="text-sm text-slate-500 mb-4">You own {holding.quantity} shares</p>

        <label className="text-sm font-medium mb-1 block">Quantity to sell</label>
        <input
          type="number"
          min="1"
          max={holding.quantity}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field mb-4"
        />

        <div className="space-y-2 text-sm bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Current Price</span>
            <span className="font-medium">${currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Avg Buy Price</span>
            <span className="font-medium">${holding.averagePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Value</span>
            <span className="font-medium">${totalValue}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2">
            <span className="text-slate-500">Estimated P/L</span>
            <span className={`font-semibold ${Number(estimatedPL) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {Number(estimatedPL) >= 0 ? '+' : ''}${estimatedPL}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleConfirm} disabled={loading || exceedsHolding} className="btn-danger flex-1">
            {loading ? 'Processing...' : 'Confirm Sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellModal;
