const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
  },
  { timestamps: true }
);

watchlistSchema.index({ userId: 1, stockId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
