import { motion } from 'framer-motion';

const STEPS = [
  { key: 'pending',    label: 'Order Placed',   icon: '📋' },
  { key: 'confirmed',  label: 'Confirmed',       icon: '✅' },
  { key: 'preparing',  label: 'Preparing',       icon: '👨‍🍳' },
  { key: 'picked_up',  label: 'Rider Picked Up', icon: '🏍️' },
  { key: 'delivered',  label: 'Delivered',       icon: '🎉' }
];

const OrderStatusStepper = ({ status }) => {
  const currentIndex = STEPS.findIndex(s => s.key === status);

  return (
    <div style={{ padding: '24px 0' }}>
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.key} style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
            {/* Line + dot */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', width: '40px', flexShrink: 0
            }}>
              <motion.div
                initial={false}
                animate={{
                  background: isActive ? '#e85d24' : isDone ? '#2a8a2a' : '#2a2a2a',
                  scale: isActive ? 1.15 : 1
                }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  border: isActive ? '2px solid #ff8c5a' : 'none',
                  flexShrink: 0
                }}
              >
                {isDone ? '✓' : step.icon}
              </motion.div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={false}
                  animate={{ background: isDone ? '#2a8a2a' : '#2a2a2a' }}
                  transition={{ duration: 0.4 }}
                  style={{ width: '2px', height: '32px', marginTop: '4px' }}
                />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingTop: '10px' }}>
              <p style={{
                fontSize: '15px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#fff' : isDone ? '#4ade80' : '#555'
              }}>
                {step.label}
              </p>
              {isActive && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: '12px', color: '#e85d24', marginTop: '2px' }}
                >
                  {status === 'pending' && 'Waiting for restaurant to confirm...'}
                  {status === 'confirmed' && 'Restaurant has confirmed your order!'}
                  {status === 'preparing' && 'Your food is being prepared...'}
                  {status === 'picked_up' && 'Rider is on the way to you!'}
                  {status === 'delivered' && 'Enjoy your meal! 😋'}
                </motion.p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;