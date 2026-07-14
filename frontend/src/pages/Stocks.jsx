import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import StockCard from '../components/StockCard';
import BuyModal from '../components/BuyModal';
import Loader from '../components/Loader';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');
  const [sortBy, setSortBy] = useState('companyName');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlistIds, setWatchlistIds] = useState(new Set());

  const fetchStocks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stocks', {
        params: { search, sector, sortBy, order, page, limit: 12 },
      });
      setStocks(data.stocks);
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  }, [search, sector, sortBy, order, page]);

  const fetchWatchlist = async () => {
    try {
      const { data } = await api.get('/watchlist');
      setWatchlistIds(new Set(data.map((w) => w.stockId._id)));
    } catch (err) {
      // silently ignore
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleWatchlist = async (stock) => {
    try {
      if (watchlistIds.has(stock._id)) {
        const { data } = await api.get('/watchlist');
        const item = data.find((w) => w.stockId._id === stock._id);
        if (item) {
          await api.delete(`/watchlist/${item._id}`);
          toast.info(`Removed ${stock.symbol} from watchlist`);
        }
      } else {
        await api.post('/watchlist', { stockId: stock._id });
        toast.success(`Added ${stock.symbol} to watchlist`);
      }
      fetchWatchlist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Watchlist action failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Stock Market</h1>
        <p className="text-slate-500 text-sm mt-1">Browse, search and trade from a live-simulated market.</p>
      </div>

      <div className="glass-card p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="text"
          placeholder="Search by company or symbol..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-field md:flex-1"
        />
        <select value={sector} onChange={(e) => { setSector(e.target.value); setPage(1); }} className="input-field md:w-48">
          <option value="all">All Sectors</option>
          <option value="Technology">Technology</option>
          <option value="Financials">Financials</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Consumer Discretionary">Consumer Discretionary</option>
          <option value="Consumer Staples">Consumer Staples</option>
          <option value="Communication Services">Communication Services</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field md:w-48">
          <option value="companyName">Sort: Company Name</option>
          <option value="price">Sort: Price</option>
          <option value="marketCap">Sort: Market Cap</option>
          <option value="volume">Sort: Volume</option>
        </select>
        <button
          onClick={() => setOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
          className="btn-secondary md:w-auto"
        >
          {order === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      </div>

      {loading ? (
        <Loader size="lg" />
      ) : stocks.length === 0 ? (
        <p className="text-center text-slate-400 py-16">No stocks match your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stocks.map((stock) => (
              <StockCard
                key={stock._id}
                stock={stock}
                onBuy={setSelectedStock}
                onWatchlist={handleWatchlist}
                inWatchlist={watchlistIds.has(stock._id)}
              />
            ))}
          </div>

          <div className="flex justify-center items-center gap-3 pt-4">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {pages || 1}</span>
            <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">
              Next
            </button>
          </div>
        </>
      )}

      {selectedStock && (
        <BuyModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={fetchStocks}
        />
      )}
    </div>
  );
};

export default Stocks;
