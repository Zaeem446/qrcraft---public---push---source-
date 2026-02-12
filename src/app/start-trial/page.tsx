'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { SparklesIcon, ShieldCheckIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { PRICING, PLAN_FEATURES } from '@/lib/utils';

type BillingInterval = 'monthly' | 'quarterly' | 'annually';

const billingOptions: { key: BillingInterval; popular?: boolean }[] = [
  { key: 'monthly' },
  { key: 'annually', popular: true },
  { key: 'quarterly' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function StartTrialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('annually');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkEligibility(retryCount = 0) {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) {
          router.push('/auth/login');
          return;
        }
        const data = await res.json();
        if (!data.requiresCardTrial || data.stripeSubscriptionId) {
          router.push('/dashboard');
          return;
        }
        // If user just paid but webhook hasn't fired yet, retry once after 2s
        if (data.requiresCardTrial && !data.stripeSubscriptionId && retryCount < 1) {
          await new Promise((r) => setTimeout(r, 2000));
          return checkEligibility(retryCount + 1);
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

  const handleStartTrial = async (interval?: BillingInterval) => {
    const chosen = interval || selectedInterval;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/stripe/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: chosen }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If API says already subscribed, redirect to dashboard
        if (data.redirect) {
          router.push(data.redirect);
          return;
        }
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6"
          >
            <SparklesIcon className="h-4 w-4" />
            7-Day Free Trial
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Start Your <span className="text-violet-300">Free Trial</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg mb-2"
          >
            Get full access to all features for 7 days.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-200 text-sm"
          >
            Just $0.99 card verification today. Cancel anytime.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        {canceled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm text-center"
          >
            Checkout was canceled. You can try again when you&apos;re ready.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Plan Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {billingOptions.map((option) => {
            const plan = PRICING[option.key];
            const isPopular = option.popular;
            const isSelected = selectedInterval === option.key;

            return (
              <motion.div
                key={option.key}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedInterval(option.key)}
                className={
                  'relative bg-white rounded-2xl border-2 p-8 shadow-lg cursor-pointer transition-all ' +
                  (isSelected
                    ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500'
                    : isPopular
                    ? 'border-blue-300 shadow-xl shadow-blue-500/5'
                    : 'border-gray-200 hover:border-gray-300')
                }
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    Best Value
                  </div>
                )}

                {plan.discount > 0 && (
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">{plan.discount}%</span>
                  </div>
                )}

                {/* Selection indicator */}
                <div className={
                  'absolute top-4 left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ' +
                  (isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300')
                }>
                  {isSelected && (
                    <CheckIcon className="h-3 w-3 text-white" />
                  )}
                </div>

                <h3 className={
                  'text-xl font-bold text-center mb-1 ' +
                  (isPopular ? 'text-blue-600' : 'text-gray-900')
                }>
                  {plan.label}
                </h3>

                <div className="text-center mt-6 mb-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg font-medium text-gray-500">$</span>
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.perMonth.toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm"> USD/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  {plan.discount > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Save {plan.discount}% vs monthly
                    </p>
                  )}
                </div>

                <div className="my-6">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStartTrial(option.key); }}
                    disabled={loading}
                    className={
                      'w-full py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ' +
                      (isPopular || isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200')
                    }
                  >
                    {loading && selectedInterval === option.key ? 'Processing...' : 'Start Free Trial'}
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <ul className="space-y-3">
                    {PLAN_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckIcon className={
                          'h-5 w-5 flex-shrink-0 mt-0.5 ' +
                          (isPopular || isSelected ? 'text-blue-500' : 'text-green-500')
                        } />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Payment Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CreditCardIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Today you pay: $0.99</h4>
                  <p className="text-sm text-gray-600">One-time card verification charge</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">7 days completely free</h4>
                  <p className="text-sm text-gray-600">Full access to all features</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheckIcon className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cancel anytime</h4>
                  <p className="text-sm text-gray-600">
                    After trial: ${selected.price.toFixed(2)}/{selectedInterval}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* All plans include */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">All plans include</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {['Dynamic QR codes', 'Unlimited edits', 'All QR types', 'Multiple download formats', 'No watermarks', 'HTTPS redirects'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckIcon className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-400">
            Secure payment powered by Stripe. Your card details are never stored on our servers.
          </p>
        </motion.div>
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
