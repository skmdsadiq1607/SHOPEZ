import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { api, user, fetchCartCount } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/api/cart');
            setCartItems(res.data);
        } catch (err) {
            console.error('Fetch cart error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCart();
    }, [user, api]);

    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty < 1) return;
        try {
            await api.put(`/api/cart/${itemId}`, { quantity: newQty });
            setCartItems(items => items.map(item => item._id === itemId ? { ...item, quantity: newQty } : item));
            await fetchCartCount();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/api/cart/${itemId}`);
            setCartItems(items => items.filter(item => item._id !== itemId));
            await fetchCartCount();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClearCart = async () => {
        try {
            await api.delete('/api/cart');
            setCartItems([]);
            await fetchCartCount();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    // Calculations
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc + ((item.price * (item.discount / 100)) * item.quantity), 0);
    const finalTotal = subtotal - totalDiscount;

    if (cartItems.length === 0) return (
        <div className="container mt-5 text-center animate-fade-in">
            <div className="bg-white p-5 rounded-3 border">
                <ShoppingBag size={64} className="text-muted mb-4" />
                <h4 className="fw-bold text-dark">Your Shopping Cart is Empty</h4>
                <p className="text-muted small mb-4">Add products to your cart and they will show up here.</p>
                <Link to="/" className="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">Shop Now</Link>
            </div>
        </div>
    );

    return (
        <div className="container mt-4 animate-fade-in">
            <h3 className="fw-bold text-dark font-secondary mb-4">Shopping Cart</h3>

            <div className="row g-4">
                {/* Cart Items List */}
                <div className="col-lg-8">
                    <div className="d-flex flex-column gap-3">
                        {cartItems.map(item => {
                            const discPrice = item.price - (item.price * (item.discount / 100));
                            return (
                                <div key={item._id} className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between bg-white p-3 rounded-3 border gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <img src={item.mainImg} className="rounded-2 border object-fit-cover" style={{ width: '80px', height: '80px' }} alt={item.title} />
                                        <div>
                                            <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ maxWidth: '250px' }}>{item.title}</h6>
                                            <span className="badge bg-secondary-subtle text-muted mb-2 px-2 py-1 rounded small">Size: {item.size}</span>
                                            <div className="d-flex align-items-baseline gap-2 mt-1">
                                                <span className="fw-bold text-dark">₹{Math.round(discPrice * item.quantity * 80).toLocaleString('en-IN')}</span>
                                                {item.discount > 0 && (
                                                    <span className="text-decoration-line-through text-muted small">₹{Math.round(item.price * item.quantity * 80).toLocaleString('en-IN')}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-4 w-100 w-sm-auto justify-content-between justify-content-sm-end">
                                        {/* Quantity Selector */}
                                        <div className="d-flex align-items-center border rounded-2 bg-light">
                                            <button className="btn btn-sm px-2 border-0" onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                                            <span className="px-3 fw-semibold small text-dark">{item.quantity}</span>
                                            <button className="btn btn-sm px-2 border-0" onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                                        </div>

                                        <button className="btn btn-light text-danger rounded-circle p-2 border shadow-sm" onClick={() => handleRemoveItem(item._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <Link to="/" className="btn btn-outline-secondary rounded-pill px-4 fw-semibold btn-sm">Continue Shopping</Link>
                        <button className="btn btn-outline-danger rounded-pill px-4 fw-semibold btn-sm" onClick={handleClearCart}>Clear Cart</button>
                    </div>
                </div>

                {/* Bill Summary Panel */}
                <div className="col-lg-4">
                    <div className="bg-white p-4 rounded-3 border">
                        <h5 className="fw-bold text-dark font-secondary mb-4">Price Details</h5>
                        
                        <div className="d-flex justify-content-between mb-3 text-muted small">
                            <span>Price ({cartItems.length} items)</span>
                            <span>₹{Math.round(subtotal * 80).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-success small">
                            <span>Discount</span>
                            <span>-₹{Math.round(totalDiscount * 80).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-muted small">
                            <span>Delivery Charges</span>
                            <span className="text-success fw-semibold">FREE</span>
                        </div>

                        <hr className="my-3 text-muted" />

                        <div className="d-flex justify-content-between mb-4">
                            <span className="fw-bold text-dark">Total Amount</span>
                            <span className="fw-bold text-dark fs-5 text-primary">₹{Math.round(finalTotal * 80).toLocaleString('en-IN')}</span>
                        </div>

                        <button className="btn btn-primary btn-lg w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold" onClick={() => navigate('/checkout')}>
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
