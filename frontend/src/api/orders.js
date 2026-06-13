import API from './auth';

export const placeOrder = (orderData) => API.post('/orders', orderData);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
