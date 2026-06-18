import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag } from 'lucide-react';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [pincode, setPincode] = useState('');

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim() || !email.trim() || !password.trim() || !name.trim() || !mobile.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            await register({ username, email, password, name, mobile, address, pincode });
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Failed to register. Username or email may already be taken.');
            setSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: '80vh' }}>
            <div className="bg-white p-4 rounded-3 border shadow-sm w-100 animate-fade-in" style={{ maxWidth: '500px' }}>
                <div className="text-center mb-4">
                    <ShoppingBag size={48} className="text-primary mb-2" />
                    <h4 className="fw-bold text-dark font-secondary">Join ShopEZ today</h4>
                    <p className="text-muted small">Create an account to track orders and save your cart</p>
                </div>

                {error && <div className="alert alert-danger rounded-2 py-2.5 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted small fw-semibold">Name *</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted small fw-semibold">Username *</label>
                            <input
                                type="text"
                                className="form-control bg-light"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted small fw-semibold">Email Address *</label>
                            <input
                                type="email"
                                className="form-control bg-light"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted small fw-semibold">Mobile *</label>
                            <input
                                type="tel"
                                className="form-control bg-light"
                                placeholder="10-digit mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small fw-semibold">Password *</label>
                        <input
                            type="password"
                            className="form-control bg-light"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-muted small fw-semibold">Address</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Full address (optional)"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted small fw-semibold">Pincode</label>
                        <input
                            type="text"
                            className="form-control bg-light"
                            placeholder="Pincode (optional)"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2.5 rounded-pill fw-semibold shadow-sm mb-3"
                        disabled={submitting}
                    >
                        {submitting ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center">
                    <span className="text-muted small">Already have an account? </span>
                    <Link to="/login" className="text-decoration-none small fw-semibold text-primary">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
