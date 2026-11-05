import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from '../components/Header.jsx';

// Спільний каркас: шапка зверху, поточна сторінка в <Outlet />
export default function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <ScrollRestoration />
    </>
  );
}
