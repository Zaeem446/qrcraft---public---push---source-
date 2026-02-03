'use client';

import { useEffect } from 'react';
import { useClerk } from '@clerk/nextjs';
import { QrCodeIcon } from '@heroicons/react/24/outline';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();

  useEffect(() => {
    handleRedirectCallback({}).catch((err) => {
      console.error('SSO callback error:', err);
    });
  }, [handleRedirectCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <QrCodeIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign in...</h2>
        <p className="text-gray-500">Please wait while we verify your account.</p>
        <div className="mt-6">
          <div className="w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
