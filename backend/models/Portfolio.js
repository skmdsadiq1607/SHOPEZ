const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    holdings: [{
        stockSymbol: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 0
        },
        averagePrice: {
            type: Number,
            required: true,
            default: 0
        }
    }],
    totalValue: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
