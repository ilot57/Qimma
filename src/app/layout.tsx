import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ClerkProvider } from '@clerk/nextjs';

import { SessionWarning } from '@/components/SessionWarning';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
          colorPrimary: '#2563eb',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          {children}
          <SessionWarning />
        </body>
      </html>
    </ClerkProvider>
  );
}
