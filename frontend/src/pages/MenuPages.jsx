import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Chicken', 'Sides', 'Drinks', 'Desserts'];

const MenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchFoods = async (category) => {
    setLoading(true);
    try {
      const url = category === 'All'
        ? '/api/foods'
        : `/api/foods?category=${category}`;
      const { data } = await axios.get(url, { withCredentials: true });
      setFoods(data.foods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(activeCategory); }, [activeCategory]);

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
      <Navbar />
      <CartSidebar />

      <div style={{ paddingTop: '80px', maxWidth: '1200px', margin: '0 auto', padding: '80px 24px 40px' }}>

        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 100%)',
            border: '1px solid #3a1a00',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#e85d24', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              🔥 Hot & Fresh
            </p>
            <h1 style={{ fontSize: '36px', fontWeight: '800', lineHeight: '1.2', marginBottom: '12px' }}>
              Delicious food,<br />
              <span style={{ color: '#e85d24' }}>delivered fast</span>
            </h1>
            <p style={{ color: '#888', fontSize: '15px' }}>
              Order now and get it at your door in 30 mins
            </p>
          </div>
          <div style={{
            position: 'absolute', right: '40px', top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '80px', opacity: 0.3
          }}>
            🍔
          </div>
        </motion.div>

        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: '10px',
          overflowX: 'auto', paddingBottom: '8px',
          marginBottom: '28px',
          scrollbarWidth: 'none'
        }}>
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '10px 20px',
                background: activeCategory === cat ? '#e85d24' : '#1a1a1a',
                border: `1px solid ${activeCategory === cat ? '#e85d24' : '#2a2a2a'}`,
                borderRadius: '50px',
                color: activeCategory === cat ? '#fff' : '#666',
                fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Food grid */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px'
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                style={{
                  height: '320px', background: '#1a1a1a',
                  borderRadius: '20px'
                }}
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            {foods.map((item, i) => (
              <FoodCard key={item._id} item={item} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;