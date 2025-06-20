import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
});

//request interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log(token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers.withCredentials = true;
        }
        console.log(JSON.stringify(config));
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;