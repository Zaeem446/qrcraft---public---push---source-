'use client';

import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import AuthVisual from '@/components/auth/AuthVisual';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 bg-white">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <QrCodeIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">QRCraft</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-500">Sign in to continue to your dashboard</p>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none p-0 w-full',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all',
              socialButtonsBlockButtonText: 'font-medium',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-400',
              formFieldLabel: 'text-gray-700 font-medium',
              formFieldInput: 'w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all',
              formButtonPrimary: 'w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all',
              footerActionLink: 'text-blue-600 hover:text-blue-700 font-semibold',
              identityPreviewEditButton: 'text-blue-600',
            },
          }}
          routing="hash"
          forceRedirectUrl="/dashboard"
        />

        {/* Create account link */}
        <p className="mt-6 text-gray-600 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold">
            Create an account
          </Link>
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-auto pt-8">
          2024 &copy; QRCraft - &apos;QR Code&apos; is a trademark of DENSO WAVE INCORPORATED
        </p>
      </div>

      {/* Right side - Animated Visual */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthVisual />
      </div>
    </div>
  );
}
