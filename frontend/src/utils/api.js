import axios from 'axios';

// Since we are running microservices on different ports, we define them here.
// In production, an API Gateway would route these.
const USER_API = 'http://localhost:3001/api';
const RESTAURANT_API = 'http://localhost:3002/api';
const ORDER_API = 'http://localhost:3003/api';
const NOTIFICATION_API = 'http://localhost:3004/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
    login: (data) => axios.post(`${USER_API}/auth/login`, data),
    register: (data) => axios.post(`${USER_API}/auth/register`, data),
    getUser: (id) => axios.get(`${USER_API}/users/${id}`, { headers: getAuthHeaders() }),
};

export const restaurantAPI = {
    getRestaurants: () => axios.get(`${RESTAURANT_API}/restaurants`),
    getRestaurant: (id) => axios.get(`${RESTAURANT_API}/restaurants/${id}`),
    getMenu: (id) => axios.get(`${RESTAURANT_API}/restaurants/${id}/menu`),
};

export const orderAPI = {
    createOrder: (data) => axios.post(`${ORDER_API}/orders`, data, { headers: getAuthHeaders() }),
    getUserOrders: (userId) => axios.get(`${ORDER_API}/orders/${userId}`, { headers: getAuthHeaders() }),
};

export const notificationAPI = {
    getUserNotifications: (userId) => axios.get(`${NOTIFICATION_API}/notifications/${userId}`, { headers: getAuthHeaders() }),
};
