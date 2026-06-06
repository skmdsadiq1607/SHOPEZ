import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stocks`);
                setStocks(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <h2 className="fw-bold">Market Overview</h2>
                <div className="text-muted fw-semibold">Live Simulation</div>
            </div>
            
            <div className="row g-4">
                {stocks.length === 0 ? (
                    <div className="col-12 text-center text-muted">No stocks available in the market. Admin needs to add them.</div>
                ) : (
                    stocks.map(stock => (
                        <div key={stock._id} className="col-md-6 col-lg-4">
                            <div className="card shadow-sm h-100 border-0 rounded-4 stock-card transition-all">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h4 className="fw-bold mb-0">{stock.symbol}</h4>
                                        <span className="badge bg-primary rounded-pill px-3 py-2 fs-6">
                                            ${stock.currentPrice.toFixed(2)}
                                        </span>
                                    </div>
                                    <h6 className="text-muted mb-4">{stock.name}</h6>
                                    <Link to={`/stock/${stock.symbol}`} className="btn btn-outline-primary w-100 fw-semibold rounded-3">
                                        View & Trade
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
