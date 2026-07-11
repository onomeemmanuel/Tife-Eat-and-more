import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import API from '../api/auth';

const FALLBACK_FEATURED = [
  {
    _id: 'fallback-burger',
    name: 'Classic Smash Burger',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    description: 'Double smash patty, cheddar, pickles, special sauce'
  },
  {
    _id: 'fallback-pizza',
    name: 'Pepperoni Pizza',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    description: 'Loaded pepperoni, mozzarella, tomato base'
  },
  {
    _id: 'fallback-chicken',
    name: 'Crispy Fried Chicken',
    price: 3800,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    description: '3 pieces seasoned crispy chicken, coleslaw'
  }
];

const FeaturedCarousel = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true, dragFree: true,
    align: 'start'
  });
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    API.get('/foods/featured')
      .then(({ data }) => {
        const list = Array.isArray(data?.foods) ? data.foods : [];
        setFeatured(list.length ? list : FALLBACK_FEATURED);
      })
      .catch(() => setFeatured(FALLBACK_FEATURED));
  }, []);

  if (!featured.length) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '16px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827' }}>
          🔥 Featured
        </h2>
        <span style={{ fontSize: '13px', color: '#6b7280', cursor: 'pointer' }}>
          See all →
        </span>
      </div>

      <div ref={emblaRef} style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {featured.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                flex: '0 0 260px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: '100%', height: '140px',
                  objectFit: 'cover'
                }}
              />
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>
                  {item.name}
                </p>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginTop: '10px'
                }}>
                  <span style={{
                    fontSize: '17px', fontWeight: '800', color: '#e85d24'
                  }}>
                    ₦{item.price.toLocaleString()}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(item)}
                    style={{
                      background: '#e85d24', border: 'none',
                      borderRadius: '8px', padding: '8px 14px',
                      color: '#fff', fontSize: '13px',
                      fontWeight: '600', cursor: 'pointer'
                    }}
                  >
                    + Add
                  </motion.button>
                </div>
              </div>

              {/* Featured badge */}
              <div style={{
                position: 'absolute', top: '10px', left: '10px',
                background: '#e85d24',
                borderRadius: '6px', padding: '3px 8px',
                fontSize: '10px', fontWeight: '700', color: '#fff'
              }}>
                ⭐ FEATURED
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;