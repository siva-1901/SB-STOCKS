import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const StatCard = ({ label, value }) => (
  <div className="glass-card p-5">
    <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/admin/analytics');
        setData(data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader size="lg" />;

  const chartData = {
    labels: data.mostTraded.map((s) => s._id),
    datasets: [
      {
        label: 'Trade Count',
        data: data.mostTraded.map((s) => s.count),
        backgroundColor: '#1fb56a',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide statistics and system health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={data.totalUsers} />
        <StatCard label="Total Trades" value={data.totalTrades} />
        <StatCard label="Total Stocks Listed" value={data.totalStocks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">Most Traded Stocks</h2>
          {data.mostTraded.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : (
            <p className="text-center text-slate-400 py-16">No trade data yet.</p>
          )}
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold mb-4">Recent Users</h2>
          {data.recentUsers.length === 0 ? (
            <p className="text-center text-slate-400 py-16">No users yet.</p>
          ) : (
            <div className="space-y-3">
              {data.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-slate-400 text-xs">{u.email}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
