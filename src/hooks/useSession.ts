'use client';

import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useSession as useClerkSession, useUser } from '@clerk/nextjs';

interface SessionState {
  isLoaded: boolean;
  isAuthenticated: boolean;
  user: any;
  sessionId: string | null;
  isExpiringSoon: boolean;
  isExpired: boolean;
  timeRemaining: number | null; // in minutes
}

interface UserProfile {
  id: string;
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'student' | 'teacher' | 'admin' | 'super_admin';
  subscriptionTier: 'free' | 'standard' | 'plus' | 'full';
  creditsRemaining: number;
}

interface UseSessionReturn extends SessionState {
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
  checkCredits: (required: number) => { hasCredits: boolean; needed: number };
  logSecurityEvent: (event: string, details?: Record<string, any>) => void;
  signOut: () => void;
}

export function useSession(): UseSessionReturn {
  const { isLoaded, isSignedIn, user } = useUser();
  const { session } = useClerkSession();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sessionState, setSessionState] = useState<
    Omit<SessionState, 'isLoaded' | 'isAuthenticated' | 'user'>
  >({
    sessionId: null,
    isExpiringSoon: false,
    isExpired: false,
    timeRemaining: null,
  });

  // Fetch user profile from API
  const refreshUserProfile = useCallback(async () => {
    if (!isSignedIn) {
      setUserProfile(null);
      return;
    }

    try {
      const response = await fetch('/api/user/sync');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [isSignedIn]);

  // Check session expiration
  const checkSessionExpiration = useCallback(() => {
    if (!session?.id) return;

    // Get session expiration from Clerk session
    const sessionExpiresAt = session.expireAt
      ? new Date(session.expireAt)
      : null;
    const now = new Date();

    if (!sessionExpiresAt) {
      // Fallback: assume 1 hour session
      const createdAt = session.createdAt
        ? new Date(session.createdAt)
        : new Date();
      const fallbackExpiresAt = new Date(createdAt.getTime() + 60 * 60 * 1000);
      const timeRemaining = Math.max(
        0,
        Math.floor((fallbackExpiresAt.getTime() - now.getTime()) / 60000)
      );

      setSessionState({
        sessionId: session.id,
        isExpiringSoon: timeRemaining <= 5,
        isExpired: timeRemaining <= 0,
        timeRemaining,
      });
      return;
    }

    const timeRemaining = Math.max(
      0,
      Math.floor((sessionExpiresAt.getTime() - now.getTime()) / 60000)
    );
    const isExpired = sessionExpiresAt <= now;
    const isExpiringSoon =
      sessionExpiresAt <= new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    setSessionState({
      sessionId: session.id,
      isExpiringSoon,
      isExpired,
      timeRemaining,
    });

    // Auto-refresh session if expiring soon
    if (isExpiringSoon && !isExpired) {
      // Clerk handles token refresh automatically
      console.log(
        'Session expiring soon, Clerk will handle refresh automatically'
      );
    }

    return { isExpired, isExpiringSoon, timeRemaining };
  }, [session]);

  // Load user profile on authentication
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      refreshUserProfile();
    }
  }, [isLoaded, isSignedIn, refreshUserProfile]);

  // Check session expiration periodically
  useEffect(() => {
    if (!isSignedIn || !session) return;

    checkSessionExpiration();

    // Check every minute
    const interval = setInterval(checkSessionExpiration, 60000);
    return () => clearInterval(interval);
  }, [isSignedIn, session, checkSessionExpiration]);

  // Handle session expiration
  useEffect(() => {
    if (sessionState.isExpired && isSignedIn) {
      console.log('Session expired, redirecting to sign-in');
      logSecurityEvent('session_expired');
      router.push('/sign-in?reason=session_expired');
    }
  }, [sessionState.isExpired, isSignedIn, router]);

  // Utility functions
  const checkCredits = useCallback(
    (required: number) => {
      const currentCredits = userProfile?.creditsRemaining || 0;
      return {
        hasCredits: currentCredits >= required,
        needed: Math.max(0, required - currentCredits),
      };
    },
    [userProfile]
  );

  const logSecurityEvent = useCallback(
    (event: string, details?: Record<string, any>) => {
      console.log(`[SECURITY] ${event.toUpperCase()}`, {
        userId: user?.id,
        sessionId: sessionState.sessionId,
        timestamp: new Date().toISOString(),
        userAgent:
          typeof window !== 'undefined' ? window.navigator.userAgent : 'client',
        ...details,
      });
    },
    [user, sessionState.sessionId]
  );

  const signOut = useCallback(() => {
    logSecurityEvent('logout');
    router.push('/sign-in');
  }, [logSecurityEvent, router]);

  return {
    // Session state
    isLoaded,
    isAuthenticated: isSignedIn || false,
    user,
    sessionId: sessionState.sessionId,
    isExpiringSoon: sessionState.isExpiringSoon,
    isExpired: sessionState.isExpired,
    timeRemaining: sessionState.timeRemaining,

    // User profile
    userProfile,
    refreshUserProfile,

    // Utilities
    checkCredits,
    logSecurityEvent,
    signOut,
  };
}
