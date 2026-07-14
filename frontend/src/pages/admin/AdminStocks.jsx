import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Loader from '../../components/Loader';

const emptyForm = { companyName: '', symbol: '', price: '', marketCap: '', volume: '', sector: 'Technology', logo: '' };

const AdminStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stocks', { params: { search, limit: 100 } });
      setStocks(data.stocks);
    } catch (err) {
      toast.error('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (stock) => {
    setForm({
      companyName: stock.companyName,
      symbol: stock.symbol,
      price: stock.price,
      marketCap: stock.marketCap,
      volume: stock.volume,
      sector: stock.sector,
      logo: stock.logo || '',
    });
    setEditingId(stock._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        marketCap: Number(form.marketCap) || 0,
        volume: Number(form.volume) || 0,
      };
      if (editingId) {
        await api.put(`/stocks/${editingId}`, payload);
        toast.success('Stock updated successfully');
      } else {
        await api.post('/stocks', payload);
        toast.success('Stock created successfully');
      }
      setShowForm(false);
      fetchStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock?')) return;
    try {
      await api.delete(`/stocks/${id}`);
      toast.success('Stock deleted');
      fetchStocks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Stocks</h1>
          <p className="text-slate-500 text-sm mt-1">Create, edit, or remove stocks listed on the platform.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Stock</button>
      </div>

      <input
        type="text"
        placeholder="Search stocks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field max-w-sm"
      />

      <div className="glass-card p-5 overflow-x-auto">
        {loading ? (
          <Loader size="lg" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-200 dark:border-white/10">
                <th className="py-2 font-medium">Company</th>
                <th className="py-2 font-medium">Symbol</th>
                <th className="py-2 font-medium">Price</th>
                <th className="py-2 font-medium">Sector</th>
                <th className="py-2 font-medium">Market Cap</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((s) => (
                <tr key={s._id} className="border-b border-slate-100 dark:border-white/5">
                  <td className="py-3">{s.companyName}</td>
                  <td className="py-3 font-medium">{s.symbol}</td>
                  <td className="py-3">${s.price.toFixed(2)}</td>
                  <td className="py-3">{s.sector}</td>
                  <td className="py-3">${Number(s.marketCap).toLocaleString()}</td>
                  <td className="py-3 flex gap-2">
                    <button onClick={() => openEdit(s)} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
                    <button onClick={() => handleDelete(s._id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-dark-800 w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{editingId ? 'Edit Stock' : 'Add Stock'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="companyName" placeholder="Company Name" required value={form.companyName} onChange={handleChange} className="input-field" />
              <input name="symbol" placeholder="Ticker Symbol" required value={form.symbol} onChange={handleChange} className="input-field" disabled={!!editingId} />
              <input name="price" type="number" step="0.01" placeholder="Price" required value={form.price} onChange={handleChange} className="input-field" />
              <input name="marketCap" type="number" placeholder="Market Cap" value={form.marketCap} onChange={handleChange} className="input-field" />
              <input name="volume" type="number" placeholder="Volume" value={form.volume} onChange={handleChange} className="input-field" />
              <select name="sector" value={form.sector} onChange={handleChange} className="input-field">
                <option>Technology</option>
                <option>Financials</option>
                <option>Healthcare</option>
                <option>Consumer Discretionary</option>
                <option>Consumer Staples</option>
                <option>Communication Services</option>
                <option>General</option>
              </select>
              <input name="logo" placeholder="Logo URL (optional)" value={form.logo} onChange={handleChange} className="input-field" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStocks;
