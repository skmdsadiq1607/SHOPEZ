import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5 my-md-5">
            <div className="row g-0 split-bg">
                {/* Image Section */}
                <div className="col-lg-6 d-none d-lg-block split-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80)' }}>
                    <div className="position-absolute bottom-0 start-0 p-5 z-1 text-white">
                        <h2 className="display-4 fw-bolder mb-3">Elevate your<br/>shopping experience.</h2>
                        <p className="lead text-white-50">Discover premium products curated just for you.</p>
                    </div>
                </div>
                
                {/* Form Section */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
                    <div className="w-100" style={{ maxWidth: '400px' }}>
                        <div className="text-center mb-5">
                            <h2 className="fw-bolder text-primary mb-2">Welcome Back</h2>
                            <p className="text-muted">Sign in to continue to ShopEZ</p>
                        </div>
                        
                        {error && <div className="alert alert-danger rounded-3 border-0 bg-danger bg-opacity-10 text-danger mb-4">{error}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    placeholder="name@example.com"
                                />
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <label className="form-label text-muted fw-semibold small text-uppercase tracking-wider mb-0">Password</label>
                                    <a href="#" className="text-primary text-decoration-none small fw-semibold">Forgot password?</a>
                                </div>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    placeholder="••••••••"
                                />
                            </div>
                            
                            <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold rounded-pill shadow-sm mb-4" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                            
                            <p className="text-center text-muted">
                                Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-bold ms-1">Register here</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
