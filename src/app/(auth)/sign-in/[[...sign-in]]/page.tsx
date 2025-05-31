import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-primary-700 text-3xl font-bold">
            Welcome to Qimma
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your AI-powered exam correction platform
          </p>
        </div>
        <SignIn
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-primary-600 hover:bg-primary-700 text-sm normal-case',
              card: 'shadow-lg',
            },
          }}
        />
      </div>
    </div>
  );
}
