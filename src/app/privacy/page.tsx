"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us when registering for an account, including your name, email address, and password. When you sign in via Google or Facebook through Clerk, we receive your name, email address, and profile photo. We do not access your contacts, posts, or other social data. When you make a purchase, our payment processor Stripe collects your payment information — we do not store credit card details on our servers. We also collect usage data automatically, including IP addresses, browser type, device characteristics, operating system, language preferences, referring URLs, and timestamps."
  },
  {
    title: "2. QR Code Scan Data",
    content: "When someone scans a QR code created through QRCraft, we collect anonymous scan data including: approximate geographic location (derived from the scanner's IP address), device type (mobile, tablet, desktop), browser name and version, operating system, and timestamp. This data is used to provide analytics to QR code owners. Scanner IP addresses are not shared with QR code owners — only aggregate location data (country/city level) is displayed."
  },
  {
    title: "3. How We Use Your Information",
    content: "We use the information we collect to: (a) create and manage your account; (b) process payments and subscriptions; (c) provide, maintain, and improve our services; (d) generate analytics reports for your QR codes; (e) send you technical notices, updates, and support messages; (f) respond to your comments, questions, and customer service requests; (g) monitor and analyze trends, usage, and activities; and (h) detect, investigate, and prevent security incidents."
  },
  {
    title: "4. Legal Bases for Processing (GDPR)",
    content: "If you are located in the European Economic Area (EEA), we process your personal data under the following legal bases: (a) Consent — for marketing emails and advertising cookies, which you may withdraw at any time; (b) Contract — to provide your account, process payments, and deliver the Service you subscribed to; (c) Legitimate Interest — for analytics, security monitoring, and fraud prevention, where our interests do not override your rights; (d) Legal Obligation — to comply with tax requirements and respond to lawful requests from authorities. EU/EEA users may withdraw consent at any time by contacting support@qr-craft.online or adjusting their account settings."
  },
  {
    title: "5. Data Storage and Security",
    content: "Your data is stored securely using PostgreSQL via Supabase with encryption at rest and in transit. We implement appropriate technical and organizational security measures including HTTPS encryption for all connections, bcrypt password hashing, secure session management, and regular security audits. While we strive to protect your personal information, no method of transmission over the Internet is 100% secure."
  },
  {
    title: "6. Third-Party Services",
    content: "We use the following third-party services that may collect or process information: Stripe for payment processing (subject to Stripe's Privacy Policy); Clerk for authentication and social OAuth login (subject to Clerk's Privacy Policy); Resend for transactional emails such as account confirmations and receipts; MailerLite for marketing email communications; Google Ads for conversion tracking and advertising measurement; Meta Pixel for advertising measurement and audience insights; and ip-api.com for anonymous IP geolocation of QR code scans. Each of these services has their own privacy policy governing the use of your information."
  },
  {
    title: "7. Cookies and Tracking",
    content: "We use cookies and similar tracking technologies organized into three categories: (a) Essential Cookies — required for the Service to function, including Clerk authentication cookies and user preference cookies, which cannot be disabled; (b) Analytics Cookies — used to understand how visitors interact with the Service, helping us improve functionality and user experience; (c) Advertising Cookies — used by Google Ads and Meta Pixel to measure ad conversions, build audience segments, and deliver relevant advertisements. You can manage or disable non-essential cookies through your browser settings. To opt out of Google Ads personalization, visit Google's Ad Settings. To opt out of Meta tracking, visit your Facebook Ad Preferences."
  },
  {
    title: "8. Data Retention",
    content: "We retain your personal information for as long as your account is active or as needed to provide you services. Scan analytics data is retained for the duration of your subscription. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes. Anonymized and aggregated data may be retained indefinitely."
  },
  {
    title: "9. Your Rights",
    content: "Depending on your jurisdiction, you may have the right to: (a) access, correct, or delete your personal data through your account settings; (b) export your data in a portable format; (c) withdraw consent for data processing at any time; (d) object to processing of your personal data; (e) lodge a complaint with a data protection authority. To exercise these rights, contact us at support@qr-craft.online or manage your data through your dashboard Settings page."
  },
  {
    title: "10. Your California Privacy Rights (CCPA)",
    content: "If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA): (a) Right to Know — you may request details about the categories and specific pieces of personal information we have collected about you; (b) Right to Delete — you may request deletion of your personal information, subject to certain exceptions; (c) Right to Opt-Out of Sale — we do NOT sell your personal information to third parties; (d) Right to Non-Discrimination — we will not discriminate against you for exercising any of your CCPA rights. To exercise these rights, contact us at support@qr-craft.online. We will respond to verifiable requests within 45 days."
  },
  {
    title: "11. Children's Privacy",
    content: "Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will take steps to delete such information. If you are a parent or guardian and believe your child has provided us with personal data, please contact us."
  },
  {
    title: "12. International Data Transfers",
    content: "Our services are hosted in the United States. If you access the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States. By using the Service, you consent to the transfer of your information to the United States."
  },
  {
    title: "13. Updates to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the \"Last updated\" date. We encourage you to review this Privacy Policy periodically for any changes."
  },
  {
    title: "14. Contact Us",
    content: "If you have any questions about this Privacy Policy or our data practices, please contact us at support@qr-craft.online or write to us at: QRCraft, 5840 Red Bug Lake Rd 2047, Winter Springs, Florida 32708, USA."
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-3"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            Last updated: February 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}>
          <motion.p variants={fadeInUp} className="text-gray-600 mb-8 leading-relaxed">
            At QRCraft, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our QR code generation and analytics platform.
          </motion.p>

          {sections.map((section) => (
            <motion.div key={section.title} variants={fadeInUp} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
          <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Terms of Service</Link>
          <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-medium text-sm">FAQ</Link>
          <a href="mailto:support@qr-craft.online" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Contact Support</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
