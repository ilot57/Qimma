import { redirect } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';

import { requireAuth } from '@/lib/auth/session';

export default async function DashboardPage() {
  // Use the new session management
  const sessionInfo = await requireAuth('/dashboard');

  if (!sessionInfo.isAuthenticated) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Qimma AI Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}!
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Session Info Card */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Authentication Status
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <dt className="text-sm font-medium text-green-800">Status</dt>
                  <dd className="mt-1 text-sm text-green-600">
                    ✅ Authenticated
                  </dd>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <dt className="text-sm font-medium text-blue-800">User ID</dt>
                  <dd className="mt-1 font-mono text-sm text-blue-600">
                    {sessionInfo.userId?.slice(0, 12)}...
                  </dd>
                </div>
                {sessionInfo.user && (
                  <>
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                      <dt className="text-sm font-medium text-purple-800">
                        Role
                      </dt>
                      <dd className="mt-1 text-sm text-purple-600 capitalize">
                        {sessionInfo.user.role}
                      </dd>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                      <dt className="text-sm font-medium text-orange-800">
                        Credits
                      </dt>
                      <dd className="mt-1 text-sm text-orange-600">
                        {sessionInfo.user.creditsRemaining} remaining
                      </dd>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* User Profile Card */}
          {sessionInfo.user && (
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Profile
                </h3>
                <div className="mt-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {sessionInfo.user.email}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {sessionInfo.user.firstName} {sessionInfo.user.lastName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Subscription Tier
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">
                        {sessionInfo.user.subscriptionTier}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Member Since
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {new Date(
                          sessionInfo.user.createdAt
                        ).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Quick Actions
              </h3>
              <div className="mt-4 flex space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Create New Exam
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  View Past Exams
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Purchase Credits
                </button>
              </div>
            </div>
          </div>

          {/* Placeholder for future features */}
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Coming Soon
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Exam management, analytics, and more features will be available
              here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
