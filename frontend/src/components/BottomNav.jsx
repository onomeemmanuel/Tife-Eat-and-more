import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
	const navigate = useNavigate();

	return (
		<nav style={{
			position: 'fixed', bottom: 16, left: 0, right: 0,
			display: 'flex', justifyContent: 'center', pointerEvents: 'auto'
		}}>
			<div style={{
				width: 'min(720px, 92%)', background: '#ffffff',
				border: '1px solid #e5e7eb', borderRadius: 14,
				display: 'flex', gap: 8, padding: '8px 12px', justifyContent: 'space-between',
				boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
			}}>
				<button onClick={() => navigate('/')} style={buttonStyle}>Home</button>
				<button onClick={() => navigate('/orders')} style={buttonStyle}>Orders</button>
				<button onClick={() => navigate('/chatbot')} style={buttonStyle}>Chatbot</button>
				<button onClick={() => navigate('/profile')} style={buttonStyle}>Profile</button>
			</div>
		</nav>
	);
};

const buttonStyle = {
	background: 'transparent', border: 'none', color: '#111827',
	padding: '8px 12px', borderRadius: 10, cursor: 'pointer', fontWeight: 600
};

export default BottomNav;
