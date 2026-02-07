"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuthUser } from "@/hooks/useAuthUser";
import { PRICING, PLAN_FEATURES, type BillingInterval } from "@/lib/utils";

const billingOptions: {
  key: BillingInterval;
  popular?: boolean;
}[] = [
  { key: "monthly" },
  { key: "annually", popular: true },
  { key: "quarterly" },
];

const pricingFAQ = [
  { q: "Do you refund unused subscriptions?", a: "We offer a full refund within 30 days of your initial purchase if you're not satisfied with the service. Contact support@qr-craft.online to request a refund." },
  { q: "What are my payment options?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) processed securely through Stripe with industry-standard encryption." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can easily cancel your subscription from your dashboard. Your plan will remain active until the end of your current billing period." },
  { q: "Can I change my billing cycle later?", a: "You can switch between monthly, quarterly, and annual billing at any time. Changes take effect at the next billing cycle." },
  { q: "What happens when my trial expires?", a: "Once your 14-day trial ends, you'll need to subscribe to a paid plan to continue creating and editing QR codes. Your existing codes and data will be preserved." },
  { q: "Why choose annual billing?", a: "Annual billing saves you 60% compared to monthly billing. That's like getting over 7 months free every year!" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function PricingFAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium text-gray-900">{q}</span>
        <ChevronDownIcon className={"h-5 w-5 text-gray-400 transition-transform duration-300 " + (open ? "rotate-180" : "")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PricingPage() {
  const { isAuthenticated } = useAuthUser();
  const router = useRouter();
  const [loadingInterval, setLoadingInterval] = useState<string | null>(null);

  const handleSubscribe = async (interval: BillingInterval) => {
    if (!isAuthenticated) {
      router.push("/auth/register");
      return;
    }
    setLoadingInterval(interval);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "professional", interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoadingInterval(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Plans <span className="text-violet-300">&</span> Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg mb-4"
          >
            Select the most convenient plan for you.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-200 text-sm"
          >
            Start with a free 14-day trial. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* Plan Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid md:grid-cols-3 gap-6"
        >
          {billingOptions.map((option) => {
            const plan = PRICING[option.key];
            const isPopular = option.popular;

            return (
              <motion.div
                key={option.key}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className={
                  "relative bg-white rounded-2xl border-2 p-8 shadow-lg " +
                  (isPopular
                    ? "border-blue-500 shadow-xl shadow-blue-500/10"
                    : "border-gray-200")
                }
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <SparklesIcon className="h-3.5 w-3.5" />
                    Most Popular
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount > 0 && (
                  <div className="absolute -top-3 -right-3 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xs font-bold">{plan.discount}%</span>
                  </div>
                )}

                <h3 className={
                  "text-xl font-bold text-center mb-1 " +
                  (isPopular ? "text-blue-600" : "text-gray-900")
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
                    onClick={() => handleSubscribe(option.key)}
                    disabled={loadingInterval === option.key}
                    className={
                      "w-full py-3 rounded-xl font-semibold transition-all " +
                      (isPopular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200")
                    }
                  >
                    {loadingInterval === option.key ? "Processing..." : "Buy Now"}
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <ul className="space-y-3">
                    {PLAN_FEATURES.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckIcon className={
                          "h-5 w-5 flex-shrink-0 mt-0.5 " +
                          (isPopular ? "text-blue-500" : "text-green-500")
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

        {/* All plans include */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">All plans include</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {["Dynamic QR codes", "Unlimited edits", "All QR types", "Multiple download formats", "No watermarks", "HTTPS redirects"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckIcon className="h-4 w-4 text-green-500" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-3">
            {pricingFAQ.map((item) => (
              <PricingFAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
