import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const { api, user, fetchCartCount } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchVal = searchParams.get('search') || '';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error('Fetch products error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [api]);

    const handleAddToCart = async (product, e) => {
        e.preventDefault();
        e.stopPropagation();

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
                quantity: 1,
                size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard',
                price: product.price,
                discount: product.discount
            });
            await fetchCartCount();

            const btn = e.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Added! ✓';
            btn.classList.add('bg-success');
            btn.style.color = 'white';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('bg-success');
                btn.style.color = '';
            }, 1500);

        } catch (err) {
            console.error('Error adding to cart', err);
        }
    };

    // Filter products by category & search
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = !searchVal || 
            product.title.toLowerCase().includes(searchVal.toLowerCase()) || 
            product.description.toLowerCase().includes(searchVal.toLowerCase()) || 
            product.category.toLowerCase().includes(searchVal.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const categories = ['All', 'Electronics', 'Clothing', 'Shoes', 'Accessories', 'Home & Kitchen'];

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        </div>
    );

    return (
        <div className="pb-4">
            {/* Category Quick Links Slider */}
            <div className="bg-white border-bottom py-2 overflow-x-auto">
                <div className="container d-flex gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-link border-0 ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Promo Carousel */}
            <div id="promoCarousel" className="carousel slide mt-3 px-2 px-md-3" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="2"></button>
                </div>
                <div className="carousel-inner shadow-sm rounded-3" style={{ maxHeight: '350px' }}>
                    <div className="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 1" style={{ maxHeight: '350px' }} />
                        <div className="carousel-caption d-none d-md-block text-start" style={{ right: '50%', paddingBottom: '3rem' }}>
                            <h2 className="display-4 fw-bold text-white shadow-sm">Big Billion Sale</h2>
                            <p className="fs-4 text-white shadow-sm">Up to 80% off on Electronics & Fashion</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 2" style={{ maxHeight: '350px' }} />
                        <div className="carousel-caption d-none d-md-block text-start" style={{ right: '50%', paddingBottom: '3rem' }}>
                            <h2 className="display-4 fw-bold text-white shadow-sm">Exclusive Collections</h2>
                            <p className="fs-4 text-white shadow-sm">Step up your style with the latest trends</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 3" style={{ maxHeight: '350px' }} />
                        <div className="carousel-caption d-none d-md-block text-start" style={{ right: '50%', paddingBottom: '3rem' }}>
                            <h2 className="display-4 fw-bold text-white shadow-sm">Smart Home Upgrade</h2>
                            <p className="fs-4 text-white shadow-sm">Revamp your kitchen and living space</p>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#promoCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#promoCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Main Products Grid */}
            <div className="container-fluid px-2 px-md-3 mt-4">
                <div className="category-section rounded-3">
                    <div className="section-header">
                        <h2 className="section-title">
                            {searchVal ? `Search Results for "${searchVal}"` : `${selectedCategory} Products`}
                        </h2>
                        <span className="text-muted small fw-semibold">{filteredProducts.length} Items</span>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-5">
                            <h4 className="text-muted">No products found</h4>
                            <p className="text-muted small">Try checking another category or refining your search term.</p>
                        </div>
                    ) : (
                        <div className="row g-3">
                            {filteredProducts.map(product => {
                                const discountedPrice = product.price - (product.price * (product.discount / 100));
                                return (
                                    <div key={product._id} className="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 animate-fade-in">
                                        <div className="store-card position-relative">
                                            {product.discount > 0 && (
                                                <div className="position-absolute top-0 start-0 m-2 z-1">
                                                    <span className="badge bg-danger rounded-1 shadow-sm px-2 py-1">
                                                        {product.discount}% OFF
                                                    </span>
                                                </div>
                                            )}
                                            <Link to={`/product/${product._id}`} className="text-decoration-none text-dark flex-grow-1 d-flex flex-column">
                                                <img src={product.mainImg} className="store-card-img w-100" alt={product.title} />
                                                <div className="p-3 flex-grow-1 d-flex flex-column justify-content-between">
                                                    <div>
                                                        <div className="store-card-title">{product.title}</div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="badge bg-success rounded-1 px-1.5 py-0.5 d-flex align-items-center me-2" style={{ fontSize: '11px' }}>
                                                                4.5 <Star size={10} className="ms-1" fill="white" />
                                                            </span>
                                                            <span className="text-muted small">({Math.floor(Math.random() * 2000) + 150})</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="d-flex align-items-baseline gap-2 mb-3">
                                                            <span className="store-card-price">${discountedPrice.toFixed(2)}</span>
                                                            {product.discount > 0 && (
                                                                <span className="store-card-old-price">${product.price.toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            className="add-to-cart-btn d-flex justify-content-center align-items-center"
                                                            onClick={(e) => handleAddToCart(product, e)}
                                                        >
                                                            <ShoppingCart size={16} className="me-2" /> Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
