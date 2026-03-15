import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { notificationAPI } from './utils/api';

import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import NotificationToast from './components/NotificationToast';

import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { isDrawerOpen, toggleDrawer, cartItems, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);

  // Simple polling for notifications
  useEffect(() => {
    if (!user) return;

    let lastNotificationCount = 0;

    const checkNotifications = async () => {
      try {
        const { data } = await notificationAPI.getUserNotifications(user.id || user._id);
        if (data.length > lastNotificationCount && data.length > 0) {
          // New notification arose
          setNotification(data[0]); // The newest one is first based on our backend sort
          lastNotificationCount = data.length;
        } else if (data.length > 0 && lastNotificationCount === 0) {
          // Initialize count on first load without showing toast for old ones
          lastNotificationCount = data.length;
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [user]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar cartCount={cartCount} toggleCart={toggleDrawer} />

        <CartDrawer
          isOpen={isDrawerOpen}
          onClose={toggleDrawer}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          clearCart={clearCart}
        />

        <NotificationToast notification={notification} onClose={() => setNotification(null)} />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/track/:id" element={
                <ProtectedRoute>
                  <OrderTrackingPage />
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
