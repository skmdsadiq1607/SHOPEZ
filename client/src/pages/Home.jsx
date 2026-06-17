import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ChevronRight } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { api, user, fetchCartCount } = useAuth();
    const navigate = useNavigate();

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
                size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
                price: product.price,
                discount: product.discount
            });
            fetchCartCount();
            
            // Show a quick visual feedback (could be replaced with react-toastify)
            const btn = e.currentTarget;
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Added! ✓';
            btn.classList.replace('add-to-cart-btn', 'btn-success');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace('btn-success', 'add-to-cart-btn');
            }, 1500);
            
        } catch (err) {
            console.error('Error adding to cart', err);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status"></div>
        </div>
    );

    // Group products by category for the Flipkart style layout
    const electronics = products.filter(p => p.category === 'Electronics');
    const clothingAndAcc = products.filter(p => p.category === 'Clothing' || p.category === 'Accessories' || p.category === 'Shoes');
    const home = products.filter(p => p.category === 'Home & Kitchen');

    const renderProductGrid = (productList, title, subtitle) => {
        if (productList.length === 0) return null;
        
        return (
            <div className="category-section rounded-1">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">{title}</h2>
                        {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
                    </div>
                    <button className="btn view-all-btn d-flex align-items-center">
                        VIEW ALL <ChevronRight size={16} className="ms-1" />
                    </button>
                </div>
                
                <div className="row g-3">
                    {productList.slice(0, 5).map(product => (
                        <div key={product._id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl">
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
                                    <div className="p-3 pt-0 flex-grow-1 d-flex flex-column">
                                        <div className="store-card-title">{product.title}</div>
                                        <div className="d-flex align-items-center mb-1">
                                            <span className="badge bg-success rounded-1 px-1 py-0 d-flex align-items-center me-2" style={{ fontSize: '11px' }}>
                                                4.5 <Star size={10} className="ms-1" fill="white" />
                                            </span>
                                            <span className="text-muted small">(1,245)</span>
                                        </div>
                                        
                                        <div className="mt-auto pt-2">
                                            <div className="d-flex align-items-baseline gap-2 mb-2">
                                                <span className="store-card-price">${(product.price - (product.price * (product.discount / 100))).toFixed(2)}</span>
                                                {product.discount > 0 && (
                                                    <span className="store-card-old-price">${product.price.toFixed(2)}</span>
                                                )}
                                            </div>
                                            <button 
                                                className="btn add-to-cart-btn d-flex justify-content-center align-items-center"
                                                onClick={(e) => handleAddToCart(product, e)}
                                            >
                                                <ShoppingCart size={16} className="me-2" /> Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="pb-4">
            {/* Promo Carousel */}
            <div id="promoCarousel" className="carousel slide mt-2 px-2 px-md-3" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="2"></button>
                </div>
                <div className="carousel-inner shadow-sm rounded-1" style={{ maxHeight: '350px' }}>
                    <div className="carousel-item active">
                        <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 1" style={{ maxHeight: '350px' }} />
                        <div className="carousel-caption d-none d-md-block text-start" style={{ right: '50%', paddingBottom: '3rem' }}>
                            <h2 className="display-4 fw-bold text-white shadow-sm">Big Billion Sale</h2>
                            <p className="fs-4 text-white shadow-sm">Up to 80% off on Electronics</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 2" style={{ maxHeight: '350px' }} />
                    </div>
                    <div className="carousel-item">
                        <img src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&q=80&w=2000&h=600" className="d-block w-100 object-fit-cover" alt="Sale 3" style={{ maxHeight: '350px' }} />
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

            <div className="container-fluid px-2 px-md-3">
                {/* Category Sections */}
                {renderProductGrid(electronics, "Best of Electronics", "Devices and Accessories")}
                {renderProductGrid(clothingAndAcc, "Trending in Fashion", "Apparel, Shoes & Watches")}
                {renderProductGrid(home, "Home & Kitchen Essentials", "Top Rated Appliances")}
                {renderProductGrid(products, "Deals of the Day", "Hurry, offers end soon!")}
            </div>
            
            {/* Mega Footer Banner */}
            <div className="container-fluid px-2 px-md-3 mt-4">
                <div className="row g-2">
                    <div className="col-md-4">
                        <img src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=300&fit=crop" className="img-fluid rounded-1 w-100" alt="Promo" />
                    </div>
                    <div className="col-md-4">
                        <img src="https://images.unsplash.com/photo-1607083206869-4c7672072395?w=500&h=300&fit=crop" className="img-fluid rounded-1 w-100" alt="Promo" />
                    </div>
                    <div className="col-md-4">
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&h=300&fit=crop" className="img-fluid rounded-1 w-100" alt="Promo" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
