import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-top mt-5 py-4">
            <div className="container">
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <ShoppingBag className="text-primary animate-pulse" size={24} />
                            <span className="font-secondary fw-bold text-dark fs-5">ShopEZ</span>
                        </div>
                        <p className="text-muted small">
                            ShopEZ is your one-stop destination for effortless online shopping. Browse curated catalogs, get discount pricing, and checkout securely in seconds.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-bold mb-3 text-dark">Quick Links</h6>
                        <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
                            <li><a href="/" className="text-decoration-none text-muted">All Products</a></li>
                            <li><a href="/cart" className="text-decoration-none text-muted">Shopping Cart</a></li>
                            <li><a href="/admin" className="text-decoration-none text-muted">Seller Dashboard</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h6 className="fw-bold mb-3 text-dark">Developer Info</h6>
                        <p className="text-muted small mb-0">Built using the MERN stack with Mongoose, Express, React, and Node.js.</p>
                        <p className="text-muted small mt-2">© {new Date().getFullYear()} ShopEZ Inc. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
