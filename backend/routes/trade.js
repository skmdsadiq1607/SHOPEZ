const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// @route   POST api/trade/buy
// @desc    Buy a stock
// @access  Private
router.post('/buy', protect, async (req, res) => {
    const { symbol, quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        const user = await User.findById(req.user.id);
        const totalAmount = stock.currentPrice * quantity;

        if (user.balance < totalAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct balance
        user.balance -= totalAmount;
        await user.save();

        // Record transaction
        const transaction = new Transaction({
            user: user._id,
            stockSymbol: stock.symbol,
            type: 'BUY',
            quantity,
            price: stock.currentPrice,
            totalAmount
        });
        await transaction.save();

        // Update portfolio
        let portfolio = await Portfolio.findOne({ user: user._id });
        if (!portfolio) {
            portfolio = new Portfolio({ user: user._id, holdings: [] });
        }

        const holdingIndex = portfolio.holdings.findIndex(h => h.stockSymbol === stock.symbol);
        if (holdingIndex >= 0) {
            const currentHolding = portfolio.holdings[holdingIndex];
            const newTotalQty = currentHolding.quantity + quantity;
            const newTotalCost = (currentHolding.quantity * currentHolding.averagePrice) + totalAmount;
            portfolio.holdings[holdingIndex].quantity = newTotalQty;
            portfolio.holdings[holdingIndex].averagePrice = newTotalCost / newTotalQty;
        } else {
            portfolio.holdings.push({
                stockSymbol: stock.symbol,
                quantity,
                averagePrice: stock.currentPrice
            });
        }
        await portfolio.save();

        res.json({ message: 'Purchase successful', transaction, balance: user.balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/trade/sell
// @desc    Sell a stock
// @access  Private
router.post('/sell', protect, async (req, res) => {
    const { symbol, quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        const portfolio = await Portfolio.findOne({ user: req.user.id });
        if (!portfolio) {
            return res.status(400).json({ message: 'Portfolio not found' });
        }

        const holdingIndex = portfolio.holdings.findIndex(h => h.stockSymbol === stock.symbol);
        if (holdingIndex === -1 || portfolio.holdings[holdingIndex].quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock quantity to sell' });
        }

        const user = await User.findById(req.user.id);
        const totalAmount = stock.currentPrice * quantity;

        // Add balance
        user.balance += totalAmount;
        await user.save();

        // Record transaction
        const transaction = new Transaction({
            user: user._id,
            stockSymbol: stock.symbol,
            type: 'SELL',
            quantity,
            price: stock.currentPrice,
            totalAmount
        });
        await transaction.save();

        // Update portfolio
        portfolio.holdings[holdingIndex].quantity -= quantity;
        if (portfolio.holdings[holdingIndex].quantity === 0) {
            portfolio.holdings.splice(holdingIndex, 1);
        }
        await portfolio.save();

        res.json({ message: 'Sale successful', transaction, balance: user.balance });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
