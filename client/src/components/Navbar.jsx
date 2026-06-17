import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, User, LogOut, PackageSearch } from 'lucide-react';

const Navbar = () => {
    const { user, logout, cartCount } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header>
            <nav className="navbar mega-nav px-3 py-2">
                <div className="container d-flex flex-wrap align-items-center justify-content-between">
                    
                    {/* Logo */}
                    <div className="d-flex align-items-center col-12 col-lg-auto mb-2 mb-lg-0 me-lg-4">
                        <Link className="navbar-brand fw-bold fs-4 text-white d-flex align-items-center m-0" to="/">
                            <PackageSearch className="me-2 text-warning" size={26} />
                            Shop<span className="text-warning">EZ</span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="col-12 col-lg flex-grow-1 mx-lg-4 mb-2 mb-lg-0">
                        <div className="input-group search-bar bg-white mx-auto">
                            <input type="text" className="form-control border-0 shadow-none" placeholder="Search for products, brands and more" aria-label="Search" />
                            <button className="btn border-0 text-primary bg-white" type="button">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="col-12 col-lg-auto d-flex align-items-center justify-content-lg-end justify-content-center">
                        {user ? (
                            <>
                                {user.usertype === 'admin' && (
                                    <Link className="nav-link custom-link me-4 d-flex align-items-center" to="/admin">
                                        Seller Hub
                                    </Link>
                                )}
                                <div className="dropdown me-4">
                                    <button className="btn btn-link nav-link custom-link d-flex align-items-center dropdown-toggle text-decoration-none" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <User size={18} className="me-1" /> {user.name.split(' ')[0]}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                        <li><Link className="dropdown-item py-2" to="/profile">My Profile</Link></li>
                                        <li><Link className="dropdown-item py-2" to="/profile">Orders</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><button className="dropdown-item text-danger py-2 d-flex align-items-center" onClick={handleLogout}><LogOut size={16} className="me-2" /> Logout</button></li>
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div className="me-4 d-flex align-items-center">
                                <Link className="btn bg-white text-primary fw-bold px-4 py-1 rounded-1 me-3 shadow-sm" style={{ fontSize: '15px' }} to="/login">Login</Link>
                                <Link className="nav-link custom-link" to="/register">Sign Up</Link>
                            </div>
                        )}
                        
                        <Link className="nav-link custom-link d-flex align-items-center position-relative" to="/cart">
                            <ShoppingCart size={22} className="me-1" />
                            <span>Cart</span>
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Sub-Navigation / Categories */}
            <div className="sub-nav d-none d-md-block">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="d-flex w-100 justify-content-start overflow-auto">
                        <span className="sub-nav-link fw-bold text-dark">All Categories</span>
                        <span className="sub-nav-link">Electronics</span>
                        <span className="sub-nav-link">Mobiles</span>
                        <span className="sub-nav-link">Men's Fashion</span>
                        <span className="sub-nav-link">Women's Fashion</span>
                        <span className="sub-nav-link">Home & Kitchen</span>
                        <span className="sub-nav-link">Appliances</span>
                        <span className="sub-nav-link">Beauty</span>
                        <span className="sub-nav-link">Sports & More</span>
                        <span className="sub-nav-link">Grocery</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
