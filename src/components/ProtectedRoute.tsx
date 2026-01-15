import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'client' | 'developer' | 'admin';
}

/**
 * ProtectedRoute component that checks authentication and optionally enforces role-based access
 * Redirects to /auth if user is not authenticated
 * Redirects to / if user is authenticated but doesn't have the required role
 */
export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show nothing while loading auth state
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`User role '${user.role}' does not match required role '${requiredRole}'`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
