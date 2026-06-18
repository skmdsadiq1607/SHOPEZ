import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user, fetchCartCount } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/products/${id}`);
                setProduct(res.data);
                setActiveImage(res.data.mainImg);
                if (res.data.sizes && res.data.sizes.length > 0) {
                    setSelectedSize(res.data.sizes[0]);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details.');
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
                quantity: quantity,
                size: selectedSize || 'Standard',
                price: product.price,
                discount: product.discount
            });
            await fetchCartCount();
            navigate('/cart');
        } catch (err) {
            console.error('Error adding to cart', err);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    if (error || !product) return (
        <div className="container mt-5 text-center">
            <h4 className="text-danger">{error || 'Product not found'}</h4>
            <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );

    const discountedPrice = product.price - (product.price * (product.discount / 100));

    return (
        <div className="container mt-4 animate-fade-in">
            <button className="btn btn-link text-decoration-none text-muted d-flex align-items-center gap-1 mb-4 p-0" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            <div className="row g-4 bg-white p-4 rounded-3 border">
                {/* Images Column */}
                <div className="col-md-6">
                    <div className="d-flex flex-column gap-3">
                        <div className="border rounded-3 overflow-hidden bg-light" style={{ maxHeight: '450px' }}>
                            <img src={activeImage} className="w-100 h-100 object-fit-contain" alt={product.title} style={{ minHeight: '350px' }} />
                        </div>
                        {product.carousel && product.carousel.length > 0 && (
                            <div className="d-flex gap-2 overflow-x-auto pb-2">
                                <img
                                    src={product.mainImg}
                                    className={`img-thumbnail object-fit-cover rounded-2 cursor-pointer ${activeImage === product.mainImg ? 'border-primary border-2' : ''}`}
                                    alt="Thumbnail main"
                                    style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                    onClick={() => setActiveImage(product.mainImg)}
                                />
                                {product.carousel.map((imgUrl, idx) => (
                                    <img
                                        key={idx}
                                        src={imgUrl}
                                        className={`img-thumbnail object-fit-cover rounded-2 cursor-pointer ${activeImage === imgUrl ? 'border-primary border-2' : ''}`}
                                        alt={`Thumbnail ${idx}`}
                                        style={{ width: '80px', height: '80px', cursor: 'pointer' }}
                                        onClick={() => setActiveImage(imgUrl)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Column */}
                <div className="col-md-6 d-flex flex-column justify-content-between">
                    <div>
                        <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1.5 rounded-pill fw-semibold">{product.category}</span>
                        <h2 className="fw-bold text-dark font-secondary mb-3">{product.title}</h2>
                        
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <span className="badge bg-success px-2 py-1 d-flex align-items-center gap-1">
                                4.5 <Star size={12} fill="white" />
                            </span>
                            <span className="text-muted small fw-semibold">1.2k Ratings & 340 Reviews</span>
                        </div>

                        <div className="d-flex align-items-baseline gap-3 mb-4">
                            <span className="fs-2 fw-bold text-dark">${discountedPrice.toFixed(2)}</span>
                            {product.discount > 0 && (
                                <>
                                    <span className="text-decoration-line-through text-muted fs-5">${product.price.toFixed(2)}</span>
                                    <span className="text-danger fw-bold fs-5">({product.discount}% OFF)</span>
                                </>
                            )}
                        </div>

                        <hr className="my-4 text-muted" />

                        <p className="text-muted leading-relaxed mb-4">{product.description}</p>

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-4">
                                <h6 className="fw-bold text-dark mb-2">Select Size / Variant</h6>
                                <div className="d-flex gap-2">
                                    {product.sizes.map(sz => (
                                        <button
                                            key={sz}
                                            className={`btn btn-sm rounded-2 px-3 py-2 ${selectedSize === sz ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            onClick={() => setSelectedSize(sz)}
                                        >
                                            {sz}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-dark mb-2">Quantity</h6>
                            <div className="d-flex align-items-center gap-2" style={{ maxWidth: '140px' }}>
                                <button className="btn btn-outline-secondary px-3" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" className="form-control text-center bg-white" value={quantity} readOnly />
                                <button className="btn btn-outline-secondary px-3" onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-lg w-100 py-3 mt-4 d-flex align-items-center justify-content-center gap-2 shadow-sm fw-bold" onClick={handleAddToCart}>
                        <ShoppingCart size={20} /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
