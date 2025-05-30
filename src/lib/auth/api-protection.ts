import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs/server';

export interface AuthResult {
  userId: string;
  userRole?: string;
  sessionClaims?: any;
}

export interface ApiProtectionOptions {
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'super_admin' | 'teacher' | 'student';
  customValidator?: (authResult: AuthResult) => boolean;
}

/**
 * Protect API routes with authentication and role-based access control
 */
export async function withApiProtection(
  handler: (req: NextRequest, authResult: AuthResult) => Promise<NextResponse>,
  options: ApiProtectionOptions = {}
) {
  const { requireAuth = true, requiredRole, customValidator } = options;

  return async (req: NextRequest) => {
    try {
      // Get authentication state
      const authState = await auth();
      const { userId, sessionClaims } = authState;

      // Check if authentication is required
      if (requireAuth && !userId) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const authResult: AuthResult = {
        userId: userId || '',
        userRole: (sessionClaims?.metadata as { role?: string })?.role,
        sessionClaims,
      };

      // Check role requirement
      if (requiredRole && authResult.userRole) {
        if (!hasRequiredApiRole(authResult.userRole, requiredRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
      }

      // Run custom validator if provided
      if (customValidator && !customValidator(authResult)) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Call the protected handler
      return await handler(req, authResult);
    } catch (error) {
      console.error('API protection error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Simple authentication check for API routes
 */
export async function requireAuth(): Promise<AuthResult> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    throw new Error('Authentication required');
  }

  return {
    userId,
    userRole: (sessionClaims?.metadata as { role?: string })?.role,
    sessionClaims,
  };
}

function hasRequiredApiRole(userRole: string, requiredRole: string): boolean {
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
