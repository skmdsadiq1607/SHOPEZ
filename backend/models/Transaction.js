const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stockSymbol: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number, // Price per share at the time of transaction
        required: true
    },
    totalAmount: {
        type: Number, // quantity * price
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
