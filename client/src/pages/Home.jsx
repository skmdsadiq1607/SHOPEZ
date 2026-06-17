import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { api } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        </div>
    );

    return (
        <div>
            {/* Premium Hero Section */}
            <div className="position-relative overflow-hidden bg-dark text-white text-center py-5" style={{ 
                minHeight: '70vh',
                backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to right, rgba(17,24,39,0.9), rgba(17,24,39,0.6))' }}></div>
                <div className="container position-relative z-1 d-flex flex-column justify-content-center h-100" style={{ minHeight: '60vh' }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <span className="badge bg-primary px-3 py-2 rounded-pill mb-4 fs-6 tracking-wider text-uppercase">New Collection 2026</span>
                            <h1 className="display-2 fw-bolder mb-4 text-white">Style that speaks<br/>for itself.</h1>
                            <p className="lead text-white-50 mb-5 fs-4 px-md-5">Discover our premium selection of curated products designed to elevate your everyday lifestyle.</p>
                            <button className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-inline-flex align-items-center" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                                Shop Now <ArrowRight className="ms-2" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Catalog */}
            <div id="products" className="container py-5 my-5">
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <h2 className="display-5 fw-bolder text-dark mb-2">Trending Now</h2>
                        <p className="text-muted fs-5 mb-0">The most sought-after products this week.</p>
                    </div>
                </div>
                
                <div className="row g-4">
                    {products.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div className="bg-white p-5 rounded-4 shadow-sm border">
                                <ShoppingBag size={48} className="text-muted mb-3" />
                                <h3 className="fw-bold">No products found</h3>
                                <p className="text-muted">We are currently restocking our inventory. Check back soon!</p>
                            </div>
                        </div>
                    ) : (
                        products.map(product => (
                            <div key={product._id} className="col-md-6 col-lg-4 col-xl-3">
                                <div className="card h-100 product-card border-0 pb-2">
                                    <div className="product-img-wrapper position-relative" style={{ height: '300px' }}>
                                        <img src={product.mainImg} className="w-100 h-100 object-fit-cover" alt={product.title} />
                                        {product.discount > 0 && (
                                            <div className="position-absolute top-0 end-0 m-3">
                                                <span className="badge bg-danger rounded-pill px-3 py-2 shadow-sm fw-bold">-{product.discount}% OFF</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="card-body d-flex flex-column px-4 pt-4">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <span className="text-primary fw-semibold small text-uppercase tracking-wider">{product.category}</span>
                                            <div className="d-flex text-warning">
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </div>
                                        
                                        <h5 className="card-title fw-bold fs-5 text-dark mb-2" title={product.title}>{product.title}</h5>
                                        <p className="card-text text-muted small flex-grow-1 text-truncate-2 mb-4">
                                            {product.description}
                                        </p>
                                        
                                        <div className="d-flex justify-content-between align-items-end mt-auto pt-3 border-top border-light">
                                            <div>
                                                <span className="fs-4 fw-bolder text-dark">${(product.price - (product.price * (product.discount / 100))).toFixed(2)}</span>
                                                {product.discount > 0 && (
                                                    <span className="text-muted ms-2 text-decoration-line-through small">${product.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <Link to={`/product/${product._id}`} className="btn btn-dark rounded-circle p-2 shadow-sm" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {/* Newsletter Section */}
            <div className="bg-primary text-white py-5 mt-5">
                <div className="container py-4">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-6">
                            <h2 className="fw-bolder mb-3">Join our newsletter</h2>
                            <p className="mb-4 text-white-50">Get exclusive offers, early access to new collections, and style tips straight to your inbox.</p>
                            <div className="input-group input-group-lg bg-white rounded-pill p-1 shadow-sm">
                                <input type="email" className="form-control border-0 rounded-pill bg-transparent px-4" placeholder="Enter your email address" />
                                <button className="btn btn-dark rounded-pill px-4 fw-bold" type="button">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
