import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [paying, setPaying] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    const storedDeviceId = localStorage.getItem('tife-chat-device-id');
    const nextDeviceId = storedDeviceId || `device-${Date.now()}`;
    localStorage.setItem('tife-chat-device-id', nextDeviceId);
    setDeviceId(nextDeviceId);
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/chatbot/session?deviceId=${deviceId}`);
        setMessages([{ role: 'bot', text: data.message }]);
      } catch (error) {
        setMessages([{ role: 'bot', text: 'The chatbot is unavailable right now. Please try again in a moment.' }]);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [deviceId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || !deviceId) return;

    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/chatbot/message', { deviceId, message: text });
      setMessages((prev) => [...prev, { role: 'bot', text: data.message }]);
      if (data.paymentRequired) {
        setPendingOrder(data.order || null);
      } else {
        setPendingOrder(null);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: error.response?.data?.message || 'Unable to reach the chatbot.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!pendingOrder || !deviceId) return;

    setPaying(true);
    try {
      const existingScript = document.querySelector('script[src*="paystack"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        if (!window.PaystackPop) {
          confirmPayment();
          return;
        }

        const handler = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_0cfd74a4e0fe35e7d5eab34d378f1f8ecf5f2f0e',
          email: 'customer@tife.com',
          amount: pendingOrder.totalAmount * 100,
          currency: 'NGN',
          ref: `tife-${Date.now()}`,
          metadata: {
            custom_fields: [{ display_name: 'Device', variable_name: 'device', value: deviceId }]
          },
          callback: async () => {
            await confirmPayment();
          },
          onClose: () => {
            toast('Payment popup closed. You can try again when you are ready.');
          }
        });
        handler.openIframe();
      };
      script.onerror = async () => {
        await confirmPayment();
      };
      document.body.appendChild(script);
    } catch (error) {
      toast.error('Payment could not be started.');
    } finally {
      setPaying(false);
    }
  };

  const confirmPayment = async () => {
    try {
      const { data } = await axios.post('/api/chatbot/pay', { deviceId, orderId: pendingOrder.id });
      setMessages((prev) => [...prev, { role: 'bot', text: data.message }]);
      setPendingOrder(null);
      toast.success('Payment confirmed successfully.');
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: error.response?.data?.message || 'Payment confirmation failed.' }]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #080808 0%, #17120e 100%)', color: '#fff', padding: '24px 16px 100px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ color: '#e85d24', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '6px' }}>Tife Chatbot</p>
            <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Order with simple choices</h1>
          </div>
          <button onClick={() => navigate('/')} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#fff', padding: '10px 14px', borderRadius: '999px', cursor: 'pointer' }}>Back to menu</button>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(17,17,17,0.92)', border: '1px solid #2a2a2a', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2a2a2a', background: '#121212' }}>
            <div style={{ fontWeight: '700' }}>Tife Assistant</div>
            <div style={{ color: '#888', fontSize: '13px' }}>Device session: {deviceId || 'loading...'}</div>
          </div>

          <div style={{ height: '480px', overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '12px 14px', borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: message.role === 'user' ? '#e85d24' : '#1d1d1d', border: message.role === 'user' ? 'none' : '1px solid #2a2a2a', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 12px', background: '#1d1d1d', borderRadius: '12px', color: '#999' }}>Typing…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {pendingOrder && (
            <div style={{ padding: '0 18px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ color: '#f4a261' }}>
                <strong>Payment ready</strong>
                <div style={{ fontSize: '14px', color: '#aaa' }}>Order total: ₦{pendingOrder.totalAmount?.toLocaleString()}</div>
              </div>
              <button onClick={handlePayNow} disabled={paying} style={{ background: '#e85d24', color: '#fff', border: 'none', borderRadius: '999px', padding: '10px 16px', cursor: paying ? 'not-allowed' : 'pointer', opacity: paying ? 0.8 : 1 }}>
                {paying ? 'Processing…' : 'Pay with Paystack'}
              </button>
            </div>
          )}

          <form onSubmit={sendMessage} style={{ padding: '0 16px 16px', display: 'flex', gap: '10px' }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a number or message..." style={{ flex: 1, padding: '14px 16px', borderRadius: '999px', border: '1px solid #2a2a2a', background: '#0f0f0f', color: '#fff', outline: 'none' }} />
            <button type="submit" disabled={loading} style={{ padding: '0 18px', borderRadius: '999px', border: 'none', background: loading ? '#7a2e0e' : '#e85d24', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}>Send</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotPage;
