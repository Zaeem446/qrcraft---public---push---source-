"use client";

import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TrialExpiredModalProps {
  isOpen: boolean;
}

export default function TrialExpiredModal({ isOpen }: TrialExpiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 text-center shadow-2xl transition-all">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Your Trial Has Ended
          </h2>

          {/* Description */}
          <p className="mb-6 text-gray-600">
            Your 7-day free trial has expired. Subscribe now to continue creating
            and managing your QR codes, and keep your existing QR codes active.
          </p>

          {/* Features reminder */}
          <div className="mb-6 rounded-xl bg-gray-50 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              With a subscription you get:
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited dynamic QR codes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Unlimited scans & tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Edit QR codes anytime
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Advanced analytics
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/dashboard/billing")}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-violet-700 hover:to-purple-700 hover:shadow-xl"
          >
            Subscribe Now
          </button>

          {/* Secondary text */}
          <p className="mt-4 text-xs text-gray-400">
            Starting at $19.95/month • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
