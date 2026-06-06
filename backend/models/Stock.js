const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    dailyStats: {
        high: Number,
        low: Number,
        open: Number,
        volume: Number
    },
    historicalData: [{
        date: Date,
        price: Number
    }]
}, { timestamps: true });

// Adding an index on symbol for faster querying
StockSchema.index({ symbol: 1 });

module.exports = mongoose.model('Stock', StockSchema);
