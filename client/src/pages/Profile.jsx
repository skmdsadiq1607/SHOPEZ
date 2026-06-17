import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Package, MapPin } from 'lucide-react';

const Profile = () => {
    const { user, api } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const message = location.state?.message;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/api/orders/myorders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [api]);

    if (!user) return <div className="text-center mt-5">Please login to view your profile.</div>;
    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            {message && <div className="alert alert-success alert-dismissible fade show" role="alert">
                {message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>}
            
            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body text-center p-4">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="fw-bold">{user.username}</h4>
                            <p className="text-muted mb-0">{user.email}</p>
                            <span className="badge bg-secondary mt-2">{user.usertype.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-8">
                    <h3 className="fw-bolder mb-4"><Package className="me-2" /> My Orders</h3>
                    
                    {orders.length === 0 ? (
                        <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-light">
                            <h5 className="text-muted">You haven't placed any orders yet.</h5>
                        </div>
                    ) : (
                        <div className="d-flex flex-column gap-4">
                            {orders.map(order => (
                                <div key={order._id} className="card shadow-sm border-0 rounded-4 overflow-hidden">
                                    <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className="text-muted small">Order ID: {order._id}</span><br />
                                            <span className="text-muted small">Placed on: {new Date(order.orderDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge ${order.status === 'Pending' ? 'bg-warning text-dark' : 'bg-success'} fs-6`}>{order.status}</span>
                                            <div className="fw-bold mt-1 text-primary">${order.totalAmount.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <ul className="list-group list-group-flush">
                                            {order.products.map((item, idx) => (
                                                <li key={idx} className="list-group-item p-3 d-flex align-items-center">
                                                    <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} className="rounded me-3" />
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0 fw-bold">{item.title}</h6>
                                                        <small className="text-muted">Size: {item.size || 'N/A'} | Qty: {item.quantity}</small>
                                                    </div>
                                                    <span className="fw-semibold">${item.price.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="card-footer bg-light p-3">
                                        <div className="d-flex align-items-start">
                                            <MapPin className="text-muted me-2 mt-1 flex-shrink-0" size={18} />
                                            <div>
                                                <span className="d-block fw-semibold mb-1">Delivery to {order.name}</span>
                                                <small className="text-muted">{order.address}, {order.pincode}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
