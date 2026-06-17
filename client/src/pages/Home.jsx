import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

    return (
        <div className="container mt-4 mb-5">
            <div className="text-center mb-5">
                <h1 className="fw-bolder display-4 text-primary">Discover the Best Products</h1>
                <p className="lead text-muted">ShopEZ boasts an extensive catalog of products, offering a diverse range of items.</p>
            </div>
            
            <div className="row g-4">
                {products.length === 0 ? (
                    <div className="col-12 text-center text-muted">
                        <h4>No products available right now. Check back later!</h4>
                    </div>
                ) : (
                    products.map(product => (
                        <div key={product._id} className="col-md-4 col-lg-3">
                            <div className="card h-100 border-0 shadow-sm product-card rounded-4 overflow-hidden">
                                <img src={product.mainImg} className="card-img-top" alt={product.title} style={{ height: '250px', objectFit: 'cover' }} />
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold text-truncate" title={product.title}>{product.title}</h5>
                                    <p className="card-text text-muted small flex-grow-1 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {product.description}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="fs-5 fw-bolder text-success">${product.price.toFixed(2)}</span>
                                        {product.discount > 0 && (
                                            <span className="badge bg-danger">-{product.discount}% OFF</span>
                                        )}
                                    </div>
                                    <Link to={`/product/${product._id}`} className="btn btn-primary w-100 fw-bold rounded-3">Shop Now</Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
