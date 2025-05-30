import { redirect } from 'next/navigation';

import { currentUser } from '@clerk/nextjs/server';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Coins,
  Plus,
  TrendingUp,
} from 'lucide-react';

import { ExamList } from '@/components/dashboard/ExamList';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth/session';

export default async function DashboardPage() {
  // Use the new session management
  const sessionInfo = await requireAuth('/dashboard');

  if (!sessionInfo.isAuthenticated) {
    redirect('/sign-in');
  }

  const user = await currentUser();

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

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Exams */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
              <p className="mt-1 flex items-center text-sm text-emerald-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                +2 this week
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
              <p className="mt-1 text-sm text-emerald-600">
                67% completion rate
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Processing */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
              <p className="mt-1 text-sm text-amber-600">~5 min remaining</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Credits Remaining
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {sessionInfo.user?.creditsRemaining || 0}
              </p>
              <p className="mt-1 text-sm text-indigo-600">Standard plan</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
              <Coins className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Exam List Component */}
      <ExamList className="mb-8" />

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
                    {sessionInfo.userId?.slice(0, 12)}...
                  </dd>
                </div>
                {sessionInfo.user && (
                  <>
                    <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                      <dt className="text-sm font-medium text-indigo-800">
                        Role
                      </dt>
                      <dd className="mt-1 text-sm text-indigo-700 capitalize">
                        {sessionInfo.user.role}
                      </dd>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <dt className="text-sm font-medium text-amber-800">
                        Subscription
                      </dt>
                      <dd className="mt-1 text-sm text-amber-700 capitalize">
                        {sessionInfo.user.subscriptionTier}
                      </dd>
                    </div>
                  </>
                )}
              </div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
