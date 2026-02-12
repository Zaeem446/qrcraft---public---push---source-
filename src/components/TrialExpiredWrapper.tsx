"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import TrialExpiredModal from "./TrialExpiredModal";

function TrialExpiredWrapperInner() {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isAdUserBlocked, setIsAdUserBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isSuccess = searchParams.get("success") === "true";
  const isBillingPage = pathname === "/dashboard/billing";

  const checkTrialStatus = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        const { subscriptionStatus, trialEndsAt, requiresCardTrial, stripeSubscriptionId } = data;

        // Ad user without subscription — but if just paid, wait for webhook
        if (requiresCardTrial && !stripeSubscriptionId) {
          const maxRetries = isSuccess ? 8 : 3;
          if (retryCount < maxRetries) {
            // Webhook hasn't processed yet — retry after delay
            await new Promise((r) => setTimeout(r, 2000));
            return checkTrialStatus(retryCount + 1);
          }
          setIsAdUserBlocked(true);
          setLoading(false);
          return;
        }

        // Check if trial has expired
        const isExpired =
          subscriptionStatus === "expired" ||
          (subscriptionStatus === "trialing" &&
            trialEndsAt &&
            new Date(trialEndsAt) < new Date());

        const hasActiveSubscription =
          subscriptionStatus === "active" || subscriptionStatus === "past_due";

        setIsTrialExpired(isExpired && !hasActiveSubscription);
      }
    } catch (error) {
      console.error("Failed to check trial status:", error);
    } finally {
      setLoading(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  if (loading || isBillingPage) return null;

  // Ad user blocked — show special modal
  if (isAdUserBlocked) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform rounded-2xl bg-white p-8 text-center shadow-2xl transition-all">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Start Your Free Trial
            </h2>
            <p className="mb-6 text-gray-600">
              Complete a quick setup to activate your 7-day free trial and unlock
              full access to the dashboard.
            </p>
            <button
              onClick={() => router.push("/start-trial")}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
            >
              Start Free Trial
            </button>
            <p className="mt-4 text-xs text-gray-400">
              Only $0.99 card verification — 7 days free
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <TrialExpiredModal isOpen={isTrialExpired} />;
}

export default function TrialExpiredWrapper() {
  return (
    <Suspense fallback={null}>
      <TrialExpiredWrapperInner />
    </Suspense>
  );
}
