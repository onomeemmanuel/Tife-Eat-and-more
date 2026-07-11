import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const publicRoutes = ['/login', '/register', '/verify-otp'];
  const isPublicPage = publicRoutes.includes(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
    if (location.pathname !== '/checkout') {
      navigate('/checkout');
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: '#ffffff',
        boxShadow: '0 18px 50px rgba(15, 23, 42, 0.08)',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div
        onClick={() => navigate(user ? '/' : '/login')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <span style={{ fontSize: '22px' }}>🍽️</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>
            Tife<span style={{ color: '#e85d24' }}>Foods</span>
          </span>
          {user && !isPublicPage && (
            <span style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
              Welcome, <span style={{ color: '#111827', fontWeight: '700' }}>{user?.name?.split(' ')[0]}</span>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user && !isPublicPage ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCartClick}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '12px 18px',
                color: '#111827',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.07)'
              }}
            >
              🛒 Cart
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#fff',
                    color: '#e85d24',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/profile')}
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#111827',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              👤
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '10px 12px',
                color: '#6b7280',
                fontSize: '16px',
                cursor: 'pointer',
                lineHeight: 1
              }}
            >
              🚪
            </motion.button>
          </>
        ) : (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            style={{
              background: '#111827',
              border: 'none',
              borderRadius: '14px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isPublicPage ? 'Sign in' : 'Login'}
          </motion.button>
        )}
      </div>
      {user && !isPublicPage && (
        <button
          onClick={() => navigate('/chatbot')}
          style={{
            position: 'fixed',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '58px',
            height: '58px',
            border: 'none',
            borderRadius: '30px 0 0 30px',
            background: '#e85d24',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 24px 60px rgba(232, 93, 36, 0.2)',
            zIndex: 110
          }}
        >
          <span style={{ fontSize: '24px', lineHeight: 1 }}>
            💬
          </span>
        </button>
      )}
    </motion.nav>
  );
};

export default Navbar;