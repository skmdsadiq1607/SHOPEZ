const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { protect, admin } = require('../middleware/auth');

// @route   GET api/stocks
// @desc    Get all stocks
// @access  Public
router.get('/', async (req, res) => {
    try {
        const stocks = await Stock.find().select('-historicalData');
        res.json(stocks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/stocks/:symbol
// @desc    Get stock by symbol
// @access  Public
router.get('/:symbol', async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/stocks
// @desc    Add a new stock (Admin only)
// @access  Private/Admin
router.post('/', [protect, admin], async (req, res) => {
    const { symbol, name, currentPrice } = req.body;

    try {
        let stock = await Stock.findOne({ symbol });
        if (stock) {
            return res.status(400).json({ message: 'Stock already exists' });
        }

        // Generate some mock historical data for the chart
        const historicalData = [];
        let price = currentPrice;
        for (let i = 30; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            price = price + (Math.random() * 10 - 5); // Random walk
            if(price < 1) price = 1;
            historicalData.push({ date, price });
        }

        stock = new Stock({
            symbol: symbol.toUpperCase(),
            name,
            currentPrice,
            historicalData
        });

        await stock.save();
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/stocks/:symbol
// @desc    Update stock price (Admin/System)
// @access  Private/Admin
router.put('/:symbol', [protect, admin], async (req, res) => {
    const { currentPrice } = req.body;

    try {
        let stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        stock.currentPrice = currentPrice;
        stock.historicalData.push({ date: new Date(), price: currentPrice });
        
        await stock.save();
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
