'use client';

import Link from 'next/link';

import { UserButton, useUser } from '@clerk/nextjs';

export function AuthenticatedHeader() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-4">
        <div className="h-8 w-20 animate-pulse rounded bg-gray-200"></div>
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <>
        <span className="text-sm text-gray-600">
          Welcome, {user?.firstName}!
        </span>
        <Link
          href="/dashboard"
          className="hover:bg-primary-700 bg-primary-600 rounded-md px-4 py-2 text-sm text-white transition-colors"
        >
          Dashboard
        </Link>
        <UserButton />
      </>
    );
  }

  return (
    <>
      <Link
        href="/sign-in"
        className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="hover:bg-primary-700 bg-primary-600 rounded-md px-4 py-2 text-sm text-white transition-colors"
      >
        Get Started
      </Link>
    </>
  );
}

export function AuthenticatedCTA() {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 md:h-16"></div>
        <div className="h-12 w-full animate-pulse rounded-md bg-gray-200 md:h-16"></div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
        <Link
          href="/dashboard"
          className="hover:bg-primary-700 bg-primary-600 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white transition-colors md:px-10 md:py-4 md:text-lg"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/exams/new"
          className="border-primary-600 text-primary-600 hover:bg-primary-50 flex w-full items-center justify-center rounded-md border bg-white px-8 py-3 text-base font-medium transition-colors md:px-10 md:py-4 md:text-lg"
        >
          Create New Exam
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
      <Link
        href="/sign-up"
        className="hover:bg-primary-700 bg-primary-600 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white transition-colors md:px-10 md:py-4 md:text-lg"
      >
        Get Started Free
      </Link>
      <Link
        href="/sign-in"
        className="border-primary-600 text-primary-600 hover:bg-primary-50 flex w-full items-center justify-center rounded-md border bg-white px-8 py-3 text-base font-medium transition-colors md:px-10 md:py-4 md:text-lg"
      >
        Sign In
      </Link>
    </div>
  );
}

export function AuthenticationStatus() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Don't render anything while loading
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="border-primary-200 bg-primary-50 mt-12 rounded-lg border p-4">
      <p className="text-primary-800 text-sm">
        ✅ You&apos;re signed in as{' '}
        <strong>{user?.emailAddresses[0]?.emailAddress}</strong>
      </p>
    </div>
  );
}
