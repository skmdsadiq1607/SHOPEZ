import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const { user, api } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mainImg: '',
        category: '',
        price: '',
        discount: '0',
        sizes: '',
        gender: ''
    });

    if (!user || user.usertype !== 'admin') {
        return <div className="text-center mt-5"><h3>Access Denied. Admin only.</h3></div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                discount: Number(formData.discount),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s)
            };
            
            await api.post('/api/products', productData);
            setMessage('Product added successfully!');
            setFormData({
                title: '', description: '', mainImg: '', category: '', price: '', discount: '0', sizes: '', gender: ''
            });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow border-0 rounded-4 p-4">
                        <div className="card-body">
                            <h2 className="fw-bolder mb-4 text-primary border-bottom pb-3">Admin Dashboard: Add Product</h2>
                            {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Product Title</label>
                                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Description</label>
                                    <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange} required></textarea>
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Main Image URL</label>
                                    <input type="url" className="form-control" name="mainImg" value={formData.mainImg} onChange={handleChange} required />
                                </div>
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Category</label>
                                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Shoes, T-Shirts" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Gender</label>
                                        <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">Select...</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Unisex">Unisex</option>
                                            <option value="Kids">Kids</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Price ($)</label>
                                        <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Discount (%)</label>
                                        <input type="number" className="form-control" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Sizes (comma separated)</label>
                                    <input type="text" className="form-control" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="S, M, L, XL" />
                                </div>
                                
                                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={loading}>
                                    {loading ? 'Adding...' : 'Add Product'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
