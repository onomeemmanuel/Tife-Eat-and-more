import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orders';

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);

  const deliveryFee = 500;
  const total = totalPrice + deliveryFee;

  const handleOrder = async () => {
    if (!address.trim()) return toast.error('Please enter your delivery address');
    if (cartItems.length === 0) return toast.error('Your cart is empty');

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({
          foodItem: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        deliveryAddress: address,
        paymentMethod: payment
      };

      const { data } = await placeOrder(orderData);
      toast.success('Order placed! 🎉');
      // Navigate first before clearing cart to avoid useEffect redirect
      navigate(`/track/${data.order._id}`);
      clearCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsCartOpen(true);
    return () => setIsCartOpen(false);
  }, [setIsCartOpen]);

  return (
    <div style={{
      minHeight: '100vh', background: '#0f0f0f',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none',
              color: '#666', fontSize: '14px',
              cursor: 'pointer', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ← Back to menu
          </button>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Checkout</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Almost there!</p>
        </motion.div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            Order Summary
          </h3>
          {cartItems.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              border: '1px dashed #2a2a2a',
              borderRadius: '16px',
              textAlign: 'center',
              color: '#888'
            }}>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>
                Your cart is empty.
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
                Add items from the menu to proceed to checkout.
              </p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item._id} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={item.image} alt={item.name}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>x{item.quantity}</p>
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#e85d24' }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))
          )}

          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Subtotal</span>
              <span style={{ fontSize: '14px' }}>₦{totalPrice.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>Delivery fee</span>
              <span style={{ fontSize: '14px' }}>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>Total</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#e85d24' }}>
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Delivery address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            📍 Delivery Address
          </h3>
          <textarea
            placeholder="Enter your full delivery address..."
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            style={{
              width: '100%', padding: '14px',
              background: '#1a1a1a',
              border: '1.5px solid #2a2a2a',
              borderRadius: '12px', color: '#fff',
              fontSize: '14px', outline: 'none',
              resize: 'none', fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={e => e.target.style.borderColor = '#e85d24'}
            onBlur={e => e.target.style.borderColor = '#2a2a2a'}
          />
        </motion.div>

        {/* Payment method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '28px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            💳 Payment Method
          </h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['cash', 'card'].map(method => (
              <motion.button
                key={method}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPayment(method)}
                style={{
                  flex: 1, padding: '14px',
                  background: payment === method ? '#1a0a00' : '#1a1a1a',
                  border: `2px solid ${payment === method ? '#e85d24' : '#2a2a2a'}`,
                  borderRadius: '14px',
                  color: payment === method ? '#e85d24' : '#666',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {method === 'cash' ? '💵 Cash on Delivery' : '💳 Pay with Card'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Place order button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOrder}
          disabled={loading || cartItems.length === 0}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            width: '100%', padding: '18px',
            background: loading || cartItems.length === 0 ? '#7a2e0e' : '#e85d24',
            border: 'none', borderRadius: '16px',
            color: '#fff', fontSize: '17px',
            fontWeight: '700', cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Placing order...' : cartItems.length === 0 ? 'Cart is empty' : `Place Order — ₦${total.toLocaleString()}`}
        </motion.button>
      </div>
    </div>
  );
};

export default CheckoutPage;