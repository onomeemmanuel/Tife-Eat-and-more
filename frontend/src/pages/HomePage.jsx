import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f0f0f'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center' }}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🍔</div>
        <h1 style={{ fontSize: '32px', fontWeight: '700' }}>
          Welcome, <span style={{ color: '#e85d24' }}>{user?.name}</span>!
        </h1>
        <p style={{ color: '#666', marginTop: '8px' }}>
          Auth is working. Next step — build the menu!
        </p>
        <button
          onClick={handleLogout}
          style={{
            marginTop: '24px', padding: '12px 28px',
            background: '#e85d24', border: 'none',
            borderRadius: '12px', color: '#fff',
            fontSize: '15px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default HomePage;