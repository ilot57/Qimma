import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-primary-700 text-3xl font-bold">Join Qimma</h1>
          <p className="mt-2 text-gray-600">
            Start automating your exam corrections with AI
          </p>
        </div>
        <SignUp
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
