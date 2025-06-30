import { useAuth } from '@/hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiredAccessLevel }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // ou spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verifica o nível de acesso, se exigido
  if (requiredAccessLevel && user.access_level !== requiredAccessLevel) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
