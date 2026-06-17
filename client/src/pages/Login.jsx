import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <div className="card-body">
                            <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-semibold">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                        placeholder="name@example.com"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-semibold">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control form-control-lg bg-light border-0" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                        placeholder="Enter your password"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold rounded-3 shadow-sm mb-3">
                                    Sign In
                                </button>
                                <p className="text-center text-muted">
                                    Don't have an account? <Link to="/register" className="text-decoration-none fw-bold">Sign up here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
