import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">ShopEZ</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Products</Link>
                        </li>
                        {user ? (
                            <>
                                {user.usertype === 'admin' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-info" to="/admin">Admin Dashboard</Link>
                                    </li>
                                )}
                                <li className="nav-item ms-3">
                                    <Link className="nav-link position-relative" to="/cart">
                                        <ShoppingCart size={20} />
                                    </Link>
                                </li>
                                <li className="nav-item ms-3">
                                    <Link className="nav-link" to="/profile">
                                        <User size={20} className="me-1" /> Profile
                                    </Link>
                                </li>
                                <li className="nav-item ms-3">
                                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={handleLogout}>
                                        <LogOut size={16} className="me-1" /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-3">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item ms-2">
                                    <Link className="btn btn-warning btn-sm fw-bold px-3 py-2" to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
