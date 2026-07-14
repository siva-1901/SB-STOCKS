const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc   Get user's watchlist
// @route  GET /api/watchlist
// @access Private
const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ userId: req.user._id }).populate('stockId');
    res.json(items.filter((i) => i.stockId));
  } catch (error) {
    next(error);
  }
};

// @desc   Add stock to watchlist
// @route  POST /api/watchlist
// @access Private
const addToWatchlist = async (req, res, next) => {
  try {
    const { stockId } = req.body;
    if (!stockId) {
      return res.status(400).json({ message: 'Stock ID is required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const exists = await Watchlist.findOne({ userId: req.user._id, stockId });
    if (exists) {
      return res.status(400).json({ message: 'Stock already in watchlist' });
    }

    const item = await Watchlist.create({ userId: req.user._id, stockId });
    const populated = await item.populate('stockId');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc   Remove stock from watchlist
// @route  DELETE /api/watchlist/:id
// @access Private
const removeFromWatchlist = async (req, res, next) => {
  try {
    const item = await Watchlist.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Watchlist item not found' });
    }
    await item.deleteOne();
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
