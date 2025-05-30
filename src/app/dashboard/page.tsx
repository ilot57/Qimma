import { redirect } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-primary-700 text-2xl font-bold">Qimma</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName || 'User'}!
              </span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="rounded-lg border-4 border-dashed border-gray-200 p-8">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Welcome to Your Dashboard
              </h2>
              <p className="mb-6 text-lg text-gray-600">
                Authentication is working! You&apos;re successfully logged in.
              </p>

              {/* User Info Card */}
              <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Your Account Information
                </h3>
                <div className="space-y-2 text-left">
                  <p>
                    <span className="font-medium">User ID:</span> {userId}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span> {user?.firstName}{' '}
                    {user?.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{' '}
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                  <p>
                    <span className="font-medium">Joined:</span>{' '}
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  This is a protected route. Only authenticated users can see
                  this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
