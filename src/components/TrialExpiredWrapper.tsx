"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TrialExpiredModal from "./TrialExpiredModal";

export default function TrialExpiredWrapper() {
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Don't show modal on billing page - user needs to be able to subscribe
  const isBillingPage = pathname === "/dashboard/billing";

  useEffect(() => {
    async function checkTrialStatus() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          const { subscriptionStatus, trialEndsAt } = data;

          // Check if trial has expired
          const isExpired =
            subscriptionStatus === "expired" ||
            (subscriptionStatus === "trialing" &&
              trialEndsAt &&
              new Date(trialEndsAt) < new Date());

          // Don't block if user has active subscription
          const hasActiveSubscription =
            subscriptionStatus === "active" || subscriptionStatus === "past_due";

          setIsTrialExpired(isExpired && !hasActiveSubscription);
        }
      } catch (error) {
        console.error("Failed to check trial status:", error);
      } finally {
        setLoading(false);
      }
    }

    checkTrialStatus();
  }, []);

  // Don't show anything while loading or on billing page
  if (loading || isBillingPage) return null;

  return <TrialExpiredModal isOpen={isTrialExpired} />;
}
