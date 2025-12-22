import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // If auth is still loading, maybe show a spinner (or just nothing)
  if (loading) {
     return <div style={{ paddingTop: '100px', textAlign: 'center', color: 'white' }}>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
