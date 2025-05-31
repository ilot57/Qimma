'use client';

import { useEffect, useState } from 'react';

import { redirect } from 'next/navigation';

import { useUser } from '@clerk/nextjs';
import { Plus } from 'lucide-react';

import { CreditDisplaySystem } from '@/components/dashboard/CreditDisplaySystem';
import { QuickActionCards } from '@/components/dashboard/QuickActionCards';
import { RealTimeDashboardStats } from '@/components/dashboard/RealTimeDashboardStats';
import { RealTimeExamList } from '@/components/dashboard/RealTimeExamList';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    // Debug logging
    console.log('🚀 Dashboard mounted');
  }, []);

  // Debug Clerk state
  useEffect(() => {
    console.log('👤 Clerk state:', { isLoaded, isSignedIn, userId: user?.id });
  }, [isLoaded, isSignedIn, user?.id]);

  // Show loading state while Clerk loads
  if (!mounted || !isLoaded) {
    console.log(
      '⏳ Dashboard loading - mounted:',
      mounted,
      'isLoaded:',
      isLoaded
    );

    return (
      <div className="p-6">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              <div className="mb-2 h-8 w-64 rounded bg-gray-200"></div>
              <div className="h-6 w-96 rounded bg-gray-200"></div>
            </div>
            <div className="h-12 w-40 rounded bg-gray-200"></div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 h-4 w-20 rounded bg-gray-200"></div>
                    <div className="mb-1 h-8 w-16 rounded bg-gray-200"></div>
                    <div className="h-4 w-24 rounded bg-gray-200"></div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Exam List Skeleton */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 h-6 w-32 rounded bg-gray-200"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isSignedIn) {
    console.log('🚫 Not signed in, redirecting...');
    redirect('/sign-in');
    return null;
  }

  console.log('✅ Dashboard rendering with user:', user?.firstName);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Here&apos;s what&apos;s happening with your exams today.
          </p>
        </div>

        {/* Create New Exam Button */}
        <Button
          size="lg"
          className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create a new exam
        </Button>
      </div>

      {/* Real-time Dashboard Stats */}
      <RealTimeDashboardStats userId={user.id} className="mb-8" />

      {/* Quick Action Cards */}
      <QuickActionCards className="mb-8" />

      {/* Credit Display System */}
      <CreditDisplaySystem userId={user.id} className="mb-8" />

      {/* Real-time Exam List */}
      <RealTimeExamList userId={user.id} className="mb-8" limit={8} />

      {/* Debug Info (Development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <details className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <summary className="cursor-pointer px-6 py-5 hover:bg-gray-50">
              <span className="text-lg font-semibold text-gray-900">
                🔧 Development Info
              </span>
            </summary>
            <div className="px-6 pb-5">
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <dt className="text-sm font-medium text-emerald-800">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-emerald-700">
                    ✅ Authenticated
                  </dd>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <dt className="text-sm font-medium text-blue-800">User ID</dt>
                  <dd className="mt-1 font-mono text-sm text-blue-700">
                    {user?.id?.slice(0, 12)}...
                  </dd>
                </div>
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                  <dt className="text-sm font-medium text-indigo-800">
                    Real-time Updates
                  </dt>
                  <dd className="mt-1 text-sm text-indigo-700">
                    ✅ Active (15s/30s intervals)
                  </dd>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <dt className="text-sm font-medium text-amber-800">
                    Components
                  </dt>
                  <dd className="mt-1 text-sm text-amber-700">
                    Stats + Exam List + Indicators
                  </dd>
                </div>
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
