import { useParams } from 'react-router-dom';
import MyListings from '../components/MyListings.jsx';
import MyPurchases from '../components/MyPurchases.jsx';

export default function ProfileMain() {
  const { role } = useParams();
  return role === 'buyer' ? <MyPurchases /> : <MyListings />;
}
