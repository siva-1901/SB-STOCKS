# SB Stocks — Paper Stock Trading Simulator

A full-stack MERN application that lets users practice buying and selling US stocks with
virtual money. Built with React, Node.js, Express, and MongoDB.

## Features

- JWT authentication (register/login) with bcrypt password hashing
- Role-based access (User / Admin)
- Dashboard with balance, portfolio value, profit/loss, top gainers/losers, recent trades
- Stock market listing with search, sort, filter by sector, and pagination
- Buy / Sell modals with live cost, remaining balance, and profit/loss calculations
- Portfolio with average buy price, current value, and gain/loss tracking
- Watchlist (add / remove / view)
- Transaction history with filtering and CSV export
- Editable user profile (name, email, password, profile image URL)
- Admin dashboard with platform analytics and charts
- Admin stock management (create / edit / delete)
- Admin user management (view / suspend / delete)
- Simulated live market prices (fallback engine — swap in Alpha Vantage / Finnhub /
  Twelve Data / Financial Modeling Prep for real data, see note below)
- Dark mode / light mode, glassmorphism UI, responsive layout, toast notifications
- Security: Helmet, rate limiting, Mongo sanitization, XSS protection, input validation

## Tech Stack

**Frontend:** React 18, React Router DOM, Axios, Context API, Tailwind CSS, Chart.js, React Toastify, Vite

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors, helmet

## Project Structure

```
sb-stocks/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handler logic
│   ├── middleware/      # Auth, admin, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── seed/            # Database seed script
│   ├── utils/           # Helpers (JWT generation)
│   └── server.js        # App entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # Auth context (JWT, theme)
        ├── layouts/      # Dashboard layout (navbar + sidebar)
        ├── pages/        # Route-level pages (incl. pages/admin)
        └── services/     # Axios instance with interceptors
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URI` and a strong `JWT_SECRET`.

Seed the database with a starter set of stocks and a default admin account:

```bash
npm run seed
```

This creates:
- 20 well-known US stocks
- An admin account: **admin@sbstocks.com / Admin@123**

Start the API:

```bash
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend.

### 3. Using the App

1. Register a new account (starts with $100,000 virtual balance) or log in as the seeded admin.
2. Browse stocks, buy/sell shares, build a watchlist, and review your portfolio and transaction history.
3. Log in as `admin@sbstocks.com` to access `/admin` for platform analytics, stock CRUD, and user management.

## Live Stock Data

This project ships with a built-in market simulation engine (`server.js`) that gently moves
stock prices every 15 seconds so the app feels alive out of the box, with no external API key
required. To connect a real provider instead, replace the `simulateMarket` function in
`backend/server.js` with scheduled calls to a free provider such as Alpha Vantage, Finnhub,
Twelve Data, or Financial Modeling Prep, and fall back to the simulator if the API's rate limit
is hit.

## Security Notes

- Passwords are hashed with bcrypt and never returned by the API.
- All private routes are protected by JWT middleware; admin routes additionally require the `admin` role.
- Requests are sanitized against NoSQL injection and XSS, and rate-limited per IP.
- Set a long, random `JWT_SECRET` in production and always serve the app over HTTPS.

## License

Built for educational purposes as a paper trading simulator. Not affiliated with any real
brokerage. All trades are virtual and carry no real financial risk or reward.
