import React from 'react';

const StockCard = ({ stock, onBuy, onWatchlist, inWatchlist }) => {
  const change = stock.changePercent || 0;
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-4 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center font-bold text-primary-700 dark:text-primary-300 text-sm overflow-hidden">
            {stock.logo ? (
              <img src={stock.logo} alt={stock.symbol} className="h-full w-full object-cover" />
            ) : (
              stock.symbol?.slice(0, 2)
            )}
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{stock.symbol}</p>
            <p className="text-xs text-slate-500 truncate max-w-[120px]">{stock.companyName}</p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
          }`}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">${stock.price?.toFixed(2)}</p>
        <p className="text-xs text-slate-400">Vol {Number(stock.volume).toLocaleString()}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onBuy(stock)} className="btn-primary flex-1 text-sm py-2">
          Buy
        </button>
        <button
          onClick={() => onWatchlist(stock)}
          className={`text-sm py-2 px-3 rounded-xl border transition-colors ${
            inWatchlist
              ? 'bg-yellow-400 border-yellow-400 text-white'
              : 'border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
          }`}
          title={inWatchlist ? 'In watchlist' : 'Add to watchlist'}
        >
          ★
        </button>
      </div>
    </div>
  );
};

export default StockCard;
