import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FoodCard from '../components/FoodCard';
import CartSidebar from '../components/CartSidebar';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Chicken', 'Sides', 'Drinks', 'Desserts'];

const CATEGORY_ICONS = {
  All: '🍽️', Burgers: '🍔', Pizza: '🍕',
  Chicken: '🍗', Sides: '🍟', Drinks: '🥤', Desserts: '🍰'
};

const MenuPage = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fetchFoods = async (category) => {
    setLoading(true);
    try {
      const url = category === 'All'
        ? 'http://localhost:5000/api/foods'
        : `http://localhost:5000/api/foods?category=${category}`;
      const { data } = await axios.get(url, { withCredentials: true });
      setFoods(data.foods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFoods(activeCategory); }, [activeCategory]);

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{
      background: '#0f0f0f', minHeight: '100vh',
      paddingBottom: '100px'
    }}>
      <Navbar />
      <CartSidebar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Top header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            paddingTop: '56px', paddingBottom: '20px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              📍 Lagos, Nigeria
            </p>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px' }}>
              {getGreeting()},<br />
              <span style={{ color: '#e85d24' }}>
                {user?.name?.split(' ')[0]} 👋
              </span>
            </h1>
          </div>
          <motion.div
            whileTap={{ scale: 0.9 }}
            style={{
              width: '44px', height: '44px',
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            {user?.avatar
              ? <img src={user.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              : '👤'
            }
          </motion.div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            position: 'relative', marginBottom: '28px'
          }}
        >
          <span style={{
            position: 'absolute', left: '16px',
            top: '50%', transform: 'translateY(-50%)',
            fontSize: '18px'
          }}>
            🔍
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for food..."
            style={{
              width: '100%', padding: '16px 16px 16px 48px',
              background: '#1a1a1a',
              border: '1.5px solid #2a2a2a',
              borderRadius: '16px', color: '#fff',
              fontSize: '15px', outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#e85d24'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: '16px',
                top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: '#555', fontSize: '18px', cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Featured carousel — hide when searching */}
        <AnimatePresence>
          {!search && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FeaturedCarousel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        {!search && (
          <div style={{
            display: 'flex', gap: '10px',
            overflowX: 'auto', paddingBottom: '8px',
            marginBottom: '24px',
            scrollbarWidth: 'none'
          }}>
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.93 }}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '10px 18px',
                  background: activeCategory === cat ? '#e85d24' : '#1a1a1a',
                  border: `1px solid ${activeCategory === cat ? '#e85d24' : '#2a2a2a'}`,
                  borderRadius: '50px',
                  color: activeCategory === cat ? '#fff' : '#666',
                  fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Section title */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800' }}>
            {search
              ? `Results for "${search}"`
              : activeCategory === 'All' ? 'All Items' : activeCategory
            }
          </h2>
          <span style={{ fontSize: '13px', color: '#555' }}>
            {filtered.length} items
          </span>
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
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', marginTop: '80px', color: '#444' }}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>No results found</p>
            <p style={{ fontSize: '13px', marginTop: '6px' }}>
              Try a different search term
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <FoodCard key={item._id} item={item} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MenuPage;