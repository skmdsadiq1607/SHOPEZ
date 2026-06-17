import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
    });

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
            console.error(err);
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const fetchCartCount = async () => {
        try {
            const res = await api.get('/api/cart');
            const totalItems = res.data.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalItems);
        } catch (err) {
            console.error(err);
        }
    };

    const login = async (email, password) => {
        const res = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        fetchCartCount();
    };

    const register = async (userData) => {
        const res = await api.post('/api/auth/register', userData);
        localStorage.setItem('token', res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        fetchCartCount();
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
