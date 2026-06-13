import { useRef } from 'react';
import { motion } from 'framer-motion';

const OTPInput = ({ value, onChange }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/, '');
    if (!val) return;

    const newOtp = value.split('');
    newOtp[index] = val;
    onChange(newOtp.join(''));

    if (index < 5) inputs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newOtp = value.split('');
      newOtp[index] = '';
      onChange(newOtp.join(''));
      if (index > 0) inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, ''));
    inputs.current[Math.min(pasted.length, 5)].focus();
  };

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          whileFocus={{ scale: 1.08, borderColor: '#e85d24' }}
          style={{
            width: '52px',
            height: '60px',
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '700',
            background: '#1a1a1a',
            border: `2px solid ${value[i] ? '#e85d24' : '#333'}`,
            borderRadius: '12px',
            color: '#fff',
            outline: 'none',
            transition: 'border-color 0.2s',
            caretColor: 'transparent'
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;