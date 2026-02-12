'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { QrCodeIcon, CheckIcon } from '@heroicons/react/24/outline';
import { PRICING, PLAN_FEATURES } from '@/lib/utils';

type BillingInterval = 'monthly' | 'quarterly' | 'annually';

function StartTrialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('quarterly');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkEligibility() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();

        // If not an ad user or already has subscription, go to dashboard
        if (!data.requiresCardTrial || data.stripeSubscriptionId) {
          router.push('/dashboard');
          return;
        }
      } catch {
        router.push('/auth/login');
        return;
      } finally {
        setChecking(false);
      }
    }

    checkEligibility();
  }, [router]);

  const handleStartTrial = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: selectedInterval }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selected = PRICING[selectedInterval];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <QrCodeIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">QRCraft</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Start Your 7-Day Free Trial
          </h1>
          <p className="text-gray-500 text-lg">
            Get full access to all features. Cancel anytime during your trial.
          </p>
        </div>

        {canceled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm text-center">
            Checkout was canceled. You can try again when you&apos;re ready.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Billing Interval Selector */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose your billing plan</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(PRICING) as [BillingInterval, typeof PRICING[BillingInterval]][]).map(
              ([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSelectedInterval(key)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedInterval === key
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.discount > 0 && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">
                      SAVE {plan.discount}%
                    </span>
                  )}
                  <p className="font-semibold text-gray-900">{plan.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${plan.perMonth.toFixed(2)}
                    <span className="text-sm font-normal text-gray-500">/mo</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                  {key !== 'monthly' && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      ${plan.price.toFixed(2)} billed {key}
                    </p>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium text-gray-900">Card verification</p>
                <p className="text-sm text-gray-500">One-time charge to verify your card</p>
              </div>
              <p className="font-semibold text-gray-900">$0.99</p>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">Today you pay</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">$0.99</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mt-4">
              <p className="text-sm text-blue-800">
                After your <strong>7-day free trial</strong>, you&apos;ll be charged{' '}
                <strong>${selected.price.toFixed(2)}/{selectedInterval}</strong>.
                Cancel anytime before the trial ends to avoid being charged.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLAN_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStartTrial}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Redirecting to checkout...
            </>
          ) : (
            'Start Free Trial — $0.99 today'
          )}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}

export default function StartTrialPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <StartTrialContent />
    </Suspense>
  );
}
