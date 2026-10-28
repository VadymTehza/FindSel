import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import Chats from './pages/Chats.jsx';
import Auth from './pages/Auth.jsx';
import CreateListing from './pages/CreateListing.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/create" element={<CreateListing />} />
      <Route path="/profile" element={<Navigate to="/profile/seller" replace />} />
      <Route path="/profile/:role" element={<Profile />} />
      <Route path="/chats" element={<Chats />} />
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
