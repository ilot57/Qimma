import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs/server';

import { type UserProfile, getUserProfile, syncCurrentUser } from './user-sync';

export interface SessionInfo {
  isAuthenticated: boolean;
  userId: string | null;
  user: UserProfile | null;
  sessionId: string | null;
  expiresAt: Date | null;
  metadata: {
    role: string;
    subscriptionTier: string;
    creditsRemaining: number;
  } | null;
}

/**
 * Get comprehensive session information
 * Returns both Clerk and Supabase user data with session status
 */
export async function getSessionInfo(): Promise<SessionInfo> {
  try {
    const { userId, sessionId, sessionClaims } = await auth();

    if (!userId || !sessionId) {
      return {
        isAuthenticated: false,
        userId: null,
        user: null,
        sessionId: null,
        expiresAt: null,
        metadata: null,
      };
    }

    // Get user profile from Supabase (with auto-sync if needed)
    const userProfile = await getUserProfile();

    // Extract expiration from session claims
    const expiresAt = sessionClaims?.exp
      ? new Date(sessionClaims.exp * 1000)
      : null;

    return {
      isAuthenticated: true,
      userId,
      user: userProfile,
      sessionId,
      expiresAt,
      metadata: userProfile
        ? {
            role: userProfile.role,
            subscriptionTier: userProfile.subscriptionTier,
            creditsRemaining: userProfile.creditsRemaining,
          }
        : null,
    };
  } catch (error) {
    console.error('Error getting session info:', error);
    return {
      isAuthenticated: false,
      userId: null,
      user: null,
      sessionId: null,
      expiresAt: null,
      metadata: null,
    };
  }
}

/**
 * Validate session and ensure user is authenticated
 * Throws error or redirects if session is invalid
 */
export async function validateSession(
  options: {
    requireRole?: 'student' | 'teacher' | 'admin' | 'super_admin';
    requireSubscription?: 'free' | 'standard' | 'plus' | 'full';
    redirectOnFail?: string;
    throwOnFail?: boolean;
  } = {}
): Promise<SessionInfo> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo.isAuthenticated) {
    if (options.redirectOnFail) {
      redirect(options.redirectOnFail);
    }
    if (options.throwOnFail) {
      throw new Error('Authentication required');
    }
    return sessionInfo;
  }

  // Check role requirement
  if (
    options.requireRole &&
    sessionInfo.metadata?.role !== options.requireRole
  ) {
    const error = `Role '${options.requireRole}' required, but user has '${sessionInfo.metadata?.role}'`;
    if (options.throwOnFail) {
      throw new Error(error);
    }
    console.warn(error);
  }

  // Check subscription requirement
  if (options.requireSubscription) {
    const userTier = sessionInfo.metadata?.subscriptionTier;
    const tierOrder = ['free', 'standard', 'plus', 'full'];
    const requiredIndex = tierOrder.indexOf(options.requireSubscription);
    const userIndex = tierOrder.indexOf(userTier || 'free');

    if (userIndex < requiredIndex) {
      const error = `Subscription '${options.requireSubscription}' required, but user has '${userTier}'`;
      if (options.throwOnFail) {
        throw new Error(error);
      }
      console.warn(error);
    }
  }

  return sessionInfo;
}

/**
 * Check if session is expiring soon (within 5 minutes)
 */
export function isSessionExpiringSoon(sessionInfo: SessionInfo): boolean {
  if (!sessionInfo.expiresAt) return false;

  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  return sessionInfo.expiresAt <= fiveMinutesFromNow;
}

/**
 * Check if session has expired
 */
export function isSessionExpired(sessionInfo: SessionInfo): boolean {
  if (!sessionInfo.expiresAt) return false;

  return sessionInfo.expiresAt <= new Date();
}

/**
 * Get session expiration time in minutes
 */
export function getSessionTimeRemaining(
  sessionInfo: SessionInfo
): number | null {
  if (!sessionInfo.expiresAt) return null;

  const timeRemaining = sessionInfo.expiresAt.getTime() - Date.now();
  return Math.max(0, Math.floor(timeRemaining / 60000)); // Convert to minutes
}

/**
 * Require authentication for a server component/page
 * Automatically redirects to sign-in if not authenticated
 */
export async function requireAuth(redirectUrl?: string): Promise<SessionInfo> {
  return await validateSession({
    redirectOnFail: `/sign-in${redirectUrl ? `?redirect_url=${encodeURIComponent(redirectUrl)}` : ''}`,
    throwOnFail: false,
  });
}

/**
 * Require specific role for a server component/page
 */
export async function requireRole(
  role: 'student' | 'teacher' | 'admin' | 'super_admin',
  redirectUrl?: string
): Promise<SessionInfo> {
  return await validateSession({
    requireRole: role,
    redirectOnFail: redirectUrl || '/dashboard?error=insufficient_permissions',
    throwOnFail: false,
  });
}

/**
 * Check if user has sufficient credits for an operation
 */
export async function checkCredits(
  requiredCredits: number
): Promise<{ hasCredits: boolean; currentCredits: number; needed: number }> {
  const sessionInfo = await getSessionInfo();
  const currentCredits = sessionInfo.metadata?.creditsRemaining || 0;

  return {
    hasCredits: currentCredits >= requiredCredits,
    currentCredits,
    needed: Math.max(0, requiredCredits - currentCredits),
  };
}

/**
 * Refresh user data from Supabase
 * Useful after operations that might change user state
 */
export async function refreshUserData(): Promise<UserProfile | null> {
  try {
    return await syncCurrentUser();
  } catch (error) {
    console.error('Error refreshing user data:', error);
    return null;
  }
}

/**
 * Log security event for audit purposes
 */
export async function logSecurityEvent(
  event:
    | 'login'
    | 'logout'
    | 'permission_denied'
    | 'token_refresh'
    | 'session_expired',
  details?: Record<string, any>
): Promise<void> {
  try {
    const sessionInfo = await getSessionInfo();

    // Log to console in development, could be extended to send to monitoring service
    console.log(`[SECURITY] ${event.toUpperCase()}`, {
      userId: sessionInfo.userId,
      sessionId: sessionInfo.sessionId,
      timestamp: new Date().toISOString(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ...details,
    });

    // TODO: In production, send to monitoring service like Sentry or custom audit log
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}
