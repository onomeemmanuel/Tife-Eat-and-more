import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const FoodCard = ({ item, index }) => {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        background: '#161616',
        border: '1px solid #2a2a2a',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img
          src={imgError ? 'https://via.placeholder.com/400x180?text=🍔' : item.image}
          alt={item.name}
          onError={() => setImgError(true)}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* Category badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '11px', fontWeight: '600',
          color: '#e85d24'
        }}>
          {item.category}
        </div>
        {/* Rating */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '12px', fontWeight: '600',
          color: '#fff'
        }}>
          ⭐ {item.rating}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>
          {item.name}
        </h3>
        <p style={{
          fontSize: '13px', color: '#666',
          marginBottom: '12px', lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {item.description}
        </p>

        {/* Prep time */}
        <p style={{ fontSize: '12px', color: '#555', marginBottom: '14px' }}>
          🕐 {item.prepTime}
        </p>

        {/* Price + Add button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#e85d24' }}>
            ₦{item.price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => addToCart(item)}
            style={{
              background: '#e85d24',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;