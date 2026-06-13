import { useEffect, useState } from 'react';
import API from '../api/auth';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/my-orders');
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div style={{padding:40,color:'#fff'}}>Loading orders...</div>;

  return (
    <div style={{ paddingTop: 84, minHeight: '100vh', background: '#0f0f0f', color: '#fff' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        <h2 style={{ marginBottom: 16 }}>My Orders</h2>
        {orders.length === 0 ? (
          <p style={{ color: '#999' }}>You have no orders yet.</p>
        ) : (
          orders.map(o => (
            <motion.div key={o._id} style={{ background: '#161616', border: '1px solid #2a2a2a', borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Order #{o._id.slice(-6)}</strong>
                  <div style={{ color: '#999', fontSize: 13 }}>{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#e85d24', fontWeight: 700 }}>₦{(o.totalAmount/100).toFixed(2)}</div>
                  <div style={{ color: '#999', fontSize: 13 }}>{o.status}</div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                {o.items.map(item => (
                  <div key={item._id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                    <img src={item.image} alt={item.name} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ color: '#999', fontSize: 13 }}>{item.quantity} × ₦{(item.price/100).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
