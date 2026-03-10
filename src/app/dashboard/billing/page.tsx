"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import { formatDate, PLAN_FEATURES } from "@/lib/utils";
import {
  CreditCardIcon,
  CheckCircleIcon,
  SparklesIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function BillingPage() {
  const [profile, setProfile] = useState<any>(null);
  const [subInfo, setSubInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const fetchProfile = () => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchSubInfo = () => {
    fetch("/api/square/portal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((data) => setSubInfo(data.subscription || null))
      .catch(console.error);
  };

  useEffect(() => {
    fetchProfile();
    fetchSubInfo();
  }, []);

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.")) return;
    setCancelLoading(true);
    try {
      const res = await fetch("/api/square/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Subscription canceled");
        fetchProfile();
        fetchSubInfo();
      } else {
        toast.error(data.error || "Failed to cancel subscription");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setCancelLoading(false);
  };

  const handleResumeSubscription = async () => {
    setResumeLoading(true);
    try {
      const res = await fetch("/api/square/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Subscription resumed");
        fetchProfile();
        fetchSubInfo();
      } else {
        toast.error(data.error || "Failed to resume subscription");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setResumeLoading(false);
  };

  const trialEndsAt = profile?.trialEndsAt ? new Date(profile.trialEndsAt) : null;
  const isTrialing = profile?.subscriptionStatus === "trialing" && trialEndsAt && trialEndsAt > new Date();
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  const isPaid = profile?.plan && profile.plan !== "free";
  const isActive = profile?.subscriptionStatus === "active";
  const isCanceled = profile?.subscriptionStatus === "canceled";
  const hasPendingCancel = !!subInfo?.pendingCancel;

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
                {isPaid ? "Premium Plan" : "Free Plan"}
              </p>
              <p className="text-sm text-gray-500">
                Status: <span className="capitalize font-medium">{profile?.subscriptionStatus || "N/A"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Plan features */}
        {isPaid && (
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Included features:</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {PLAN_FEATURES.map((feature) => (
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
          Change your plan or cancel your subscription.
        </p>

        <div className="flex flex-wrap gap-3">
          {profile?.squareSubscriptionId && isActive && !hasPendingCancel && (
            <Button
              onClick={handleCancelSubscription}
              isLoading={cancelLoading}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <XCircleIcon className="h-4 w-4" />
              Cancel Subscription
            </Button>
          )}
          {profile?.squareSubscriptionId && hasPendingCancel && (
            <>
              <p className="w-full text-sm text-amber-600 mb-1">
                Your subscription is set to cancel on{" "}
                <strong>{subInfo.pendingCancel.effectiveDate || "end of billing period"}</strong>.
              </p>
              <Button
                onClick={handleResumeSubscription}
                isLoading={resumeLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                <SparklesIcon className="h-4 w-4" />
                Undo Cancellation
              </Button>
            </>
          )}
          {profile?.squareSubscriptionId && isCanceled && !hasPendingCancel && (
            <Button
              onClick={handleResumeSubscription}
              isLoading={resumeLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <SparklesIcon className="h-4 w-4" />
              Resume Subscription
            </Button>
          )}
          {!profile?.squareSubscriptionId && (
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
        <p className="text-sm text-gray-500 mb-5">Your billing details.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Plan</p>
            <p className="text-sm font-semibold text-gray-900 capitalize">{isPaid ? "Premium" : "Free"}</p>
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
          {profile?.subscriptionEndsAt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Renews On</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(new Date(profile.subscriptionEndsAt))}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
