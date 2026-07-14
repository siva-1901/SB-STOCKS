import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    profileImage: user.profileImage || '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email, profileImage: form.profileImage };
      if (form.password) payload.password = form.password;

      const { data } = await api.put('/auth/profile', payload);
      updateUser(data);
      toast.success('Profile updated successfully');
      setForm({ ...form, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Update your account information.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={form.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1fb56a&color=fff`}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-slate-500">{user.role === 'admin' ? 'Administrator' : 'Trader'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Profile Image URL</label>
            <input type="text" name="profileImage" value={form.profileImage} onChange={handleChange} className="input-field" placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">New Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input-field" placeholder="Leave blank to keep current" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="glass-card p-6">
        <h2 className="font-semibold mb-3">Account Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-400">Virtual Balance</p>
            <p className="font-semibold text-lg">${user.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p className="text-slate-400">Account Role</p>
            <p className="font-semibold text-lg capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
