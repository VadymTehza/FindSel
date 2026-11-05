import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import Chats from './pages/Chats.jsx';
import Auth from './pages/Auth.jsx';
import CreateListing from './pages/CreateListing.jsx';

const getPath = () => window.location.hash.replace(/^#/, '') || '/';

const PAGES = {
  '/': <Home />,
  '/product': <Product />,
  '/cart': <Cart />,
  '/checkout': <Checkout />,
  '/create': <CreateListing />,
  '/profile': <Profile role="seller" />,
  '/profile/seller': <Profile role="seller" />,
  '/profile/buyer': <Profile role="buyer" />,
  '/chats': <Chats />,
  '/login': <Auth mode="login" />,
  '/register': <Auth mode="register" />,
};

export default function App() {
  // яка сторінка відкрита — зберігаємо в стані, беремо із посилання (#/cart)
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onChange = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return PAGES[path] ?? PAGES['/'];
}
