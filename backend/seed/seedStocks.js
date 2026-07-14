// Seed script: populates the database with an admin user and a starter set of
// well-known US stocks so the app is usable immediately after setup.
// Run with: npm run seed
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Stock = require('../models/Stock');
const User = require('../models/User');

dotenv.config();

const stocks = [
  { companyName: 'Apple Inc.', symbol: 'AAPL', price: 195.5, marketCap: 3020000000000, volume: 54000000, sector: 'Technology' },
  { companyName: 'Microsoft Corporation', symbol: 'MSFT', price: 420.3, marketCap: 3120000000000, volume: 21000000, sector: 'Technology' },
  { companyName: 'Alphabet Inc.', symbol: 'GOOGL', price: 175.2, marketCap: 2180000000000, volume: 25000000, sector: 'Technology' },
  { companyName: 'Amazon.com Inc.', symbol: 'AMZN', price: 185.1, marketCap: 1930000000000, volume: 38000000, sector: 'Consumer Discretionary' },
  { companyName: 'NVIDIA Corporation', symbol: 'NVDA', price: 128.4, marketCap: 3150000000000, volume: 210000000, sector: 'Technology' },
  { companyName: 'Meta Platforms Inc.', symbol: 'META', price: 505.6, marketCap: 1280000000000, volume: 15000000, sector: 'Technology' },
  { companyName: 'Tesla Inc.', symbol: 'TSLA', price: 245.8, marketCap: 780000000000, volume: 92000000, sector: 'Consumer Discretionary' },
  { companyName: 'Berkshire Hathaway Inc.', symbol: 'BRK.B', price: 410.2, marketCap: 890000000000, volume: 3500000, sector: 'Financials' },
  { companyName: 'JPMorgan Chase & Co.', symbol: 'JPM', price: 205.7, marketCap: 590000000000, volume: 8000000, sector: 'Financials' },
  { companyName: 'Johnson & Johnson', symbol: 'JNJ', price: 148.9, marketCap: 358000000000, volume: 6500000, sector: 'Healthcare' },
  { companyName: 'Visa Inc.', symbol: 'V', price: 275.3, marketCap: 560000000000, volume: 5800000, sector: 'Financials' },
  { companyName: 'Walmart Inc.', symbol: 'WMT', price: 68.4, marketCap: 550000000000, volume: 14000000, sector: 'Consumer Staples' },
  { companyName: 'The Procter & Gamble Company', symbol: 'PG', price: 165.2, marketCap: 390000000000, volume: 5200000, sector: 'Consumer Staples' },
  { companyName: 'Mastercard Incorporated', symbol: 'MA', price: 465.9, marketCap: 435000000000, volume: 2200000, sector: 'Financials' },
  { companyName: 'The Home Depot Inc.', symbol: 'HD', price: 340.1, marketCap: 340000000000, volume: 2900000, sector: 'Consumer Discretionary' },
  { companyName: 'Netflix Inc.', symbol: 'NFLX', price: 655.7, marketCap: 285000000000, volume: 3100000, sector: 'Communication Services' },
  { companyName: 'Coca-Cola Company', symbol: 'KO', price: 63.5, marketCap: 274000000000, volume: 12000000, sector: 'Consumer Staples' },
  { companyName: 'Pfizer Inc.', symbol: 'PFE', price: 28.6, marketCap: 162000000000, volume: 28000000, sector: 'Healthcare' },
  { companyName: 'Advanced Micro Devices Inc.', symbol: 'AMD', price: 158.3, marketCap: 256000000000, volume: 45000000, sector: 'Technology' },
  { companyName: 'Intel Corporation', symbol: 'INTC', price: 31.2, marketCap: 133000000000, volume: 51000000, sector: 'Technology' },
];

const seed = async () => {
  try {
    await connectDB();

    await Stock.deleteMany();
    const stockDocs = stocks.map((s) => ({ ...s, previousClose: s.price }));
    await Stock.insertMany(stockDocs);
    console.log(`Seeded ${stockDocs.length} stocks.`);

    const adminExists = await User.findOne({ email: 'admin@sbstocks.com' });
    if (!adminExists) {
      await User.create({
        name: 'SB Stocks Admin',
        email: 'admin@sbstocks.com',
        password: 'Admin@123',
        role: 'admin',
        balance: 100000,
      });
      console.log('Created default admin user -> admin@sbstocks.com / Admin@123');
    } else {
      console.log('Admin user already exists, skipping.');
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
