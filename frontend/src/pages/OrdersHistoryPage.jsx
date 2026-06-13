import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../api/orders';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

const STATUS_COLORS = {
  pending:   { bg: '#1a1500', text: '#f59e0b' },
  confirmed: { bg: '#001a14', text: '#10b981' },
  preparing: { bg: '#1a0a00', text: '#e85d24' },
  picked_up: { bg: '#001020', text: '#3b82f6' },
  delivered: { bg: '#0d1a0d', text: '#4ade80' },
  cancelled: { bg: '#1a0000', text: '#ef4444' }
};

const OrdersHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{
        padding: '56px 24px 20px',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800' }}>My Orders</h1>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div style={{ padding: '20px 24px' }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              style={{
                height: '100px', background: '#1a1a1a',
                borderRadius: '16px', marginBottom: '12px'
              }}
            />
          ))
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center', marginTop: '100px',
            color: '#444'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📋</div>
            <p style={{ fontSize: '17px', fontWeight: '600' }}>No orders yet</p>
            <p style={{ fontSize: '14px', marginTop: '8px', marginBottom: '24px' }}>
              Your order history will appear here
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              style={{
                background: '#e85d24', border: 'none',
                borderRadius: '14px', padding: '14px 28px',
                color: '#fff', fontSize: '15px',
                fontWeight: '600', cursor: 'pointer'
              }}
            >
              Order food now 🍔
            </motion.button>
          </div>
        ) : (
          orders.map((order, i) => {
            const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/track/${order._id}`)}
                style={{
                  background: '#161616',
                  border: '1px solid #2a2a2a',
                  borderRadius: '18px',
                  padding: '18px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s'
                }}
                whileHover={{ borderColor: '#e85d24' }}
              >
                {/* Top row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '12px'
                }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700' }}>
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span style={{
                    background: colors.bg,
                    color: colors.text,
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px', fontWeight: '700',
                    textTransform: 'capitalize'
                  }}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Item images */}
                <div style={{
                  display: 'flex', gap: '6px', marginBottom: '12px'
                }}>
                  {order.items.slice(0, 4).map((item, j) => (
                    <img
                      key={j}
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '44px', height: '44px',
                        borderRadius: '10px', objectFit: 'cover',
                        border: '1px solid #2a2a2a'
                      }}
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div style={{
                      width: '44px', height: '44px',
                      borderRadius: '10px',
                      background: '#2a2a2a',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px', color: '#888', fontWeight: '600'
                    }}>
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* Bottom row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#555', fontSize: '13px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <span style={{
                    color: '#e85d24', fontWeight: '800', fontSize: '16px'
                  }}>
                    ₦{((order.totalAmount || 0) + 500).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default OrdersHistoryPage;