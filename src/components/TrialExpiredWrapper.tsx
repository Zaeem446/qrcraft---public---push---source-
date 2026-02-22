"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import TrialExpiredModal from "./TrialExpiredModal";

function TrialExpiredWrapperInner() {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isBillingPage = pathname === "/dashboard/billing";

  const checkTrialStatus = useCallback(async (retryCount = 0): Promise<void> => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        const { subscriptionStatus, trialEndsAt, requiresCardTrial, stripeSubscriptionId } = data;

        // Ad users without subscription can freely use the dashboard
        // (download gating happens on the create page instead)
        if (requiresCardTrial && !stripeSubscriptionId) {
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
  }, []);

  useEffect(() => {
    checkTrialStatus();
  }, [checkTrialStatus]);

  if (loading || isBillingPage) return null;

  return <TrialExpiredModal isOpen={isTrialExpired} />;
}

export default function TrialExpiredWrapper() {
  return (
    <Suspense fallback={null}>
      <TrialExpiredWrapperInner />
    </Suspense>
  );
}
