import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setSubmitting(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password.');
            setSubmitting(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '75vh' }}>
            <div className="bg-white p-4 rounded-3 border shadow-sm w-100 animate-fade-in" style={{ maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <ShoppingBag size={48} className="text-primary mb-2" />
                    <h4 className="fw-bold text-dark font-secondary">Welcome back to ShopEZ</h4>
                    <p className="text-muted small">Please sign in to continue shopping</p>
                </div>

                {error && <div className="alert alert-danger rounded-2 py-2.5 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-muted small fw-semibold">Email Address</label>
                        <input
                            type="email"
                            className="form-control bg-light"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-muted small fw-semibold">Password</label>
                        <input
                            type="password"
                            className="form-control bg-light"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-2.5 rounded-pill fw-semibold shadow-sm mb-3"
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center">
                    <span className="text-muted small">Don't have an account? </span>
                    <Link to="/register" className="text-decoration-none small fw-semibold text-primary">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
