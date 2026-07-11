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
        background: 'rgba(15,15,15,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a2a',
        padding: '0 16px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div
        onClick={() => navigate(user ? '/' : '/login')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ fontSize: '22px' }}>🍔</span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{ fontSize: '18px', fontWeight: '700' }}>
            Tife<span style={{ color: '#e85d24' }}>Food</span>
          </span>
          {user && !isPublicPage && (
            <span style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
              Hey, <span style={{ color: '#e85d24', fontWeight: '600' }}>{user?.name?.split(' ')[0]}</span>
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {user && !isPublicPage ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCartClick}
              style={{
                position: 'relative',
                background: '#e85d24',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
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
                background: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '8px 10px',
                color: '#fff',
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
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '8px 10px',
                color: '#666',
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
              background: '#e85d24',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 12px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {isPublicPage ? 'Sign in' : 'Login'}
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;