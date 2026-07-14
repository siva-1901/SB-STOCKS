const mongoose = require('mongoose');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');

// @desc   Buy a stock
// @route  POST /api/trade/buy
// @access Private
const buyStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || !qty || qty <= 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ message: 'Please provide a valid stock and quantity' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const user = await User.findById(req.user._id);
    const totalCost = stock.price * qty;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: 'Insufficient balance to complete this purchase' });
    }

    // Update balance
    user.balance -= totalCost;
    await user.save();

    // Update or create portfolio entry
    let holding = await Portfolio.findOne({ userId: user._id, stockId: stock._id });
    if (holding) {
      const newQuantity = holding.quantity + qty;
      const newAveragePrice = (holding.averagePrice * holding.quantity + totalCost) / newQuantity;
      holding.quantity = newQuantity;
      holding.averagePrice = newAveragePrice;
      await holding.save();
    } else {
      holding = await Portfolio.create({
        userId: user._id,
        stockId: stock._id,
        quantity: qty,
        averagePrice: stock.price,
      });
    }

    // Record transaction
    const transaction = await Transaction.create({
      userId: user._id,
      stockId: stock._id,
      symbol: stock.symbol,
      companyName: stock.companyName,
      buySell: 'BUY',
      quantity: qty,
      price: stock.price,
      totalAmount: totalCost,
      profitLoss: 0,
    });

    res.status(201).json({
      message: 'Stock purchased successfully',
      balance: user.balance,
      holding,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Sell a stock
// @route  POST /api/trade/sell
// @access Private
const sellStock = async (req, res, next) => {
  try {
    const { stockId, quantity } = req.body;
    const qty = Number(quantity);

    if (!stockId || !qty || qty <= 0 || !Number.isInteger(qty)) {
      return res.status(400).json({ message: 'Please provide a valid stock and quantity' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const holding = await Portfolio.findOne({ userId: req.user._id, stockId: stock._id });
    if (!holding || holding.quantity < qty) {
      return res.status(400).json({ message: 'You do not own enough shares to sell' });
    }

    const user = await User.findById(req.user._id);
    const saleAmount = stock.price * qty;
    const costBasis = holding.averagePrice * qty;
    const profitLoss = saleAmount - costBasis;

    // Update balance
    user.balance += saleAmount;
    await user.save();

    // Update portfolio
    holding.quantity -= qty;
    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    // Record transaction
    const transaction = await Transaction.create({
      userId: user._id,
      stockId: stock._id,
      symbol: stock.symbol,
      companyName: stock.companyName,
      buySell: 'SELL',
      quantity: qty,
      price: stock.price,
      totalAmount: saleAmount,
      profitLoss,
    });

    res.status(201).json({
      message: 'Stock sold successfully',
      balance: user.balance,
      transaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { buyStock, sellStock };
