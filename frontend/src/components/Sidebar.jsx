import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/stocks', label: 'Stocks', icon: '📈' },
  { to: '/portfolio', label: 'Portfolio', icon: '💼' },
  { to: '/watchlist', label: 'Watchlist', icon: '⭐' },
  { to: '/transactions', label: 'Transactions', icon: '🧾' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const adminLinks = [
  { to: '/admin', label: 'Admin Dashboard', icon: '🛠️', end: true },
  { to: '/admin/stocks', label: 'Manage Stocks', icon: '🏷️' },
  { to: '/admin/users', label: 'Manage Users', icon: '👥' },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      <aside
        className={`fixed md:sticky top-0 md:top-[65px] h-screen md:h-[calc(100vh-65px)] w-64 z-50 md:z-10 bg-white dark:bg-dark-800 border-r border-slate-200 dark:border-white/10 p-4 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                }`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <>
              <div className="mt-4 mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Admin
              </div>
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`
                  }
                >
                  <span>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
