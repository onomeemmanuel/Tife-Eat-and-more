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

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 100, background: 'rgba(15,15,15,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2a2a2a',
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ fontSize: '24px' }}>🍔</span>
        <span style={{ fontSize: '20px', fontWeight: '700' }}>
          Tife<span style={{ color: '#e85d24' }}>Food</span>
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user && !isPublicPage && (
          <>
            {/* User greeting */}
            <span style={{ color: '#666', fontSize: '14px' }}>
              Hey, <span style={{ color: '#fff', fontWeight: '600' }}>{user?.name?.split(' ')[0]}</span>
            </span>

            {/* Cart button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/checkout')}
              style={{
                position: 'relative',
                background: '#e85d24',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 18px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🛒 Cart
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '-8px', right: '-8px',
                    background: '#fff',
                    color: '#e85d24',
                    borderRadius: '50%',
                    width: '20px', height: '20px',
                    fontSize: '11px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '10px',
                padding: '8px 14px',
                color: '#666',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;