import { Navigate, createBrowserRouter } from 'react-router-dom';
import FavoritesList from './components/FavoritesList.jsx';
import Settings from './components/Settings.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Auth from './pages/Auth.jsx';
import Cart from './pages/Cart.jsx';
import Chats from './pages/Chats.jsx';
import Checkout from './pages/Checkout.jsx';
import CreateListing from './pages/CreateListing.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Product from './pages/Product.jsx';
import Profile from './pages/Profile.jsx';
import ProfileMain from './pages/ProfileMain.jsx';
import ProfileSection from './pages/ProfileSection.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <Product /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'create', element: <CreateListing /> },
      { path: 'chats', element: <Chats /> },
      { path: 'profile', element: <Navigate to="/profile/seller" replace /> },
      {
        path: 'profile/:role',
        element: <Profile />,
        children: [
          { index: true, element: <ProfileMain /> },
          { path: 'favorites', element: <FavoritesList /> },
          { path: 'settings', element: <Settings /> },
          { path: ':section', element: <ProfileSection /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: 'login', element: <Auth mode="login" /> },
  { path: 'register', element: <Auth mode="register" /> },
]);
