import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import BuyModal from '../components/BuyModal';
import Loader from '../components/Loader';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/watchlist');
      setItems(data);
    } catch (err) {
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/watchlist/${id}`);
      toast.success('Removed from watchlist');
      fetchWatchlist();
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Watchlist</h1>
        <p className="text-slate-500 text-sm mt-1">Stocks you're keeping an eye on.</p>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center text-slate-400">
          Your watchlist is empty. Add stocks from the Stocks page.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => {
            const stock = item.stockId;
            const change = stock.changePercent || 0;
            const isPositive = change >= 0;
            return (
              <div key={item._id} className="glass-card p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{stock.symbol}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[140px]">{stock.companyName}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </span>
                </div>
                <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedStock(stock)} className="btn-primary flex-1 text-sm py-2">Buy</button>
                  <button onClick={() => handleRemove(item._id)} className="btn-secondary text-sm py-2 px-3">Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedStock && (
        <BuyModal stock={selectedStock} onClose={() => setSelectedStock(null)} onSuccess={fetchWatchlist} />
      )}
    </div>
  );
};

export default Watchlist;
