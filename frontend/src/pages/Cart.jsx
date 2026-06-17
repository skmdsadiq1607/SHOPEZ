import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get('/api/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/api/cart/${id}`);
            fetchCart();
        } catch (err) {
            console.error(err);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const discountedPrice = item.price - (item.price * (item.discount / 100));
            return total + (discountedPrice * item.quantity);
        }, 0);
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            <h2 className="fw-bolder mb-4">Your Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-4">
                    <ShoppingBag size={64} className="text-muted mb-3" />
                    <h4>Your cart is empty</h4>
                    <p className="text-muted mb-4">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="btn btn-primary fw-bold px-4 py-2 rounded-3">Start Shopping</Link>
                </div>
            ) : (
                <div className="row">
                    <div className="col-lg-8">
                        {cartItems.map(item => (
                            <div key={item._id} className="card shadow-sm border-0 mb-3 rounded-4 overflow-hidden">
                                <div className="row g-0">
                                    <div className="col-md-3 col-4">
                                        <img src={item.mainImg} className="img-fluid h-100" alt={item.title} style={{ objectFit: 'cover' }} />
                                    </div>
                                    <div className="col-md-9 col-8">
                                        <div className="card-body position-relative h-100 d-flex flex-column justify-content-center">
                                            <button 
                                                className="btn btn-link text-danger position-absolute top-0 end-0 mt-2 me-2 p-1"
                                                onClick={() => handleRemove(item._id)}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <h5 className="card-title fw-bold text-truncate pe-4">{item.title}</h5>
                                            <p className="card-text text-muted small mb-1">Size: {item.size || 'N/A'}</p>
                                            <p className="card-text mb-2">
                                                <span className="fw-bold text-success">${(item.price - (item.price * (item.discount / 100))).toFixed(2)}</span>
                                                {item.discount > 0 && <span className="text-muted ms-2 text-decoration-line-through small">${item.price.toFixed(2)}</span>}
                                            </p>
                                            <p className="card-text mb-0 fw-semibold">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow border-0 rounded-4 sticky-top" style={{ top: '20px' }}>
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Order Summary</h4>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Subtotal ({cartItems.length} items)</span>
                                    <span className="fw-bold">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                    <span className="text-muted">Shipping</span>
                                    <span className="fw-bold text-success">Free</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 mt-2">
                                    <span className="fw-bolder fs-5">Total</span>
                                    <span className="fw-bolder fs-5 text-primary">${calculateTotal().toFixed(2)}</span>
                                </div>
                                <Link to="/checkout" className="btn btn-primary w-100 btn-lg fw-bold rounded-3 shadow-sm">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
