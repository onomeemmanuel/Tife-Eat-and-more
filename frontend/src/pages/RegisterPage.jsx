import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../api/auth';
import GoogleButton from '../components/GoogleButton';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      toast.success(data.message);
      navigate('/verify-otp', {
        state: {
          userId: data.userId,
          email: form.email
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a00 100%)',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: '420px',
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: '24px',
          padding: '40px 36px'
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ textAlign: 'center', marginBottom: '28px' }}
        >
          <span style={{ fontSize: '40px' }}>🍔</span>
          <h1 style={{ fontSize: '26px', fontWeight: '700', marginTop: '8px' }}>
            Rush-food <span style={{ color: '#e85d24' }}>Eat and more</span>
          </h1>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>
            Create your account
          </p>
        </motion.div>

        <GoogleButton />

        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '12px', margin: '20px 0'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
          <span style={{ color: '#555', fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#2a2a2a' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {['name', 'email', 'password'].map((field, i) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <input
                name={field}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                placeholder={field === 'name' ? 'Full name' : field === 'email' ? 'Email address' : 'Password'}
                value={form[field]}
                onChange={handleChange}
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: '#1a1a1a', border: '1.5px solid #2a2a2a',
                  borderRadius: '12px', color: '#fff',
                  fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#e85d24'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'}
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', padding: '15px',
              background: loading ? '#7a2e0e' : '#e85d24',
              border: 'none', borderRadius: '14px',
              color: '#fff', fontSize: '16px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '6px', transition: 'background 0.2s'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#e85d24', textDecoration: 'none', fontWeight: '600' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;