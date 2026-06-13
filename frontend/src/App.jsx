import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import SplashScreen from './pages/splashScreen';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/checkoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import OrdersHistoryPage from './pages/OrdersHistoryPage';
import ProfilePage from './pages/profilepage';
import CartSidebar from './components/CartSidebar';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
  <CartProvider>
    <>
      <CartSidebar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/track/:orderId" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersHistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </>
  </CartProvider>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #2a2a2a',
                borderRadius: '12px'
              }
            }}
          />
          <AnimatePresence mode="wait">
            {showSplash ? (
              <SplashScreen key="splash" onDone={() => setShowSplash(false)} />
            ) : (
              <AppRoutes />
            )}
          </AnimatePresence>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;