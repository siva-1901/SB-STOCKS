const Stock = require('../models/Stock');

// @desc   Get all stocks (with search, sort, filter, pagination)
// @route  GET /api/stocks
// @access Public
const getStocks = async (req, res, next) => {
  try {
    const { search, sector, sortBy = 'companyName', order = 'asc', page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } },
      ];
    }
    if (sector && sector !== 'all') {
      query.sector = sector;
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortField = ['companyName', 'price', 'marketCap', 'volume', 'symbol'].includes(sortBy)
      ? sortBy
      : 'companyName';

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.min(Math.max(parseInt(limit), 1), 100);

    const total = await Stock.countDocuments(query);
    const stocks = await Stock.find(query)
      .sort({ [sortField]: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      stocks,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single stock
// @route  GET /api/stocks/:id
// @access Public
const getStockById = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.json(stock);
  } catch (error) {
    next(error);
  }
};

// @desc   Get top gainers and losers
// @route  GET /api/stocks/movers/top
// @access Public
const getTopMovers = async (req, res, next) => {
  try {
    const stocks = await Stock.find();
    const withChange = stocks.map((s) => ({
      _id: s._id,
      companyName: s.companyName,
      symbol: s.symbol,
      price: s.price,
      changePercent: s.changePercent,
    }));
    const gainers = [...withChange].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const losers = [...withChange].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    res.json({ gainers, losers });
  } catch (error) {
    next(error);
  }
};

// @desc   Create a stock
// @route  POST /api/stocks
// @access Private/Admin
const createStock = async (req, res, next) => {
  try {
    const { companyName, symbol, price, marketCap, volume, sector, logo } = req.body;

    if (!companyName || !symbol || price === undefined) {
      return res.status(400).json({ message: 'Company name, symbol and price are required' });
    }

    const exists = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: 'A stock with this symbol already exists' });
    }

    const stock = await Stock.create({
      companyName,
      symbol: symbol.toUpperCase(),
      price,
      previousClose: price,
      marketCap: marketCap || 0,
      volume: volume || 0,
      sector: sector || 'General',
      logo: logo || '',
    });

    res.status(201).json(stock);
  } catch (error) {
    next(error);
  }
};

// @desc   Update a stock
// @route  PUT /api/stocks/:id
// @access Private/Admin
const updateStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const { companyName, symbol, price, marketCap, volume, sector, logo } = req.body;

    if (price !== undefined && price !== stock.price) {
      stock.previousClose = stock.price;
      stock.price = price;
    }
    if (companyName) stock.companyName = companyName;
    if (symbol) stock.symbol = symbol.toUpperCase();
    if (marketCap !== undefined) stock.marketCap = marketCap;
    if (volume !== undefined) stock.volume = volume;
    if (sector) stock.sector = sector;
    if (logo !== undefined) stock.logo = logo;

    const updated = await stock.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a stock
// @route  DELETE /api/stocks/:id
// @access Private/Admin
const deleteStock = async (req, res, next) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    await stock.deleteOne();
    res.json({ message: 'Stock removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStocks,
  getStockById,
  getTopMovers,
  createStock,
  updateStock,
  deleteStock,
};
