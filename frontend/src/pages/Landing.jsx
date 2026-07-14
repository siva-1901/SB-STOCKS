import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '💰', title: 'Virtual Balance', desc: 'Start with $100,000 in virtual cash and trade risk-free.' },
  { icon: '📈', title: 'Real Market Feel', desc: 'Live-simulated prices across dozens of well-known US stocks.' },
  { icon: '💼', title: 'Portfolio Tracking', desc: 'Track your holdings, average price, and profit & loss in real time.' },
  { icon: '⭐', title: 'Watchlists', desc: 'Keep an eye on the stocks that matter most to you.' },
  { icon: '🧾', title: 'Transaction History', desc: 'Full history of every trade with exportable records.' },
  { icon: '📊', title: 'Analytics & Charts', desc: 'Visualize your performance with beautiful, animated charts.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white font-bold text-xl">S</div>
          <span className="font-bold text-xl tracking-tight">SB Stocks</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center px-6 pt-16 pb-20">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
          Learn to trade. Zero risk.
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Master the market with <span className="text-primary-500">virtual money</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          SB Stocks is a paper trading simulator where you can practice buying and selling real US stocks
          without ever risking a dollar. Build confidence before you invest for real.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">Start Trading Free</Link>
          <Link to="/login" className="btn-secondary px-8 py-3 text-base">I have an account</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-sm text-slate-400 py-8 border-t border-slate-200 dark:border-white/10">
        © {new Date().getFullYear()} SB Stocks. Paper trading simulator for educational purposes only.
      </footer>
    </div>
  );
};

export default Landing;
