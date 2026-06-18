import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, CreditCard } from 'lucide-react';

const Checkout = () => {
    const { api, user, fetchCartCount } = useAuth();
    const navigate = useNavigate();
    
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState(user?.address || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    const [submitting, setSubmitting] = useState(false);
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchCart = async () => {
            try {
                const res = await api.get('/api/cart');
                setCartItems(res.data);
                if (res.data.length === 0) {
                    navigate('/cart');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user, api, navigate]);

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (!address.trim() || !mobile.trim()) {
            setError('Please fill out shipping address and mobile number.');
            return;
        }

        setSubmitting(true);
        setError('');

        const orderItems = cartItems.map(item => ({
            productId: item.productId,
            title: item.title,
            quantity: item.quantity,
            size: item.size,
            price: item.price - (item.price * (item.discount / 100)),
            mainImg: item.mainImg
        }));

        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalDiscount = cartItems.reduce((acc, item) => acc + ((item.price * (item.discount / 100)) * item.quantity), 0);
        const finalTotal = subtotal - totalDiscount;

        try {
            await api.post('/api/orders', {
                items: orderItems,
                totalAmount: finalTotal,
                shippingAddress: address,
                mobile: mobile,
                paymentMethod: 'Card'
            });
            await fetchCartCount();
            setOrderConfirmed(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Order creation failed:', err);
            setError(err.response?.data?.message || 'Failed to place order. Try again.');
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc + ((item.price * (item.discount / 100)) * item.quantity), 0);
    const finalTotal = subtotal - totalDiscount;

    if (orderConfirmed) {
        return (
            <div className="container mt-5 text-center animate-fade-in">
                <div className="bg-white p-5 rounded-3 border shadow-sm">
                    <CheckCircle size={72} className="text-success mb-4 animate-bounce" />
                    <h3 className="fw-bold text-dark font-secondary">Order Confirmed!</h3>
                    <p className="text-muted small my-3">Thank you for shopping with ShopEZ. Your order has been placed successfully.</p>
                    <p className="text-muted small">Redirecting to Home page...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 animate-fade-in">
            <h3 className="fw-bold text-dark font-secondary mb-4">Secure Checkout</h3>
            
            {error && <div className="alert alert-danger rounded-2 py-2.5 small">{error}</div>}

            <form onSubmit={handleCheckoutSubmit}>
                <div className="row g-4">
                    {/* Form Section */}
                    <div className="col-lg-7">
                        <div className="bg-white p-4 rounded-3 border d-flex flex-column gap-3 mb-3">
                            <h5 className="fw-bold text-dark font-secondary border-bottom pb-2 mb-2">Shipping Information</h5>
                            
                            <div>
                                <label className="form-label text-muted small fw-semibold">Delivery Address</label>
                                <textarea
                                    className="form-control bg-light"
                                    rows="3"
                                    placeholder="Enter your full street address, landmark, city and pincode"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="form-label text-muted small fw-semibold">Mobile Number</label>
                                <input
                                    type="tel"
                                    className="form-control bg-light"
                                    placeholder="Enter 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-3 border d-flex flex-column gap-3">
                            <h5 className="fw-bold text-dark font-secondary border-bottom pb-2 mb-2 d-flex align-items-center gap-2">
                                <CreditCard size={18} /> Payment Details
                            </h5>
                            
                            <div>
                                <label className="form-label text-muted small fw-semibold">Card Holder Name</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    placeholder="Enter cardholder name"
                                    defaultValue={user?.name}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label text-muted small fw-semibold">Card Number</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                    maxLength="16"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label text-muted small fw-semibold">Expiry Date</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="form-label text-muted small fw-semibold">CVV</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light"
                                        placeholder="XXX"
                                        maxLength="3"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill Section */}
                    <div className="col-lg-5">
                        <div className="bg-white p-4 rounded-3 border">
                            <h5 className="fw-bold text-dark font-secondary border-bottom pb-2 mb-3">Order Summary</h5>
                            
                            <div className="d-flex flex-column gap-3 mb-4 overflow-y-auto" style={{ maxHeight: '200px' }}>
                                {cartItems.map(item => {
                                    const discPrice = item.price - (item.price * (item.discount / 100));
                                    return (
                                        <div key={item._id} className="d-flex justify-content-between align-items-center gap-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <img src={item.mainImg} className="rounded object-fit-cover border" style={{ width: '45px', height: '45px' }} alt="" />
                                                <div>
                                                    <span className="fw-semibold text-dark small d-block text-truncate" style={{ maxWidth: '180px' }}>{item.title}</span>
                                                    <span className="text-muted small">Qty: {item.quantity} | Size: {item.size}</span>
                                                </div>
                                            </div>
                                            <span className="fw-bold text-dark small">${(discPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="d-flex justify-content-between mb-3 text-muted small">
                                <span>Cart Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-success small">
                                <span>Cart Discount</span>
                                <span>-${totalDiscount.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-muted small">
                                <span>Delivery Fee</span>
                                <span className="text-success fw-semibold">FREE</span>
                            </div>

                            <hr className="my-3 text-muted" />

                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold text-dark">Order Total</span>
                                <span className="fw-bold text-dark fs-5">${finalTotal.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing Payment...' : `Pay & Place Order $${finalTotal.toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
