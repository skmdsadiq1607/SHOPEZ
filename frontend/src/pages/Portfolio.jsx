import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const [portRes, transRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/portfolio'),
                    axios.get('http://localhost:5000/api/portfolio/transactions')
                ]);
                setPortfolio(portRes.data);
                setTransactions(transRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="mt-4">
            <h2 className="fw-bold mb-4">Your Portfolio</h2>
            
            <div className="row mb-5">
                <div className="col-md-6 col-lg-4 mb-4">
                    <div className="card shadow-sm bg-primary text-white border-0 rounded-4 h-100">
                        <div className="card-body p-4 d-flex flex-column justify-content-center">
                            <h5 className="fw-light mb-2">Total Portfolio Value</h5>
                            <h2 className="fw-bold mb-0">${portfolio?.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <h4 className="fw-bold mb-3">Current Holdings</h4>
            <div className="card shadow-sm border-0 rounded-4 mb-5">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 rounded-start-4">Symbol</th>
                                    <th className="py-3 border-0">Quantity</th>
                                    <th className="py-3 border-0">Avg Cost</th>
                                    <th className="py-3 border-0">Current Price</th>
                                    <th className="py-3 border-0">Total Value</th>
                                    <th className="px-4 py-3 border-0 rounded-end-4 text-end">Profit/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio?.holdings?.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4 text-muted">No holdings found. Start trading!</td></tr>
                                ) : (
                                    portfolio?.holdings?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 fw-bold">
                                                <Link to={`/stock/${item.stockSymbol}`} className="text-decoration-none text-dark">{item.stockSymbol}</Link>
                                            </td>
                                            <td className="py-3">{item.quantity}</td>
                                            <td className="py-3">${item.averagePrice.toFixed(2)}</td>
                                            <td className="py-3">${item.currentPrice.toFixed(2)}</td>
                                            <td className="py-3 fw-semibold">${item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className={`px-4 py-3 text-end fw-bold ${item.profitLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                                                ${item.profitLoss.toFixed(2)} ({item.profitLossPercent.toFixed(2)}%)
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <h4 className="fw-bold mb-3">Recent Transactions</h4>
            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3 border-0 rounded-start-4">Date</th>
                                    <th className="py-3 border-0">Type</th>
                                    <th className="py-3 border-0">Symbol</th>
                                    <th className="py-3 border-0">Quantity</th>
                                    <th className="py-3 border-0">Price</th>
                                    <th className="px-4 py-3 border-0 rounded-end-4 text-end">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4 text-muted">No transactions found.</td></tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx._id}>
                                            <td className="px-4 py-3 text-muted">{new Date(tx.createdAt).toLocaleString()}</td>
                                            <td className={`py-3 fw-bold ${tx.type === 'BUY' ? 'text-success' : 'text-danger'}`}>{tx.type}</td>
                                            <td className="py-3 fw-semibold">{tx.stockSymbol}</td>
                                            <td className="py-3">{tx.quantity}</td>
                                            <td className="py-3">${tx.price.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-end fw-semibold">${tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
