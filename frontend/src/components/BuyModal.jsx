import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BuyModal = ({ stock, onClose, onSuccess }) => {
  const { user, updateUser } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalCost = useMemo(() => (stock.price * Number(quantity || 0)).toFixed(2), [stock.price, quantity]);
  const remainingBalance = useMemo(() => (user.balance - totalCost).toFixed(2), [user.balance, totalCost]);
  const insufficient = Number(remainingBalance) < 0;

  const handleConfirm = async () => {
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    if (insufficient) {
      toast.error('Insufficient balance for this purchase');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/trade/buy', { stockId: stock._id, quantity: Number(quantity) });
      updateUser({ balance: data.balance });
      toast.success(`Bought ${quantity} share(s) of ${stock.symbol}`);
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass-card bg-white dark:bg-dark-800 w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Buy {stock.symbol}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl">×</button>
        </div>

        <p className="text-sm text-slate-500 mb-4">{stock.companyName}</p>

        <label className="text-sm font-medium mb-1 block">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field mb-4"
        />

        <div className="space-y-2 text-sm bg-slate-50 dark:bg-white/5 rounded-xl p-4 mb-4">
          <div className="flex justify-between">
            <span className="text-slate-500">Current Price</span>
            <span className="font-medium">${stock.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Cost</span>
            <span className="font-medium">${totalCost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Available Balance</span>
            <span className="font-medium">${user.balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2">
            <span className="text-slate-500">Remaining Balance</span>
            <span className={`font-semibold ${insufficient ? 'text-red-500' : 'text-emerald-600'}`}>
              ${remainingBalance}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleConfirm} disabled={loading || insufficient} className="btn-primary flex-1">
            {loading ? 'Processing...' : 'Confirm Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
