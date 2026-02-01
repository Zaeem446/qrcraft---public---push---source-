"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { formatDate, PLANS } from "@/lib/utils";
import {
  CreditCardIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function BillingPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Unable to open billing portal");
    } catch {
      toast.error("Something went wrong");
    }
    setPortalLoading(false);
  };

  const trialEndsAt = profile?.trialEndsAt ? new Date(profile.trialEndsAt) : null;
  const isTrialing = profile?.subscriptionStatus === "trialing" && trialEndsAt && trialEndsAt > new Date();
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  const currentPlanKey = profile?.plan as keyof typeof PLANS | "free" | undefined;
  const currentPlanDetails = currentPlanKey && currentPlanKey !== "free" ? PLANS[currentPlanKey as keyof typeof PLANS] : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription and billing information</p>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="h-5 w-5" />
                <h3 className="font-semibold">Free Trial Active</h3>
              </div>
              <p className="text-white/80 text-sm">
                You have <strong>{trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""}</strong> remaining in your free trial.
                Upgrade to keep access to all features.
              </p>
            </div>
            <Link href="/pricing">
              <Button variant="secondary" size="sm">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Current Plan</h2>
        <p className="text-sm text-gray-500 mb-5">Your active subscription details.</p>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <CreditCardIcon className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 capitalize">
                {profile?.plan || "Free"} Plan
              </p>
              <p className="text-sm text-gray-500">
                Status: <span className="capitalize font-medium">{profile?.subscriptionStatus || "N/A"}</span>
              </p>
            </div>
          </div>
          {currentPlanDetails && (
            <p className="text-lg font-bold text-gray-900">
              ${currentPlanDetails.monthlyPrice}<span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
          )}
        </div>

        {/* Plan features */}
        {currentPlanDetails && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Included features:</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {currentPlanDetails.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manage Subscription */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Manage Subscription</h2>
        <p className="text-sm text-gray-500 mb-5">
          Update your payment method, change plan, or cancel your subscription.
        </p>

        <div className="flex flex-wrap gap-3">
          {profile?.stripeCustomerId ? (
            <Button
              onClick={handleManageSubscription}
              isLoading={portalLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              Open Billing Portal
            </Button>
          ) : (
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Choose a Plan
              </Button>
            </Link>
          )}
          <Link href="/pricing">
            <Button variant="outline">View All Plans</Button>
          </Link>
        </div>
      </div>

      {/* Billing Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Billing Information</h2>
        <p className="text-sm text-gray-500 mb-5">Your billing details and payment history.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Plan</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{profile?.plan || "Free"}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{profile?.subscriptionStatus || "N/A"}</p>
          </div>
          {trialEndsAt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Trial Ends</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(trialEndsAt)}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Customer ID</p>
            <p className="text-sm font-semibold text-gray-900 font-mono">
              {profile?.stripeCustomerId || "Not connected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
