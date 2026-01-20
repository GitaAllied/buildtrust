import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * EmailVerificationGuard component
 * Redirects authenticated users with unverified emails to the email verification page
 * This works globally on any page after sign-in
 */
export const EmailVerificationGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't check during loading
    if (loading) return;

    // If user is authenticated but email is not verified, redirect to verification page
    // Skip if already on auth or verification pages to allow login flow to complete
    if (user && !user.email_verified && location.pathname !== '/verify-email' && location.pathname !== '/auth' && location.pathname !== '/reset-password' && location.pathname !== '/forgot-password') {
      navigate('/verify-email', { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  return <>{children}</>;
};

export default EmailVerificationGuard;
