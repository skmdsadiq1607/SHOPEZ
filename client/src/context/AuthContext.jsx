import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Create Axios instance outside to prevent state rerender from wiping defaults
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const res = await api.get('/api/auth/me');
            setUser(res.data);
            fetchCartCount();
        } catch (err) {
            console.error('Fetch user failed', err);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const fetchCartCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setCartCount(0);
                return;
            }
            const res = await api.get('/api/cart');
            const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalItems);
        } catch (err) {
            console.error('Error fetching cart count', err);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        await fetchCartCount();
    };

    const register = async (userData) => {
        const res = await api.post('/api/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        await fetchCartCount();
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setCartCount(0);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, api, cartCount, fetchCartCount }}>
            {children}
        </AuthContext.Provider>
    );
};
