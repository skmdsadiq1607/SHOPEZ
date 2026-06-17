import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, PackageSearch } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark glass-nav sticky-top shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand fw-bolder fs-3 text-white d-flex align-items-center" to="/">
                    <PackageSearch className="me-2 text-primary" size={28} />
                    ShopEZ
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link text-white-50 px-3" to="/">Discover</Link>
                        </li>
                        {user ? (
                            <>
                                {user.usertype === 'admin' && (
                                    <li className="nav-item">
                                        <Link className="nav-link text-info px-3" to="/admin">Dashboard</Link>
                                    </li>
                                )}
                                <li className="nav-item ms-lg-2">
                                    <Link className="nav-link text-white position-relative px-3" to="/cart">
                                        <ShoppingCart size={20} />
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-2">
                                    <Link className="nav-link text-white px-3 d-flex align-items-center" to="/profile">
                                        <User size={20} className="me-1" /> Profile
                                    </Link>
                                </li>
                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                    <button className="btn btn-outline-light btn-sm d-flex align-items-center rounded-pill px-4 py-2" onClick={handleLogout}>
                                        <LogOut size={16} className="me-2" /> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                                    <Link className="nav-link text-white px-3" to="/login">Sign In</Link>
                                </li>
                                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                                    <Link className="btn btn-primary rounded-pill fw-bold px-4 py-2" to="/register">Get Started</Link>
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
