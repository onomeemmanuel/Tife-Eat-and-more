import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true
});

export const placeOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);