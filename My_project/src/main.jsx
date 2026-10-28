import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import CartProvider from './context/CartProvider.jsx';
import FavoritesProvider from './context/FavoritesProvider.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FavoritesProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </FavoritesProvider>
  </BrowserRouter>
);
