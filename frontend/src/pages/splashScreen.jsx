import { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#0f0f0f',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999
      }}
    >
      {/* Glowing circle behind logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '140px', height: '140px',
          background: 'radial-gradient(circle, #e85d2440 0%, transparent 70%)',
          borderRadius: '50%',
          position: 'absolute'
        }}
      />

      {/* Burger icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
        style={{ fontSize: '72px', zIndex: 1, marginBottom: '20px' }}
      >
        🍔
      </motion.div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        style={{
          fontSize: '38px', fontWeight: '900',
          letterSpacing: '-1px', zIndex: 1
        }}
      >
        Food<span style={{ color: '#e85d24' }}>Rush</span>
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{
          color: '#555', fontSize: '15px',
          marginTop: '10px', zIndex: 1
        }}
      >
        Hot food. Fast delivery. 🔥
      </motion.p>

      {/* Loading bar */}
      <motion.div
        style={{
          position: 'absolute', bottom: '60px',
          width: '120px', height: '3px',
          background: '#2a2a2a', borderRadius: '99px',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ delay: 0.8, duration: 1.6, ease: 'easeInOut' }}
          style={{
            height: '100%', width: '100%',
            background: '#e85d24',
            borderRadius: '99px'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;