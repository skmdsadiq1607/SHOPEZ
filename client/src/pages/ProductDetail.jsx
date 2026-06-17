import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const { api, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
                if (res.data.sizes && res.data.sizes.length > 0) {
                    setSelectedSize(res.data.sizes[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, api]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        try {
            await api.post('/api/cart', {
                productId: product._id,
                title: product.title,
                description: product.description,
                mainImg: product.mainImg,
                quantity: parseInt(quantity),
                size: selectedSize,
                price: product.price,
                discount: product.discount
            });
            setMessage('Added to cart successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error adding to cart');
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (!product) return <div className="text-center mt-5"><h3>Product not found</h3></div>;

    const discountedPrice = product.price - (product.price * (product.discount / 100));

    return (
        <div className="container mt-5 mb-5">
            {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`} role="alert">
                {message}
                <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
            </div>}
            
            <div className="row">
                <div className="col-md-6 mb-4">
                    <img src={product.mainImg} alt={product.title} className="img-fluid rounded-4 shadow" style={{ width: '100%', objectFit: 'cover', maxHeight: '500px' }} />
                </div>
                <div className="col-md-6">
                    <h2 className="fw-bolder display-5">{product.title}</h2>
                    <p className="text-muted fs-5">{product.category} {product.gender && `• ${product.gender}`}</p>
                    
                    <div className="d-flex align-items-center mb-3">
                        <h3 className="fw-bold text-primary mb-0 me-3">${discountedPrice.toFixed(2)}</h3>
                        {product.discount > 0 && (
                            <span className="text-muted text-decoration-line-through fs-5">${product.price.toFixed(2)}</span>
                        )}
                        {product.discount > 0 && (
                            <span className="badge bg-danger ms-2">{product.discount}% OFF</span>
                        )}
                    </div>
                    
                    <p className="lead">{product.description}</p>
                    
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-4">
                            <label className="fw-bold mb-2">Size</label>
                            <div className="d-flex gap-2 flex-wrap">
                                {product.sizes.map(size => (
                                    <button 
                                        key={size}
                                        className={`btn ${selectedSize === size ? 'btn-dark' : 'btn-outline-dark'} rounded-circle`}
                                        style={{ width: '50px', height: '50px' }}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="row g-3 align-items-end mb-4">
                        <div className="col-4 col-md-3">
                            <label className="fw-bold mb-2">Quantity</label>
                            <input 
                                type="number" 
                                className="form-control form-control-lg text-center bg-light border-0" 
                                value={quantity} 
                                min="1" 
                                onChange={(e) => setQuantity(e.target.value)} 
                            />
                        </div>
                        <div className="col-8 col-md-9">
                            <button className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center py-3 rounded-3 shadow" onClick={handleAddToCart}>
                                <ShoppingCart className="me-2" /> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
