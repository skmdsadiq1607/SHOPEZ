import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, Search, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';

const Navbar = () => {
    const { user, logout, cartCount } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchVal.trim()) {
            navigate(`/?search=${encodeURIComponent(searchVal.trim())}`);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="shopez-navbar navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <Link className="navbar-brand navbar-brand-logo" to="/">
                    <ShoppingBag size={28} className="text-primary" />
                    <span>ShopEZ</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <form className="d-flex mx-auto search-bar-container my-2 my-lg-0 position-relative" onSubmit={handleSearchSubmit}>
                        <Search className="position-absolute start-0 top-50 translate-middle-y ms-3 text-muted" size={18} />
                        <input
                            className="form-control search-input"
                            type="search"
                            placeholder="Search for products, brands and more..."
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                        />
                    </form>

                    <div className="d-flex align-items-center gap-3">
                        <Link to="/cart" className="btn btn-light rounded-circle p-2 position-relative shadow-sm">
                            <ShoppingCart size={20} className="text-dark" />
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '10px' }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="dropdown">
                                <button className="btn btn-light rounded-pill px-3 py-2 d-flex align-items-center gap-2 dropdown-toggle shadow-sm" type="button" data-bs-toggle="dropdown">
                                    <User size={18} />
                                    <span className="fw-semibold small">{user.name || user.username}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                                    {user.usertype === 'admin' && (
                                        <li>
                                            <Link className="dropdown-item py-2 d-flex align-items-center gap-2" to="/admin">
                                                <LayoutDashboard size={16} /> Admin Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <button className="dropdown-item py-2 text-danger d-flex align-items-center gap-2" onClick={logout}>
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 btn-sm fw-semibold">Login</Link>
                                <Link to="/register" className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold shadow-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
