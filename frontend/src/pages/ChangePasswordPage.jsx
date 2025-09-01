import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';

export const ChangePasswordPage = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const expired = params.get('expired') === '1';

  useEffect(() => {
    if (loading) return;
    if (!expired) {
      if (!isAuthenticated) navigate('/login');
      else if (user && !user.primeiro_acesso) navigate('/dashboard');
    }
  }, [isAuthenticated, loading, user, navigate, expired]);

  if (loading && !expired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-orange-light">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ChangePasswordForm mode={expired ? 'expired' : 'auth'} />;
};
