import { NextRequest, NextResponse } from 'next/server';

import {
  getSessionInfo,
  getSessionTimeRemaining,
  isSessionExpired,
  isSessionExpiringSoon,
} from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  try {
    const sessionInfo = await getSessionInfo();

    if (!sessionInfo.isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
          isAuthenticated: false,
        },
        { status: 401 }
      );
    }

    const response = {
      isAuthenticated: sessionInfo.isAuthenticated,
      userId: sessionInfo.userId,
      sessionId: sessionInfo.sessionId,
      expiresAt: sessionInfo.expiresAt,
      isExpired: isSessionExpired(sessionInfo),
      isExpiringSoon: isSessionExpiringSoon(sessionInfo),
      timeRemaining: getSessionTimeRemaining(sessionInfo),
      user: sessionInfo.user
        ? {
            id: sessionInfo.user.id,
            email: sessionInfo.user.email,
            firstName: sessionInfo.user.firstName,
            lastName: sessionInfo.user.lastName,
            role: sessionInfo.user.role,
            subscriptionTier: sessionInfo.user.subscriptionTier,
            creditsRemaining: sessionInfo.user.creditsRemaining,
          }
        : null,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('Error getting session info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === 'refresh') {
      // For session refresh, we just return the current session info
      // Clerk handles the actual token refresh automatically
      const sessionInfo = await getSessionInfo();

      return NextResponse.json({
        data: {
          message: 'Session refreshed',
          sessionInfo: {
            isAuthenticated: sessionInfo.isAuthenticated,
            userId: sessionInfo.userId,
            sessionId: sessionInfo.sessionId,
            expiresAt: sessionInfo.expiresAt,
          },
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error handling session action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
