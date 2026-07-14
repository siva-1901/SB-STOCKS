const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();

const connectDB = require('./config/db');
const Stock = require('./models/Stock');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize());
app.use(xss());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting on API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trade', tradeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'SB Stocks API is running' }));

app.use(notFound);
app.use(errorHandler);

// Simulate live market movement every 5 seconds (fallback "live" data engine).
// In production this can be replaced with calls to a real provider
// (Alpha Vantage, Finnhub, Twelve Data, Financial Modeling Prep, etc).
const simulateMarket = async () => {
  try {
    const stocks = await Stock.find();
    for (const stock of stocks) {
      const changePercent = (Math.random() - 0.5) * 0.02; // +/-1% max per tick
      const newPrice = Math.max(0.5, stock.price * (1 + changePercent));
      stock.previousClose = stock.price;
      stock.price = Number(newPrice.toFixed(2));
      stock.volume = Math.max(0, stock.volume + Math.floor((Math.random() - 0.4) * 10000));
      await stock.save();
    }
  } catch (err) {
    console.error('Market simulation error:', err.message);
  }
};
setInterval(simulateMarket, 15000);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`SB Stocks API running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server Error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});