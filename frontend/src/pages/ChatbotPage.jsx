import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatbotPage = () => {
  const navigate = useNavigate();
  const [deviceId, setDeviceId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: error.response?.data?.message || 'Unable to reach the chatbot.' }]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#111827', padding: '24px 16px 100px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ color: '#e85d24', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '6px' }}>Tife Chatbot</p>
            <h1 style={{ fontSize: '26px', fontWeight: '800' }}>Order with simple choices</h1>
          </div>
          <button onClick={() => navigate('/')} style={{ background: '#f3f4f6', border: '1px solid #d1d5db', color: '#111827', padding: '10px 14px', borderRadius: '999px', cursor: 'pointer' }}>Back to menu</button>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)' }}>
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
            <div style={{ fontWeight: '700', color: '#111827' }}>Tife Assistant</div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>Device session: {deviceId || 'loading...'}</div>
          </div>

          <div style={{ height: '500px', overflowY: 'auto', padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map((message, idx) => (
              <div key={`${message.role}-${idx}`} style={{ display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '82%', padding: '14px 16px', borderRadius: message.role === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px', background: message.role === 'user' ? '#e85d24' : '#f3f4f6', border: message.role === 'user' ? 'none' : '1px solid #e5e7eb', whiteSpace: 'pre-wrap', lineHeight: 1.6, color: message.role === 'user' ? '#111827' : '#111827' }}>
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 12px', background: '#f3f4f6', borderRadius: '12px', color: '#6b7280' }}>Typing…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>


          <form onSubmit={sendMessage} style={{ padding: '0 20px 20px', display: 'flex', gap: '12px' }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Type a number or message..." style={{ flex: 1, padding: '16px 18px', borderRadius: '999px', border: '1px solid #d1d5db', background: '#ffffff', color: '#111827', outline: 'none', boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.06)' }} />
            <button type="submit" disabled={loading} style={{ padding: '0 20px', borderRadius: '999px', border: 'none', background: loading ? '#c2410c' : '#e85d24', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, minHeight: '48px' }}>{loading ? 'Sending…' : 'Send'}</button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatbotPage;
