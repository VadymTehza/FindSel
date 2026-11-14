import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function ProfileRedirect() {
  const { user } = useAuth();
  return <Navigate to={`/profile/${user.role}`} replace />;
}
