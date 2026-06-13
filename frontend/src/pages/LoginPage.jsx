import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name}! 🍔`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (err.response?.status === 403) {
        toast.error('Please verify your email first');
        navigate('/verify-otp', {
          state: { userId: err.response.data.userId, email: form.email }
        });
      } else {
        toast.error(msg || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0a00 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card"
        style={{ background: '#161616', border: '1px solid #2a2a2a' }}
      >
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
            Welcome back
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
          {['email', 'password'].map((field, i) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <input
                name={field}
                type={field === 'password' ? 'password' : 'email'}
                placeholder={field === 'email' ? 'Email address' : 'Password'}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#555', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#e85d24', textDecoration: 'none', fontWeight: '600' }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;