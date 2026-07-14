const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');

// @desc   Get all users
// @route  GET /api/admin/users
// @access Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a user
// @route  DELETE /api/admin/users/:id
// @access Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete an admin account' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc   Suspend / activate a user
// @route  PUT /api/admin/users/:id/status
// @access Private/Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot change status of an admin account' });
    }
    user.status = user.status === 'active' ? 'suspended' : 'active';
    await user.save();
    res.json({ message: `User ${user.status}`, status: user.status });
  } catch (error) {
    next(error);
  }
};

// @desc   Get admin analytics
// @route  GET /api/admin/analytics
// @access Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTrades = await Transaction.countDocuments();
    const totalStocks = await Stock.countDocuments();

    const mostTraded = await Transaction.aggregate([
      { $group: { _id: '$symbol', count: { $sum: 1 }, companyName: { $first: '$companyName' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5);

    const tradesByDay = await Transaction.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      totalUsers,
      totalTrades,
      totalStocks,
      mostTraded,
      recentUsers,
      tradesByDay,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, deleteUser, updateUserStatus, getAnalytics };
