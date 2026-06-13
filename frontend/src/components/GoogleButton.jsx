import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

const GoogleButton = () => {
  const apiBase = import.meta.env.VITE_API_URL || '';

  const handleClick = () => {
    window.location.href = `${apiBase}/api/auth/google`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      style={{
        width: '100%',
        padding: '14px',
        background: '#1a1a1a',
        border: '1.5px solid #333',
        borderRadius: '14px',
        color: '#fff',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'border-color 0.2s'
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#e85d24'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
    >
      <FcGoogle size={22} />
      Continue with Google
    </motion.button>
  );
};

export default GoogleButton;