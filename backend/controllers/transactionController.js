const Transaction = require('../models/Transaction');

// @desc   Get logged-in user's transactions
// @route  GET /api/transactions
// @access Private
const getTransactions = async (req, res, next) => {
  try {
    const { type, from, to } = req.query;
    const query = { userId: req.user._id };

    if (type && ['BUY', 'SELL'].includes(type.toUpperCase())) {
      query.buySell = type.toUpperCase();
    }
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lte = new Date(to);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTransactions };
