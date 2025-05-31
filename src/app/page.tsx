'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUser } from '@clerk/nextjs';

import {
  AuthenticatedCTA,
  AuthenticatedHeader,
  AuthenticationStatus,
} from '@/components/AuthenticatedContent';
import { Logo } from '@/components/ui/logo';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading state while Clerk loads or during redirect
  if (!isLoaded || isSignedIn) {
    return (
      <div className="from-primary-50 to-primary-100 flex min-h-screen items-center justify-center bg-gradient-to-br">
        <div className="text-center">
          <Logo size="lg" />
          <div className="mt-4">
            <div className="border-primary-600 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">
              {isSignedIn ? 'Redirecting to dashboard...' : 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="from-primary-50 to-primary-100 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Logo size="sm" />
            </div>
            <div className="flex items-center space-x-4">
              <AuthenticatedHeader />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">AI-Powered</span>
            <span className="text-primary-600 block">Exam Correction</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Transform your grading workflow with Qimma&apos;s intelligent exam
            correction platform. Save time, improve consistency, and provide
            better feedback to your students.
          </p>

          <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
            <AuthenticatedCTA />
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-primary-600 mb-4 text-3xl">🤖</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  AI-Powered Grading
                </h3>
                <p className="text-gray-500">
                  Advanced AI recognizes handwriting and evaluates answers with
                  human-like accuracy.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-primary-600 mb-4 text-3xl">⚡</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Save 80% Time
                </h3>
                <p className="text-gray-500">
                  Reduce grading time dramatically while maintaining
                  high-quality feedback.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="text-primary-600 mb-4 text-3xl">📊</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  Rich Analytics
                </h3>
                <p className="text-gray-500">
                  Get insights into student performance patterns and common
                  mistakes.
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          <AuthenticationStatus />
        </div>
      </main>
    </div>
  );
}
