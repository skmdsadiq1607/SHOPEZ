import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-5">
                <div className="card shadow-lg border-0 rounded-4">
                    <div className="card-body p-5">
                        <h2 className="text-center mb-4 fw-bold text-primary">Welcome Back</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-muted fw-semibold">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-lg bg-light" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-muted fw-semibold">Password</label>
                                <input 
                                    type="password" 
                                    className="form-control form-control-lg bg-light" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold shadow-sm">Login to Account</button>
                        </form>
                        <div className="text-center mt-4">
                            <span className="text-muted">Don't have an account? </span>
                            <Link to="/register" className="text-primary fw-semibold text-decoration-none">Register here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
