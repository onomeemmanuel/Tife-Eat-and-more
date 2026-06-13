import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyOTP, resendOTP } from '../api/auth';
import OTPInput from '../components/OTPInput';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!state?.userId) navigate('/register');
  }, [state]);

  useEffect(() => {
    if (countdown === 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) return toast.error('Enter all 6 digits');
    setLoading(true);
    try {
      const { data } = await verifyOTP({ userId: state.userId, otp });
      toast.success(data.message || 'Email verified! Please sign in to continue.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP({ userId: state.userId });
      toast.success('New code sent!');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      toast.error('Could not resend OTP');
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
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '420px',
          background: '#161616',
          border: '1px solid #2a2a2a',
          borderRadius: '24px',
          padding: '40px 36px',
          textAlign: 'center'
        }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontSize: '48px', marginBottom: '16px' }}
        >
          📧
        </motion.div>

        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          Check your email
        </h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>
          We sent a 6-digit code to<br />
          <span style={{ color: '#e85d24', fontWeight: '600' }}>{state?.email}</span>
        </p>


        <OTPInput value={otp} onChange={setOtp} />

        <motion.button
          onClick={handleVerify}
          disabled={loading || otp.length < 6}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', padding: '15px',
            background: otp.length === 6 ? '#e85d24' : '#2a2a2a',
            border: 'none', borderRadius: '14px',
            color: otp.length === 6 ? '#fff' : '#555',
            fontSize: '16px', fontWeight: '600',
            cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
            marginTop: '28px', transition: 'all 0.3s'
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </motion.button>

        <p style={{ marginTop: '20px', color: '#555', fontSize: '14px' }}>
          {canResend ? (
            <span
              onClick={handleResend}
              style={{ color: '#e85d24', cursor: 'pointer', fontWeight: '600' }}
            >
              Resend code
            </span>
          ) : (
            <>Resend in <span style={{ color: '#e85d24' }}>{countdown}s</span></>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;