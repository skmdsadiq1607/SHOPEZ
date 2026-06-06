import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockDetail = () => {
    const { symbol } = useParams();
    const [stock, setStock] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/stocks/${symbol}`);
                setStock(res.data);
            } catch (err) {
                console.error(err);
                setMessage('Error loading stock details');
            } finally {
                setLoading(false);
            }
        };

        fetchStock();
    }, [symbol]);

    const handleTrade = async (type) => {
        setActionLoading(true);
        setMessage('');
        try {
            const endpoint = type === 'BUY' ? '/api/trade/buy' : '/api/trade/sell';
            const res = await axios.post(`http://localhost:5000${endpoint}`, {
                symbol,
                quantity: Number(quantity)
            });
            setUser(prev => ({ ...prev, balance: res.data.balance }));
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Trade failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (!stock) return <div className="text-center mt-5 text-muted">Stock not found</div>;

    const chartData = {
        labels: stock.historicalData.map(d => new Date(d.date).toLocaleDateString()),
        datasets: [
            {
                label: `${stock.symbol} Price`,
                data: stock.historicalData.map(d => d.price),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        }
    };

    return (
        <div className="row mt-4">
            <div className="col-lg-8 mb-4">
                <div className="card shadow-sm border-0 rounded-4">
                    <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="fw-bold mb-0">{stock.name} ({stock.symbol})</h2>
                                <h4 className="text-primary mt-2">${stock.currentPrice.toFixed(2)}</h4>
                            </div>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>Back</button>
                        </div>
                        <div style={{ height: '400px' }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="col-lg-4">
                <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '20px' }}>
                    <div className="card-body p-4">
                        <h4 className="fw-bold mb-4">Trade {stock.symbol}</h4>
                        {message && <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} py-2`}>{message}</div>}
                        
                        <div className="mb-4">
                            <label className="form-label text-muted fw-semibold">Quantity (Shares)</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg bg-light" 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)} 
                                min="1"
                            />
                        </div>

                        <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                            <span className="text-muted fw-semibold">Estimated Total</span>
                            <span className="fw-bold fs-5">${(stock.currentPrice * quantity).toFixed(2)}</span>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                className="btn btn-success w-50 py-3 fw-bold shadow-sm" 
                                onClick={() => handleTrade('BUY')}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'BUY'}
                            </button>
                            <button 
                                className="btn btn-danger w-50 py-3 fw-bold shadow-sm" 
                                onClick={() => handleTrade('SELL')}
                                disabled={actionLoading}
                            >
                                {actionLoading ? 'Processing...' : 'SELL'}
                            </button>
                        </div>
                        
                        <div className="mt-4 text-center">
                            <small className="text-muted">Available Balance: ${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetail;
