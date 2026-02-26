import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect if it's a 401 and NOT from an auth route (login/register)
        const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/register');

        if (error.response && error.response.status === 401 && !isAuthRoute) {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
