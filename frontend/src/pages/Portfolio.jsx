import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import SellModal from '../components/SellModal';
import Loader from '../components/Loader';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedHolding, setSelectedHolding] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/portfolio');
      setData(data);
    } catch (err) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) return <Loader size="lg" />;

  const { holdings = [], summary = {} } = data || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <p className="text-slate-500 text-sm mt-1">Track your holdings and overall performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Total Portfolio Value</p>
          <p className="text-2xl font-bold">${(summary.totalPortfolioValue || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Total Investment</p>
          <p className="text-2xl font-bold">${(summary.totalInvestment || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">Overall Gain/Loss</p>
          <p className={`text-2xl font-bold ${(summary.overallGainLoss || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {(summary.overallGainLoss || 0) >= 0 ? '+' : ''}${(summary.overallGainLoss || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            <span className="text-sm ml-1">({(summary.overallGainLossPercent || 0).toFixed(2)}%)</span>
          </p>
        </div>
      </div>

      <div className="glass-card p-5 overflow-x-auto">
        {holdings.length === 0 ? (
          <p className="text-center text-slate-400 py-16">You don't own any stocks yet. Head to the Stocks page to start trading.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200 dark:border-white/10">
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Ticker</th>
                <th className="py-2 font-medium">Qty</th>
                <th className="py-2 font-medium">Avg Buy Price</th>
                <th className="py-2 font-medium">Current Price</th>
                <th className="py-2 font-medium">Current Value</th>
                <th className="py-2 font-medium">P/L</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h._id} className="border-b border-slate-100 dark:border-white/5">
                  <td className="py-3">{h.companyName}</td>
                  <td className="py-3 font-medium">{h.symbol}</td>
                  <td className="py-3">{h.quantity}</td>
                  <td className="py-3">${h.averagePrice.toFixed(2)}</td>
                  <td className="py-3">${h.currentPrice.toFixed(2)}</td>
                  <td className="py-3">${h.currentValue.toFixed(2)}</td>
                  <td className={`py-3 font-medium ${h.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {h.profitLoss >= 0 ? '+' : ''}${h.profitLoss.toFixed(2)} ({h.profitLossPercent.toFixed(2)}%)
                  </td>
                  <td className="py-3">
                    <button onClick={() => setSelectedHolding(h)} className="btn-danger text-xs py-1.5 px-3">
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedHolding && (
        <SellModal holding={selectedHolding} onClose={() => setSelectedHolding(null)} onSuccess={fetchPortfolio} />
      )}
    </div>
  );
};

export default Portfolio;
