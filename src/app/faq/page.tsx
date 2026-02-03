"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const faqCategories = [
  {
    name: "Basic Concepts",
    description: "Understanding QR codes and how they work",
    items: [
      {
        q: "How does a QR code generator work?",
        a: "Our platform allows you to generate QR codes that direct users to the data of your choice. When users scan your codes on their smartphones, they'll automatically access your website, contact information, social media pages, or other info."
      },
      {
        q: "How is this platform different from a free QR code generator?",
        a: "Free QR code websites have very limited customization tools and often include a branded watermark. Our platform provides advanced customization, robust analytics, and the ability to link your QR codes to nearly any digital content with full design control."
      },
      {
        q: "What content types can I store in a QR code?",
        a: "You can use our QR codes to redirect users to websites, vCards, WiFi networks, restaurant menus, PDFs, videos, images, social media pages, app downloads, coupons, events, emails, SMS messages, and much more — over 20 types in total."
      },
      {
        q: "How do static and dynamic QR codes differ?",
        a: "Static QR codes can't be edited after creation. Dynamic QR codes, on the other hand, can be edited whenever you want — even after printing. They also track usage data including where, when, and how each code is scanned."
      },
      {
        q: "How long does it take to generate my QR codes?",
        a: "Your QR code is created instantly! Once you've customized it to your exact specifications, you can download and share it immediately."
      },
      {
        q: "Do I need technology skills to create QR codes?",
        a: "Not at all! We make it as simple as possible to generate dynamic QR codes, with no design experience required. Just choose how you want your codes to look and what information you want them to display."
      },
    ],
  },
  {
    name: "Design & Creation",
    description: "Customizing and managing your QR codes",
    items: [
      {
        q: "Can I edit my QR code after creating it?",
        a: "Yes! Click the 'Edit' button for any QR code on your dashboard to make any modifications. You can change the content, update URLs, or modify the design — even after the QR code has been printed."
      },
      {
        q: "Can I use custom design elements for my QR codes?",
        a: "Our QR code generator makes it very simple to choose custom colors, gradients, dot patterns, eye styles, frames, and backgrounds. You can even integrate your business logo into the center of the QR code."
      },
      {
        q: "How can I add my business logo to a QR code?",
        a: "You can add your business logo by uploading it during the customization step in our QR code creator. We support PNG, JPG, and SVG formats. The logo is placed in the center of the QR code with adjustable size and margin."
      },
      {
        q: "How can I download my QR code?",
        a: "It's easy to save your custom QR codes from your dashboard. You can download in high-resolution PNG, SVG, and JPG file formats. SVG is recommended for print materials as it scales without losing quality."
      },
      {
        q: "Is there a limit to how many QR codes I can create?",
        a: "Limits depend on your plan. The Starter plan allows 25 dynamic QR codes, Professional allows 100, and Enterprise offers unlimited QR codes. All plans support unlimited edits to existing codes."
      },
      {
        q: "Can I download QR codes created during my trial?",
        a: "You sure can! We invite you to take full advantage of your 14-day trial period to see what our platform can really do. All features are available during the trial."
      },
    ],
  },
  {
    name: "Scanning, Analytics & Billing",
    description: "Tracking scans and managing your account",
    items: [
      {
        q: "How do people scan QR codes?",
        a: "Nearly all modern smartphones scan QR codes automatically within the camera app. Simply point the camera at the QR code and a notification will appear to open the link. If this doesn't work, download any free QR code reader app."
      },
      {
        q: "Can dynamic QR codes track usage data?",
        a: "This is one of the most valuable aspects of dynamic QR codes. Our platform tracks when, where, and how people scan your QR codes. You can view detailed analytics in your dashboard including device types, browsers, locations, and scan patterns."
      },
      {
        q: "Do dynamic QR codes track scan counts?",
        a: "We track how often every QR code is scanned, in addition to tracking data about the device, browser, operating system, and approximate location of each scan."
      },
      {
        q: "Can customers scan a QR code from my website?",
        a: "Yes — you can add QR codes to your website and many other locations. Print them on paper, integrate them in your email signature, use them on social media, display them in stores, and more."
      },
      {
        q: "How can I print my QR code?",
        a: "Simply download your QR code in your chosen file format and either print it from your computer or use it in marketing materials. We recommend SVG format for print as it maintains perfect quality at any size."
      },
      {
        q: "What happens to my QR codes if I cancel my subscription?",
        a: "If you cancel your subscription, your QR codes will remain in your dashboard but you won't be able to edit them or access analytics data. Existing QR codes will continue to redirect until the end of your billing period."
      },
      {
        q: "What happens to my QR codes after the trial period?",
        a: "Once the trial period ends, your QR codes won't be deleted. However, you'll need to subscribe to a paid plan to continue editing codes and accessing analytics data."
      },
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div variants={fadeInUp} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-gray-300 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="font-medium text-gray-900 pr-4 group-hover:text-blue-600 transition-colors">{q}</span>
        <ChevronDownIcon className={"h-5 w-5 text-gray-400 flex-shrink-0 transition-transform duration-300 " + (open ? "rotate-180 text-blue-600" : "")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-gray-600 leading-relaxed">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);

  const filteredCategories = faqCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const hasResults = filteredCategories.some((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 py-16 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-blue-100 text-lg mb-8"
          >
            Everything you need to know about QRCraft and dynamic QR codes
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative max-w-lg mx-auto"
          >
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/95 backdrop-blur text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {faqCategories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(i)}
              className={"px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm " + (activeCategory === i ? "bg-blue-600 text-white shadow-blue-500/25" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200")}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {search ? (
          hasResults ? (
            filteredCategories.map(
              (cat) =>
                cat.items.length > 0 && (
                  <div key={cat.name} className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.name}</h2>
                    <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
                      {cat.items.map((item) => (
                        <FAQItem key={item.q} q={item.q} a={item.a} />
                      ))}
                    </motion.div>
                  </div>
                )
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No results found for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-3 text-blue-600 hover:text-blue-700 font-medium">Clear search</button>
            </div>
          )
        ) : (
          <div>
            <div className="mb-2">
              <p className="text-sm text-gray-500 mb-6">{faqCategories[activeCategory].description}</p>
            </div>
            <motion.div key={activeCategory} initial="hidden" animate="visible" variants={stagger} className="space-y-3">
              {faqCategories[activeCategory].items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Get in touch with our support team.</p>
          <div className="flex gap-4 justify-center">
            <a href="mailto:support@qrcraft.com" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25">
              Contact Support
            </a>
            <Link href="/pricing" className="inline-flex items-center px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all">
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
