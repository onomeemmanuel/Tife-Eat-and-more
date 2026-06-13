import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const MENU_ITEMS = [
    { icon: '📋', label: 'My Orders', action: () => navigate('/orders') },
    { icon: '📍', label: 'Saved Addresses', action: () => {} },
    { icon: '💳', label: 'Payment Methods', action: () => {} },
    { icon: '🔔', label: 'Notifications', action: () => {} },
    { icon: '❓', label: 'Help & Support', action: () => {} },
  ];

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      paddingBottom: '100px'
    }}>
      {/* Header */}
      <div style={{
        padding: '56px 24px 32px',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '16px'
          }}
        >
          {/* Avatar */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            style={{
              width: '72px', height: '72px',
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '2px solid #e85d24',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '32px',
              flexShrink: 0
            }}
          >
            {user?.avatar
              ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '👤'
            }
          </motion.div>

          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{user?.name}</h2>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '2px' }}>{user?.email}</p>
            <span style={{
              fontSize: '11px', fontWeight: '700',
              background: '#1a0a00', color: '#e85d24',
              padding: '3px 10px', borderRadius: '20px',
              marginTop: '6px', display: 'inline-block'
            }}>
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Menu items */}
      <div style={{ padding: '20px 24px' }}>
        {MENU_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={item.action}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px',
              background: '#161616',
              border: '1px solid #2a2a2a',
              borderRadius: '16px',
              marginBottom: '10px',
              cursor: 'pointer',
              transition: 'border-color 0.2s'
            }}
            whileHover={{ borderColor: '#e85d24' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: '600' }}>{item.label}</span>
            </div>
            <span style={{ color: '#555', fontSize: '18px' }}>›</span>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            width: '100%', padding: '18px',
            background: '#1a0000',
            border: '1px solid #3a0000',
            borderRadius: '16px',
            color: '#ef4444', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer',
            marginTop: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            gap: '8px'
          }}
        >
          🚪 Logout
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;