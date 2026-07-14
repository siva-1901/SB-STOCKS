import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Loader from '../components/Loader';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (type !== 'all') params.type = type;
      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const exportCSV = () => {
    if (transactions.length === 0) {
      toast.info('No transactions to export');
      return;
    }
    const headers = ['Date', 'Company', 'Symbol', 'Type', 'Quantity', 'Price', 'Total Amount', 'Profit/Loss'];
    const rows = transactions.map((t) => [
      new Date(t.date).toLocaleString(),
      t.companyName,
      t.symbol,
      t.buySell,
      t.quantity,
      t.price.toFixed(2),
      t.totalAmount.toFixed(2),
      t.profitLoss.toFixed(2),
    ]);
    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sb-stocks-transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <p className="text-slate-500 text-sm mt-1">All your buy and sell activity.</p>
        </div>
        <div className="flex gap-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="all">All Transactions</option>
            <option value="BUY">Buy Only</option>
            <option value="SELL">Sell Only</option>
          </select>
          <button onClick={exportCSV} className="btn-secondary whitespace-nowrap">Export CSV</button>
        </div>
      </div>

      <div className="glass-card p-5 overflow-x-auto">
        {loading ? (
          <Loader size="lg" />
        ) : transactions.length === 0 ? (
          <p className="text-center text-slate-400 py-16">No transactions found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200 dark:border-white/10">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">Total</th>
                <th className="py-2 font-medium">P/L</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-slate-100 dark:border-white/5">
                  <td className="py-3 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-3">{t.companyName} <span className="text-slate-400">({t.symbol})</span></td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.buySell === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {t.buySell}
                    </span>
                  </td>
                  <td className="py-3">{t.quantity}</td>
                  <td className="py-3">${t.price.toFixed(2)}</td>
                  <td className="py-3">${t.totalAmount.toFixed(2)}</td>
                  <td className={`py-3 font-medium ${t.profitLoss > 0 ? 'text-emerald-500' : t.profitLoss < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {t.buySell === 'SELL' ? `${t.profitLoss >= 0 ? '+' : ''}$${t.profitLoss.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
