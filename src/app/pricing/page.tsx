"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckIcon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const plans = [
  {
    id: "starter",
    name: "Starter",
    desc: "Perfect for individuals and small projects",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: [
      { text: "25 Dynamic QR Codes", included: true },
      { text: "10,000 Scans/month", included: true },
      { text: "Basic Analytics", included: true },
      { text: "PNG & SVG Download", included: true },
      { text: "Custom Colors", included: true },
      { text: "Email Support", included: true },
      { text: "Custom Logo", included: false },
      { text: "Bulk Creation", included: false },
      { text: "API Access", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    desc: "Best for growing businesses and teams",
    monthlyPrice: 19.99,
    yearlyPrice: 199.99,
    popular: true,
    features: [
      { text: "100 Dynamic QR Codes", included: true },
      { text: "100,000 Scans/month", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "All Download Formats", included: true },
      { text: "Custom Colors & Gradients", included: true },
      { text: "Priority Support", included: true },
      { text: "Custom Logo & Styling", included: true },
      { text: "Bulk Creation", included: true },
      { text: "API Access", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "For large organizations with advanced needs",
    monthlyPrice: 49.99,
    yearlyPrice: 499.99,
    features: [
      { text: "Unlimited QR Codes", included: true },
      { text: "Unlimited Scans", included: true },
      { text: "Full Analytics Suite", included: true },
      { text: "All Download Formats", included: true },
      { text: "White Label Options", included: true },
      { text: "Dedicated Support", included: true },
      { text: "Custom Logo & Styling", included: true },
      { text: "Bulk Creation", included: true },
      { text: "API Access", included: true },
    ],
  },
];

const pricingFAQ = [
  { q: "Do you offer refunds?", a: "We offer a full refund within 30 days of your initial purchase if you're not satisfied with the service. Contact support@qrcraft.com to request a refund." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) processed securely through Stripe with industry-standard encryption." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can easily cancel your subscription from the Settings page in your dashboard. Your plan will remain active until the end of your current billing period." },
  { q: "Can I change my plan later?", a: "You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle." },
  { q: "What happens when my trial expires?", a: "Once your 14-day trial ends, you'll need to subscribe to a paid plan to continue creating and editing QR codes. Your existing codes and data will be preserved." },
  { q: "Do you offer annual billing?", a: "Yes! You can save up to 17% by choosing annual billing. The discount is automatically applied when you select the yearly option." },
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
  const [yearly, setYearly] = useState(false);
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!isSignedIn) {
      router.push("/auth/register");
      return;
    }
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval: yearly ? "yearly" : "monthly" }),
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
    setLoadingPlan(null);
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
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-blue-100 text-lg mb-8"
          >
            Start with a free 14-day trial. No credit card required. Upgrade anytime.
          </motion.p>

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-2 py-1.5"
          >
            <button
              onClick={() => setYearly(false)}
              className={"px-5 py-2 rounded-full text-sm font-semibold transition-all " + (!yearly ? "bg-white text-gray-900 shadow-sm" : "text-white/80 hover:text-white")}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={"px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 " + (yearly ? "bg-white text-gray-900 shadow-sm" : "text-white/80 hover:text-white")}
            >
              Yearly
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">-17%</span>
            </button>
          </motion.div>
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
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              className={"relative bg-white rounded-2xl border-2 p-8 shadow-lg " + (plan.popular ? "border-blue-500 shadow-xl shadow-blue-500/10" : "border-gray-200")}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>

              <div className="mt-6 mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">${yearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                  <span className="text-gray-500">/{yearly ? "year" : "month"}</span>
                </div>
                {yearly && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    ${(plan.monthlyPrice * 12 - plan.yearlyPrice).toFixed(0)} saved per year
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loadingPlan === plan.id}
                className={"w-full py-3 rounded-xl font-semibold transition-all mb-6 " + (plan.popular ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25" : "bg-gray-100 text-gray-900 hover:bg-gray-200")}
              >
                {loadingPlan === plan.id ? "Processing..." : "Get Started"}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={"text-sm " + (feature.included ? "text-gray-700" : "text-gray-400")}>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
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
            {["Unlimited edits", "Dynamic QR codes", "Multiple download formats", "Cancel anytime", "No watermarks", "HTTPS redirects"].map((item) => (
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
