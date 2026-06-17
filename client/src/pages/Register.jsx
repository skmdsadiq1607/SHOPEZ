import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        mobile: '',
        address: '',
        pincode: ''
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <div className="card-body">
                            <h2 className="text-center mb-4 fw-bold text-primary">Create an Account</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Username</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="username" value={formData.username} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Full Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Email address</label>
                                        <input type="email" className="form-control form-control-lg bg-light border-0" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted fw-semibold">Mobile Number</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" name="mobile" value={formData.mobile} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-semibold">Password</label>
                                    <input type="password" className="form-control form-control-lg bg-light border-0" name="password" value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted fw-semibold">Delivery Address</label>
                                    <textarea className="form-control form-control-lg bg-light border-0" name="address" rows="2" value={formData.address} onChange={handleChange} required></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted fw-semibold">Pincode</label>
                                    <input type="text" className="form-control form-control-lg bg-light border-0" name="pincode" value={formData.pincode} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn btn-primary w-100 btn-lg fw-bold rounded-3 shadow-sm mb-3">
                                    Create Account
                                </button>
                                <p className="text-center text-muted">
                                    Already have an account? <Link to="/login" className="text-decoration-none fw-bold">Sign in here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
