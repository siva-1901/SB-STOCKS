const Portfolio = require('../models/Portfolio');

// @desc   Get logged-in user's portfolio
// @route  GET /api/portfolio
// @access Private
const getPortfolio = async (req, res, next) => {
  try {
    const holdings = await Portfolio.find({ userId: req.user._id }).populate('stockId');

    const portfolio = holdings
      .filter((h) => h.stockId)
      .map((h) => {
        const currentValue = h.stockId.price * h.quantity;
        const investment = h.averagePrice * h.quantity;
        const profitLoss = currentValue - investment;
        const profitLossPercent = investment > 0 ? (profitLoss / investment) * 100 : 0;

        return {
          _id: h._id,
          stockId: h.stockId._id,
          companyName: h.stockId.companyName,
          symbol: h.stockId.symbol,
          logo: h.stockId.logo,
          quantity: h.quantity,
          averagePrice: h.averagePrice,
          currentPrice: h.stockId.price,
          currentValue,
          investment,
          profitLoss,
          profitLossPercent,
        };
      });

    const totalPortfolioValue = portfolio.reduce((sum, p) => sum + p.currentValue, 0);
    const totalInvestment = portfolio.reduce((sum, p) => sum + p.investment, 0);
    const overallGainLoss = totalPortfolioValue - totalInvestment;
    const overallGainLossPercent = totalInvestment > 0 ? (overallGainLoss / totalInvestment) * 100 : 0;

    res.json({
      holdings: portfolio,
      summary: {
        totalPortfolioValue,
        totalInvestment,
        overallGainLoss,
        overallGainLossPercent,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolio };
