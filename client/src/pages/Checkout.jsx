import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { api, user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '',
        address: user?.address || '',
        pincode: user?.pincode || '',
        paymentMethod: 'Credit Card'
    });

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get('/api/cart');
                if (res.data.length === 0) {
                    navigate('/cart');
                    return;
                }
                setCartItems(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [api, navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const discountedPrice = item.price - (item.price * (item.discount / 100));
            return total + (discountedPrice * item.quantity);
        }, 0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const orderData = {
                ...formData,
                products: cartItems.map(item => ({
                    productId: item.productId,
                    title: item.title,
                    desc: item.description,
                    image: item.mainImg,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount
                })),
                totalAmount: calculateTotal()
            };
            
            await api.post('/api/orders', orderData);
            navigate('/profile', { state: { message: 'Order placed successfully!' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order');
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            <h2 className="fw-bolder mb-4">Checkout</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4 border-bottom pb-2">Shipping Details</h4>
                            <form onSubmit={handleSubmit} id="checkout-form">
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Full Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Email</label>
                                        <input type="email" className="form-control form-control-lg bg-light border-0" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Mobile Number</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="mobile" value={formData.mobile} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Pincode</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="pincode" value={formData.pincode} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-semibold">Delivery Address</label>
                                    <textarea className="form-control form-control-lg bg-light border-0" name="address" rows="3" value={formData.address} onChange={handleChange} required></textarea>
                                </div>
                                
                                <h4 className="fw-bold mb-3 mt-4 border-bottom pb-2">Payment Method</h4>
                                <div className="mb-3">
                                    <select className="form-select form-select-lg bg-light border-0" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                                        <option value="Credit Card">Credit/Debit Card</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="Cash on Delivery">Cash on Delivery</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 rounded-4 sticky-top" style={{ top: '20px' }}>
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4">Order Summary</h4>
                            <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {cartItems.map((item, index) => (
                                    <div key={index} className="d-flex mb-3 border-bottom pb-2">
                                        <img src={item.mainImg} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded me-3" />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 text-truncate" style={{ maxWidth: '150px' }}>{item.title}</h6>
                                            <small className="text-muted">Qty: {item.quantity}</small>
                                        </div>
                                        <div className="text-end">
                                            <span className="fw-bold">${((item.price - (item.price * (item.discount / 100))) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                                <span className="text-muted">Subtotal</span>
                                <span className="fw-bold">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4 mt-2">
                                <span className="fw-bolder fs-5">Total to Pay</span>
                                <span className="fw-bolder fs-5 text-primary">${calculateTotal().toFixed(2)}</span>
                            </div>
                            <button form="checkout-form" type="submit" className="btn btn-primary w-100 btn-lg fw-bold rounded-3 shadow-sm">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
