import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getOrderById } from '../api/orders';
import OrderStatusStepper from './OrderStatusStepper';
import axios from 'axios';

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom rider icon
const riderIcon = L.divIcon({
  html: '<div style="font-size:28px;line-height:1">🏍️</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Custom destination icon
const destIcon = L.divIcon({
  html: '<div style="font-size:28px;line-height:1">📍</div>',
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

// Auto-pan map to rider
const MapPanner = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.panTo(position, { animate: true, duration: 1 });
  }, [position]);
  return null;
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('pending');
  const [riderPos, setRiderPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const simulationRef = useRef(null);

  // Lagos coords as default
  const DEFAULT_DEST = { lat: 6.5244, lng: 3.3792 };
  const [destPos, setDestPos] = useState(DEFAULT_DEST);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(orderId);
        setOrder(data.order);
        setStatus(data.order.status);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
    // Try to get user's current location for accurate destination
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setDestPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          // ignore errors, keep default
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [orderId]);

  useEffect(() => {
    // Connect socket
    socketRef.current = io('http://localhost:5000', {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected', socketRef.current.id);
    });
    socketRef.current.on('connect_error', (err) => {
      console.warn('Socket connect_error', err);
    });

    // Listen for status updates
    socketRef.current.on(`order:status:${orderId}`, ({ status }) => {
      setStatus(status);
    });

    // Listen for rider location
    socketRef.current.on(`order:location:${orderId}`, ({ lat, lng }) => {
      setRiderPos({ lat, lng });
    });

    return () => {
      socketRef.current?.disconnect();
      clearInterval(simulationRef.current);
    };
  }, [orderId]);

  // Simulate rider movement (for demo)
  const startSimulation = () => {
    let lat = DEFAULT_DEST.lat + 0.02;
    let lng = DEFAULT_DEST.lng - 0.02;

    simulationRef.current = setInterval(() => {
      lat -= 0.001;
      lng += 0.001;
      socketRef.current?.emit('rider:location', { orderId: orderId, lat, lng });

      if (lat <= DEFAULT_DEST.lat && lng >= DEFAULT_DEST.lng) {
        clearInterval(simulationRef.current);
      }
    }, 1000);
  };

  useEffect(() => {
    if (status === 'confirmed') {
      startSimulation();
    }
  }, [status]);

  const advanceStatus = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/orders/${orderId}/simulate`,
        {},
        { withCredentials: true }
      );
      if (status === 'confirmed') startSimulation();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f0f0f',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ fontSize: '48px' }}
        >
          🍔
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', padding: '24px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '24px' }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none',
              color: '#666', fontSize: '14px',
              cursor: 'pointer', marginBottom: '12px',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            ← Back to menu
          </button>
          <h1 style={{ fontSize: '26px', fontWeight: '800' }}>
            Track Your Order
          </h1>
          <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>
            Order #{orderId.slice(-8).toUpperCase()}
          </p>
        </motion.div>

        {/* Live Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            borderRadius: '20px', overflow: 'hidden',
            border: '1px solid #2a2a2a',
            marginBottom: '20px', height: '280px'
          }}
        >
          <MapContainer
            center={[destPos.lat, destPos.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; OpenStreetMap &copy; CARTO'
            />

            {/* Destination marker */}
            <Marker
              position={[destPos.lat, destPos.lng]}
              icon={destIcon}
            >
              <Popup>Your delivery location</Popup>
            </Marker>

            {/* Rider marker */}
            {riderPos && (
              <>
                <Marker
                  position={[riderPos.lat, riderPos.lng]}
                  icon={riderIcon}
                >
                  <Popup>Rider is here!</Popup>
                </Marker>
                <MapPanner position={[riderPos.lat, riderPos.lng]} />
              </>
            )}
          </MapContainer>
        </motion.div>

        {/* Status card */}
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
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '8px'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>
              Order Status
            </h3>
            <motion.span
              animate={{ opacity: status !== 'delivered' ? [1, 0.4, 1] : 1 }}
              transition={{ duration: 1.5, repeat: status !== 'delivered' ? Infinity : 0 }}
              style={{
                fontSize: '12px', fontWeight: '600',
                color: '#e85d24',
                background: '#1a0a00',
                padding: '4px 10px',
                borderRadius: '20px'
              }}
            >
              {status !== 'delivered' ? '🔴 Live' : '✅ Done'}
            </motion.span>
          </div>

          <OrderStatusStepper status={status} />
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: '#161616',
            border: '1px solid #2a2a2a',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            Order Details
          </h3>
          {order?.items?.map((item, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={item.image} alt={item.name}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '14px' }}>
                  {item.name} <span style={{ color: '#666' }}>x{item.quantity}</span>
                </span>
              </div>
              <span style={{ fontSize: '14px', color: '#e85d24', fontWeight: '600' }}>
                ₦{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
          <div style={{
            borderTop: '1px solid #2a2a2a',
            paddingTop: '12px', marginTop: '4px',
            display: 'flex', justifyContent: 'space-between'
          }}>
            <span style={{ fontWeight: '700' }}>Total paid</span>
            <span style={{ color: '#e85d24', fontWeight: '800', fontSize: '16px' }}>
              ₦{((order?.totalAmount || 0) + 500).toLocaleString()}
            </span>
          </div>
        </motion.div>

        {/* Demo controls */}
        {status !== 'delivered' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: '#0d1a0d',
              border: '1px solid #1a3a1a',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '20px'
            }}
          >
            <p style={{ fontSize: '13px', color: '#4ade80', marginBottom: '12px', fontWeight: '600' }}>
              🧪 Demo controls — simulate order progress
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={advanceStatus}
              style={{
                width: '100%', padding: '12px',
                background: '#1a3a1a', border: '1px solid #2a5a2a',
                borderRadius: '12px', color: '#4ade80',
                fontSize: '14px', fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Advance to next status →
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;