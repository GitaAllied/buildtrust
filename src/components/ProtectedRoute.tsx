import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: 'client' | 'developer' | 'admin' | 'sub_admin';
}

type UserRole = 'client' | 'developer' | 'admin' | 'sub_admin';

/**
 * ProtectedRoute component that checks authentication and optionally enforces role-based access
 * - If no requiredRole is specified: checks authentication only (allows any authenticated user)
 * - If requiredRole is specified: checks both authentication and role matching
 * - For "admin" role: allows both "admin" and "sub_admin" roles
 * - Redirects to /auth if user is not authenticated
 * - Redirects to /email-verification if email is not verified
 * - Redirects to / if user is authenticated but doesn't have the required role
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

  // Redirect to email verification if email is not verified
  if (!user.email_verified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Check role if required
  if (requiredRole) {
    // For admin routes, allow both admin and sub_admin roles
    if (requiredRole === 'admin') {
      const isAdminRole = (user.role as UserRole) === 'admin' || (user.role as UserRole) === 'sub_admin';
      if (!isAdminRole) {
        console.warn(`User role '${user.role}' does not have admin privileges`);
        return <Navigate to="/" replace />;
      }
    } else {
      // For other roles, require exact match
      if (user.role !== requiredRole) {
        console.warn(`User role '${user.role}' does not match required role '${requiredRole}'`);
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
