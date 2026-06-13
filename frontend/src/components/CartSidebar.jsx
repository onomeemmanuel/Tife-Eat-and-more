import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen,
          updateQuantity, removeFromCart,
          totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 200,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed', top: 0, right: 0,
              height: '100vh', width: '380px',
              background: '#161616',
              borderLeft: '1px solid #2a2a2a',
              zIndex: 201,
              display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #2a2a2a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Your Cart</h2>
                <p style={{ color: '#666', fontSize: '13px', marginTop: '2px' }}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{
                  background: '#2a2a2a', border: 'none',
                  borderRadius: '10px', width: '36px', height: '36px',
                  color: '#fff', fontSize: '18px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cartItems.length === 0 ? (
                <div style={{
                  textAlign: 'center', marginTop: '80px',
                  color: '#444'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                  <p style={{ fontSize: '16px', fontWeight: '600' }}>Your cart is empty</p>
                  <p style={{ fontSize: '13px', marginTop: '8px' }}>
                    Add some delicious food!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {cartItems.map(item => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      style={{
                        display: 'flex', gap: '12px',
                        padding: '12px',
                        background: '#1a1a1a',
                        borderRadius: '14px',
                        marginBottom: '10px',
                        border: '1px solid #2a2a2a'
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '64px', height: '64px',
                          borderRadius: '10px', objectFit: 'cover',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                          {item.name}
                        </p>
                        <p style={{ fontSize: '14px', color: '#e85d24', fontWeight: '700' }}>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {/* Quantity controls */}
                        <div style={{
                          display: 'flex', alignItems: 'center',
                          gap: '10px', marginTop: '8px'
                        }}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            style={{
                              width: '28px', height: '28px',
                              background: '#2a2a2a', border: 'none',
                              borderRadius: '8px', color: '#fff',
                              fontSize: '16px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >−</button>
                          <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            style={{
                              width: '28px', height: '28px',
                              background: '#e85d24', border: 'none',
                              borderRadius: '8px', color: '#fff',
                              fontSize: '16px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >+</button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          background: 'transparent', border: 'none',
                          color: '#555', fontSize: '18px',
                          cursor: 'pointer', alignSelf: 'flex-start',
                          padding: '4px'
                        }}
                      >🗑</button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #2a2a2a'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '8px', fontSize: '14px', color: '#666'
                }}>
                  <span>Subtotal</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '16px', fontSize: '14px', color: '#666'
                }}>
                  <span>Delivery fee</span>
                  <span>₦500</span>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '20px', fontSize: '17px', fontWeight: '700'
                }}>
                  <span>Total</span>
                  <span style={{ color: '#e85d24' }}>
                    ₦{(totalPrice + 500).toLocaleString()}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  style={{
                    width: '100%', padding: '16px',
                    background: '#e85d24', border: 'none',
                    borderRadius: '14px', color: '#fff',
                    fontSize: '16px', fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Checkout — ₦{(totalPrice + 500).toLocaleString()}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;