const mongoose = require('mongoose');
require('dotenv').config();
const Stock = require('./models/Stock');

const generateHistoricalData = (startPrice) => {
    const historicalData = [];
    let price = startPrice;
    for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        price = price + (Math.random() * 10 - 5);
        if(price < 1) price = 1;
        historicalData.push({ date, price });
    }
    return historicalData;
};

const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 150.25, historicalData: generateHistoricalData(150.25) },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', currentPrice: 2800.10, historicalData: generateHistoricalData(2800.10) },
    { symbol: 'TSLA', name: 'Tesla Inc.', currentPrice: 700.50, historicalData: generateHistoricalData(700.50) },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', currentPrice: 3300.00, historicalData: generateHistoricalData(3300.00) },
    { symbol: 'MSFT', name: 'Microsoft Corp.', currentPrice: 300.75, historicalData: generateHistoricalData(300.75) }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopez_stocks')
.then(async () => {
    console.log('MongoDB Connected');
    await Stock.deleteMany(); // Clear existing
    await Stock.insertMany(stocks);
    console.log('Data Imported');
    process.exit();
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
