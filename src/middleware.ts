import { NextResponse } from 'next/server';

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define route matchers for different protection levels
const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/features',
  '/api/webhooks/(.*)', // Webhooks need to be accessible
]);

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
]);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/exams(.*)',
  '/credits(.*)',
  '/settings(.*)',
  '/admin(.*)',
]);

const isApiRoute = createRouteMatcher([
  '/api/((?!webhooks).*)', // All API routes except webhooks
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = req.nextUrl.clone();

  // Handle API routes
  if (isApiRoute(req)) {
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Handle auth routes - redirect if already authenticated
  if (isAuthRoute(req) && userId) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Handle protected routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      url.pathname = '/sign-in';
      url.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(url);
    }

    // Role-based access control
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const metadata = sessionClaims?.metadata as { role?: string } | undefined;
      const role = metadata?.role;
      if (role !== 'admin' && role !== 'super_admin') {
        url.pathname = '/dashboard';
        url.searchParams.set('error', 'insufficient_permissions');
        return NextResponse.redirect(url);
      }
    }

    await auth.protect();
  }

  // Public routes are allowed through
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
