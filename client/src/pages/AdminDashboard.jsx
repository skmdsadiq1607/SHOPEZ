import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit3, Plus, Package, Clipboard, DollarSign, Users } from 'lucide-react';

const AdminDashboard = () => {
    const { api, user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state for creating/editing product
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mainImg, setMainImg] = useState('');
    const [carousel, setCarousel] = useState('');
    const [category, setCategory] = useState('Electronics');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('0');
    const [sizes, setSizes] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            const [prodRes, ordRes] = await Promise.all([
                api.get('/api/products'),
                api.get('/api/orders/all')
            ]);
            setProducts(prodRes.data);
            setOrders(ordRes.data);
        } catch (err) {
            console.error('Failed to load admin data', err);
            setError('Unauthorized or error loading dashboard details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.usertype !== 'admin') {
            navigate('/');
            return;
        }
        loadData();
    }, [user, api, navigate]);

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        const carouselArray = carousel ? carousel.split(',').map(item => item.trim()) : [];
        const sizesArray = sizes ? sizes.split(',').map(item => item.trim()) : ['Standard'];

        const productData = {
            title,
            description,
            mainImg,
            carousel: carouselArray,
            category,
            price: parseFloat(price),
            discount: parseInt(discount),
            sizes: sizesArray
        };

        try {
            if (editingProductId) {
                await api.put(`/api/products/${editingProductId}`, productData);
                setSuccessMsg('Product updated successfully!');
            } else {
                await api.post('/api/products', productData);
                setSuccessMsg('Product created successfully!');
            }
            resetForm();
            loadData();
        } catch (err) {
            console.error(err);
            setError('Failed to save product. Please try again.');
        }
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setTitle(product.title);
        setDescription(product.description);
        setMainImg(product.mainImg);
        setCarousel(product.carousel ? product.carousel.join(', ') : '');
        setCategory(product.category);
        setPrice(product.price.toString());
        setDiscount(product.discount.toString());
        setSizes(product.sizes ? product.sizes.join(', ') : '');
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/api/products/${id}`);
            setSuccessMsg('Product deleted successfully.');
            loadData();
        } catch (err) {
            console.error(err);
            setError('Failed to delete product.');
        }
    };

    const resetForm = () => {
        setEditingProductId(null);
        setTitle('');
        setDescription('');
        setMainImg('');
        setCarousel('');
        setCategory('Electronics');
        setPrice('');
        setDiscount('0');
        setSizes('');
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    return (
        <div className="container mt-4 animate-fade-in">
            <h3 className="fw-bold text-dark font-secondary mb-4">Seller Dashboard</h3>

            {/* Quick Analytics Bar */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div className="bg-white p-3 rounded-3 border d-flex align-items-center justify-content-between shadow-sm">
                        <div>
                            <span className="text-muted small fw-semibold">Total Revenue</span>
                            <h4 className="fw-bold text-dark mb-0 mt-1">₹{Math.round(totalSales * 80).toLocaleString('en-IN')}</h4>
                        </div>
                        <div className="bg-primary-subtle text-primary rounded-circle p-2.5">
                            <DollarSign size={22} />
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white p-3 rounded-3 border d-flex align-items-center justify-content-between shadow-sm">
                        <div>
                            <span className="text-muted small fw-semibold">Total Orders</span>
                            <h4 className="fw-bold text-dark mb-0 mt-1">{orders.length}</h4>
                        </div>
                        <div className="bg-success-subtle text-success rounded-circle p-2.5">
                            <Package size={22} />
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white p-3 rounded-3 border d-flex align-items-center justify-content-between shadow-sm">
                        <div>
                            <span className="text-muted small fw-semibold">Total Listings</span>
                            <h4 className="fw-bold text-dark mb-0 mt-1">{products.length}</h4>
                        </div>
                        <div className="bg-warning-subtle text-warning rounded-circle p-2.5">
                            <Clipboard size={22} />
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="bg-white p-3 rounded-3 border d-flex align-items-center justify-content-between shadow-sm">
                        <div>
                            <span className="text-muted small fw-semibold">Customers</span>
                            <h4 className="fw-bold text-dark mb-0 mt-1">{[...new Set(orders.map(o => o.userId?._id || ''))].length}</h4>
                        </div>
                        <div className="bg-info-subtle text-info rounded-circle p-2.5">
                            <Users size={22} />
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger rounded-2 py-2.5 small mb-3">{error}</div>}
            {successMsg && <div className="alert alert-success rounded-2 py-2.5 small mb-3">{successMsg}</div>}

            {/* Tabs Navigation */}
            <div className="d-flex border-bottom gap-2 mb-4">
                <button
                    className={`btn py-2 px-3 fw-bold rounded-t-lg border-0 border-bottom border-3 ${activeTab === 'products' ? 'border-primary text-primary' : 'text-muted'}`}
                    onClick={() => setActiveTab('products')}
                >
                    Manage Products
                </button>
                <button
                    className={`btn py-2 px-3 fw-bold rounded-t-lg border-0 border-bottom border-3 ${activeTab === 'orders' ? 'border-primary text-primary' : 'text-muted'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Manage Orders ({orders.length})
                </button>
            </div>

            {/* TAB: PRODUCTS */}
            {activeTab === 'products' && (
                <div className="row g-4">
                    {/* Add/Edit Form */}
                    <div className="col-lg-4">
                        <div className="bg-white p-4 rounded-3 border shadow-sm">
                            <h5 className="fw-bold text-dark font-secondary border-bottom pb-2 mb-3">
                                {editingProductId ? 'Edit Product Listing' : 'Create New Product'}
                            </h5>
                            <form onSubmit={handleProductSubmit} className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label text-muted small fw-semibold">Product Title *</label>
                                    <input type="text" className="form-control bg-light form-control-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="form-label text-muted small fw-semibold">Description *</label>
                                    <textarea className="form-control bg-light form-control-sm" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                </div>
                                <div>
                                    <label className="form-label text-muted small fw-semibold">Main Image URL *</label>
                                    <input type="url" className="form-control bg-light form-control-sm" value={mainImg} onChange={(e) => setMainImg(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="form-label text-muted small fw-semibold">Carousel Images (comma-separated URLs)</label>
                                    <input type="text" className="form-control bg-light form-control-sm" value={carousel} onChange={(e) => setCarousel(e.target.value)} placeholder="url1, url2" />
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label className="form-label text-muted small fw-semibold">Category *</label>
                                        <select className="form-select bg-light form-select-sm" value={category} onChange={(e) => setCategory(e.target.value)} required>
                                            <option>Electronics</option>
                                            <option>Clothing</option>
                                            <option>Shoes</option>
                                            <option>Accessories</option>
                                            <option>Home & Kitchen</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label text-muted small fw-semibold">Sizes / Variants</label>
                                        <input type="text" className="form-control bg-light form-control-sm" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L" />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <label className="form-label text-muted small fw-semibold">Price (USD) *</label>
                                        <input type="number" step="0.01" className="form-control bg-light form-control-sm" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label text-muted small fw-semibold">Discount (%)</label>
                                        <input type="number" className="form-control bg-light form-control-sm" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-2">
                                    <button type="submit" className="btn btn-primary btn-sm flex-grow-1 fw-bold">{editingProductId ? 'Update Listing' : 'Publish Listing'}</button>
                                    {editingProductId && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>Cancel</button>}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Listings Table */}
                    <div className="col-lg-8">
                        <div className="bg-white rounded-3 border overflow-hidden shadow-sm">
                            <div className="table-responsive">
                                <table className="table align-middle mb-0 table-hover">
                                    <thead className="table-light text-muted small">
                                        <tr>
                                            <th>Image</th>
                                            <th>Product Info</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {products.map(prod => (
                                            <tr key={prod._id}>
                                                <td>
                                                    <img src={prod.mainImg} className="rounded border object-fit-cover" style={{ width: '45px', height: '45px' }} alt="" />
                                                </td>
                                                <td>
                                                    <span className="fw-semibold text-dark d-block text-truncate" style={{ maxWidth: '200px' }}>{prod.title}</span>
                                                    <span className="text-muted d-block text-truncate" style={{ maxWidth: '200px', fontSize: '11px' }}>{prod.description}</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary-subtle text-dark">{prod.category}</span>
                                                </td>
                                                <td>
                                                    <span className="fw-bold text-dark">₹{Math.round(prod.price * 80).toLocaleString('en-IN')}</span>
                                                    {prod.discount > 0 && <span className="text-danger d-block" style={{ fontSize: '10px' }}>{prod.discount}% Off</span>}
                                                </td>
                                                <td className="text-end">
                                                    <button className="btn btn-light btn-sm text-primary p-2 border rounded-circle shadow-sm me-2" onClick={() => handleEditClick(prod)}>
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button className="btn btn-light btn-sm text-danger p-2 border rounded-circle shadow-sm" onClick={() => handleDeleteClick(prod._id)}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: ORDERS */}
            {activeTab === 'orders' && (
                <div className="bg-white rounded-3 border overflow-hidden shadow-sm">
                    {orders.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-muted mb-0">No orders placed yet.</h5>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle mb-0 table-hover">
                                <thead className="table-light text-muted small">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer Info</th>
                                        <th>Items Purchased</th>
                                        <th>Total Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="small">
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td className="font-monospace text-muted">{order._id.substring(18)}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <span className="fw-semibold text-dark d-block">{order.userId?.name || 'Guest User'}</span>
                                                <span className="text-muted d-block" style={{ fontSize: '11px' }}>Ph: {order.mobile}</span>
                                                <span className="text-muted d-block text-truncate" style={{ fontSize: '11px', maxWidth: '200px' }}>Add: {order.shippingAddress}</span>
                                            </td>
                                            <td>
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="d-flex align-items-center gap-1.5 mb-1 text-muted" style={{ fontSize: '11px' }}>
                                                        <span className="fw-semibold text-dark">{item.title}</span> 
                                                        <span>x{item.quantity} ({item.size})</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td>
                                                <span className="fw-bold text-dark">₹{Math.round(order.totalAmount * 80).toLocaleString('en-IN')}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-success">{order.orderStatus}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
