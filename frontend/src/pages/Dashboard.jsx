import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const StatCard = ({ label, value, sub, accent }) => (
  <div className="glass-card p-5">
    <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">{label}</p>
    <p className={`text-2xl font-bold ${accent || ''}`}>{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState(null);
  const [movers, setMovers] = useState({ gainers: [], losers: [] });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [portfolioRes, moversRes, txRes] = await Promise.all([
          api.get('/portfolio'),
          api.get('/stocks/movers/top'),
          api.get('/transactions'),
        ]);
        setPortfolio(portfolioRes.data);
        setMovers(moversRes.data);
        setTransactions(txRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader fullScreen={false} size="lg" />;

  const summary = portfolio?.summary || { totalPortfolioValue: 0, overallGainLoss: 0, overallGainLossPercent: 0 };
  const todaysPL = portfolio?.holdings?.reduce((sum, h) => {
    return sum; // simplified: real-time day P/L approximated via overall gain/loss
  }, 0);

  const chartData = {
    labels: portfolio?.holdings?.map((h) => h.symbol) || [],
    datasets: [
      {
        label: 'Current Value',
        data: portfolio?.holdings?.map((h) => h.currentValue) || [],
        borderColor: '#1fb56a',
        backgroundColor: 'rgba(31, 181, 106, 0.15)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Balance" value={`$${user.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard label="Portfolio Value" value={`$${summary.totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
        <StatCard
          label="Overall Profit/Loss"
          value={`${summary.overallGainLoss >= 0 ? '+' : ''}$${summary.overallGainLoss.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          sub={`${summary.overallGainLossPercent.toFixed(2)}%`}
          accent={summary.overallGainLoss >= 0 ? 'text-emerald-500' : 'text-red-500'}
        />
        <StatCard label="Total Holdings" value={portfolio?.holdings?.length || 0} sub="stocks in portfolio" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 lg:col-span-2">
          <h2 className="font-semibold mb-4">Portfolio Allocation</h2>
          {portfolio?.holdings?.length > 0 ? (
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : (
            <div className="text-center py-16 text-slate-400 text-sm">
              No holdings yet. <Link to="/stocks" className="text-primary-600 font-medium">Start trading</Link>
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">Market Overview</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-emerald-500 mb-2">Top Gainers</p>
              {movers.gainers.map((s) => (
                <div key={s._id} className="flex justify-between text-sm py-1">
                  <span>{s.symbol}</span>
                  <span className="text-emerald-500 font-medium">+{s.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-2">Top Losers</p>
              {movers.losers.map((s) => (
                <div key={s._id} className="flex justify-between text-sm py-1">
                  <span>{s.symbol}</span>
                  <span className="text-red-500 font-medium">{s.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Transactions</h2>
          <Link to="/transactions" className="text-sm text-primary-600 font-medium">View all</Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-200 dark:border-white/10">
                  <th className="py-2 font-medium">Company</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Qty</th>
                  <th className="py-2 font-medium">Price</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b border-slate-100 dark:border-white/5">
                    <td className="py-2">{t.companyName} <span className="text-slate-400">({t.symbol})</span></td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${t.buySell === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {t.buySell}
                      </span>
                    </td>
                    <td className="py-2">{t.quantity}</td>
                    <td className="py-2">${t.price.toFixed(2)}</td>
                    <td className="py-2">${t.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
