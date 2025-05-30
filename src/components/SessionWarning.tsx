'use client';

import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/useSession';

export function SessionWarning() {
  const { isExpiringSoon, isExpired, timeRemaining, isAuthenticated } =
    useSession();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissed state when session status changes
  useEffect(() => {
    if (!isExpiringSoon) {
      setDismissed(false);
    }
  }, [isExpiringSoon]);

  // Don't show if not authenticated, already dismissed, or no warning needed
  if (!isAuthenticated || dismissed || (!isExpiringSoon && !isExpired)) {
    return null;
  }

  const handleRefreshSession = async () => {
    // Trigger a page refresh to refresh the session
    window.location.reload();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (isExpired) {
    return (
      <Alert variant="destructive" className="fixed right-4 bottom-4 z-50 w-96">
        <AlertDescription>
          <div className="space-y-3">
            <p className="font-medium">Session Expired</p>
            <p className="text-sm">
              Your session has expired. Please sign in again to continue.
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => (window.location.href = '/sign-in')}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign In Again
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert
      variant="default"
      className="fixed right-4 bottom-4 z-50 w-96 border-amber-200 bg-amber-50"
    >
      <AlertDescription>
        <div className="space-y-3">
          <p className="font-medium text-amber-800">Session Expiring Soon</p>
          <p className="text-sm text-amber-700">
            Your session will expire in {timeRemaining} minute
            {timeRemaining !== 1 ? 's' : ''}. Would you like to refresh your
            session?
          </p>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleRefreshSession}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Refresh Session
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// Hook to monitor session status for debugging
export function useSessionMonitor() {
  const session = useSession();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Session Status:', {
        isAuthenticated: session.isAuthenticated,
        isExpiringSoon: session.isExpiringSoon,
        isExpired: session.isExpired,
        timeRemaining: session.timeRemaining,
        sessionId: session.sessionId,
      });
    }
  }, [session]);

  return session;
}
