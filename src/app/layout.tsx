import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

import { SessionWarning } from '@/components/SessionWarning';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Qimma - AI-Powered Exam Correction Platform',
  description:
    'Automate exam grading with AI-powered correction, handwriting recognition, and comprehensive analytics for educators.',
  keywords:
    'AI, exam correction, education, grading, handwriting recognition, teachers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#10b981',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#1f2937',
          colorText: '#1f2937',
          colorTextSecondary: '#6b7280',
          colorSuccess: '#10b981',
          colorDanger: '#ef4444',
          colorWarning: '#f59e0b',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          borderRadius: '0.75rem',
        },
        elements: {
          card: 'shadow-xl border-0',
          headerTitle: 'text-gray-900 font-semibold',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
          formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          footerActionLink: 'text-emerald-600 hover:text-emerald-700',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${plusJakartaSans.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          {children}
          <SessionWarning />
        </body>
      </html>
    </ClerkProvider>
  );
}
