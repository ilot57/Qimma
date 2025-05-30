import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth, useUser } from '@clerk/nextjs';

interface RouteProtectionOptions {
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'super_admin' | 'teacher' | 'student';
  redirectTo?: string;
}

export function useRouteProtection(options: RouteProtectionOptions = {}) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const { requireAuth = true, requiredRole, redirectTo = '/sign-in' } = options;

  useEffect(() => {
    if (!isLoaded) return; // Wait for auth to load

    // Check authentication requirement
    if (requireAuth && !isSignedIn) {
      const currentUrl = window.location.pathname + window.location.search;
      const redirectUrl = `${redirectTo}?redirect_url=${encodeURIComponent(currentUrl)}`;
      router.push(redirectUrl);
      return;
    }

    // Check role requirement
    if (requiredRole && user) {
      const userRole = user.publicMetadata?.role as string | undefined;

      if (!userRole || !hasRequiredRole(userRole, requiredRole)) {
        router.push('/dashboard?error=insufficient_permissions');
        return;
      }
    }
  }, [
    isLoaded,
    isSignedIn,
    userId,
    user,
    requiredRole,
    requireAuth,
    redirectTo,
    router,
  ]);

  const userRole = user?.publicMetadata?.role as string | undefined;

  return {
    isLoaded,
    isSignedIn,
    user,
    userId,
    userRole,
    hasRole: (role: string) => userRole === role,
    hasAnyRole: (roles: string[]) => roles.includes(userRole || ''),
    isAuthorized:
      !requireAuth ||
      (isSignedIn &&
        (!requiredRole ||
          (userRole ? hasRequiredRole(userRole, requiredRole) : false))),
  };
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    student: 1,
    teacher: 2,
    admin: 3,
    super_admin: 4,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel =
    roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 999;

  return userLevel >= requiredLevel;
}
