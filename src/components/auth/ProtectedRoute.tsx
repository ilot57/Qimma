'use client';

import { useRouteProtection } from '@/lib/hooks/useRouteProtection';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'super_admin' | 'teacher' | 'student';
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  fallback,
  loadingComponent,
}: ProtectedRouteProps) {
  const { isLoaded, isAuthorized } = useRouteProtection({
    requireAuth,
    requiredRole,
  });

  // Show loading state while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {loadingComponent || (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        )}
      </div>
    );
  }

  // Show fallback or nothing if not authorized
  if (!isAuthorized) {
    return fallback || null;
  }

  return <>{children}</>;
}
