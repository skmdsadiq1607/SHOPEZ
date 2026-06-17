import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', name: '', mobile: '', address: '', pincode: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5 my-md-5">
            <div className="row g-0 split-bg flex-row-reverse">
                {/* Image Section */}
                <div className="col-lg-5 d-none d-lg-block split-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80)' }}>
                    <div className="position-absolute bottom-0 start-0 p-5 z-1 text-white">
                        <h2 className="display-4 fw-bolder mb-3">Join the<br/>ShopEZ family.</h2>
                        <p className="lead text-white-50">Sign up today and get exclusive access to new drops.</p>
                    </div>
                </div>
                
                {/* Form Section */}
                <div className="col-lg-7 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
                    <div className="w-100" style={{ maxWidth: '600px' }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bolder text-primary mb-2">Create an Account</h2>
                            <p className="text-muted">Start shopping for premium goods today</p>
                        </div>
                        
                        {error && <div className="alert alert-danger rounded-3 border-0 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Username</label>
                                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required placeholder="johndoe123" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Full Name</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                </div>
                            </div>
                            
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Email Address</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Mobile Number</label>
                                    <input type="text" className="form-control" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="1234567890" />
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Password</label>
                                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Delivery Address</label>
                                <textarea className="form-control" name="address" rows="2" value={formData.address} onChange={handleChange} required placeholder="123 Main St..."></textarea>
                            </div>
                            
                            <div className="mb-4">
                                <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Pincode</label>
                                <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="10001" />
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold rounded-pill shadow-sm mb-4 mt-2" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                            
                            <p className="text-center text-muted">
                                Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-bold ms-1">Sign in here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
