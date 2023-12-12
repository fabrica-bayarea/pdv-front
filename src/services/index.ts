import axios from "axios";

export const http = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

export const httpTeste = axios.create({
    baseURL: 'http://localhost:3004',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
   
    if (config.url !== '/auth/login' && token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});
