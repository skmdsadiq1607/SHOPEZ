const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   GET api/portfolio
// @desc    Get user portfolio
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.user.id });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }

        // Calculate current value based on latest stock prices
        let totalValue = 0;
        const enrichedHoldings = [];

        for (let holding of portfolio.holdings) {
            const stock = await Stock.findOne({ symbol: holding.stockSymbol });
            const currentPrice = stock ? stock.currentPrice : holding.averagePrice;
            const currentValue = currentPrice * holding.quantity;
            totalValue += currentValue;
            
            enrichedHoldings.push({
                stockSymbol: holding.stockSymbol,
                quantity: holding.quantity,
                averagePrice: holding.averagePrice,
                currentPrice,
                currentValue,
                profitLoss: currentValue - (holding.averagePrice * holding.quantity),
                profitLossPercent: ((currentPrice - holding.averagePrice) / holding.averagePrice) * 100
            });
        }

        res.json({
            holdings: enrichedHoldings,
            totalValue
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/portfolio/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
