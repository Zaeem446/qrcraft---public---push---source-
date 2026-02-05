'use client';

import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function QRExpiredPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">QR Code Unavailable</h1>
        <p className="text-gray-600 mb-8">
          This QR code is no longer active. The owner&apos;s subscription may have expired or the QR code has been deactivated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors"
        >
          Go to QRCraft
        </Link>
      </div>
    </div>
  );
}
