"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const sections = [
  {
    title: "1. Agreement to Terms",
    content: "By accessing and using QRCraft (\"the Service\"), operated at 5840 Red Bug Lake Rd 2047, Winter Springs, Florida 32708, USA, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use our Service. These terms apply to all visitors, users, and others who access or use the Service. We reserve the right to modify these terms at any time, with updates indicated by changing the \"Last updated\" date."
  },
  {
    title: "2. Our Services",
    content: "QRCraft offers a subscription-based service for creating, customizing, managing, and analyzing dynamic QR codes. The Service includes QR code generation, design customization, analytics tracking, file hosting, and related tools. The Service is provided in English. Registration requires a valid email address. Users can manage their subscriptions through the Settings page in their dashboard."
  },
  {
    title: "3. Electronic Communications Consent",
    content: "By creating an account or using the Service, you consent to receive electronic communications from us, including but not limited to emails, push notifications, and in-app messages. You agree that all agreements, notices, disclosures, and other communications we provide to you electronically satisfy any legal requirement that such communications be in writing. You may withdraw your consent to receive marketing communications at any time by unsubscribing, but transactional and account-related communications are required as part of the Service."
  },
  {
    title: "4. Intellectual Property Rights",
    content: "QRCraft and its original content, features, and functionality are owned by QRCraft and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You are granted a non-exclusive, non-transferable, revocable license to access and use the Service. QR codes generated with QRCraft can be used for commercial purposes under any active paid subscription."
  },
  {
    title: "5. User Accounts",
    content: "When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password and for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account. We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion."
  },
  {
    title: "6. User Representations",
    content: "By using the Service, you represent and warrant that: (a) all registration information you submit is truthful and accurate; (b) you will maintain the accuracy of such information; (c) you have the legal capacity to agree to these terms; (d) you are at least 18 years of age; (e) you will not access the Service through automated or non-human means; (f) you will not use the Service for any illegal or unauthorized purpose; and (g) your use will not violate any applicable law or regulation."
  },
  {
    title: "7. Purchases, Payments & Subscriptions",
    content: "We accept payment via Visa, Mastercard, American Express, and other major credit/debit cards processed securely through Square. All prices are displayed in USD. Your subscription renews automatically unless canceled before the next billing period. Your payment method will be automatically charged at the end of any free trial period and at each renewal. You may cancel your subscription at any time through your dashboard Settings page. We will provide notice before any fee increases take effect."
  },
  {
    title: "8. Free Trial",
    content: "New users receive a 7-day free trial with full access to all features. A valid payment method is required to start the trial, but you will not be charged during the trial period. You may cancel anytime before the trial ends. At the end of the 7-day trial, your payment method will be automatically charged for your selected plan. Your QR codes and data will be preserved after the trial ends."
  },
  {
    title: "9. Cancellation & Refund Policy",
    content: "All fees are non-refundable. You may cancel your subscription at any time from your dashboard Settings page. Upon cancellation, you will retain full access to all features until the end of your current billing period. After the billing period ends, your account will revert to a limited state. No partial refunds or credits are issued for unused time. We do not provide prorated refunds for any reason."
  },
  {
    title: "10. Prohibited Activities",
    content: "You must not use the Service to: (a) create QR codes linking to malware, phishing, or harmful content; (b) distribute spam or unsolicited communications; (c) violate any intellectual property rights; (d) upload content that is obscene, harassing, threatening, or defamatory; (e) impersonate any person or entity; (f) interfere with or disrupt the Service; (g) attempt to gain unauthorized access to any systems; or (h) use the Service for any illegal purpose."
  },
  {
    title: "11. Data Responsibility",
    content: "You are solely responsible for all content, URLs, and data that you link to via QR codes created through the Service. QRCraft does not monitor, endorse, or assume liability for any third-party content accessed through QR codes generated on our platform. You agree not to use the Service to link to any content that is unlawful, harmful, or violates the rights of others. QRCraft reserves the right to disable any QR code that violates these terms or applicable law."
  },
  {
    title: "12. Privacy Policy",
    content: "Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection and use of information as described in our Privacy Policy. Please review our Privacy Policy to understand our practices."
  },
  {
    title: "13. Service Availability",
    content: "We strive to maintain 99.9% uptime for our QR code redirect service. However, we do not guarantee uninterrupted, timely, or error-free operation. The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control. We reserve the right to modify, suspend, or discontinue any part of the Service at any time."
  },
  {
    title: "14. Limitation of Liability",
    content: "THE SERVICE IS PROVIDED ON AN \"AS-IS\" AND \"AS-AVAILABLE\" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, QRCRAFT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY YOU DURING THE SIX MONTHS PRECEDING THE CLAIM."
  },
  {
    title: "15. Indemnification",
    content: "You agree to defend, indemnify, and hold harmless QRCraft, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, damages, losses, liabilities, and expenses arising out of or related to your use of the Service or violation of these terms."
  },
  {
    title: "16. Termination",
    content: "We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these terms. Upon termination, your right to use the Service will immediately cease. All provisions of these terms which should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability."
  },
  {
    title: "17. Dispute Resolution & Arbitration",
    content: "Any dispute, controversy, or claim arising out of or relating to these terms or the Service shall be resolved through binding individual arbitration administered under the rules of the American Arbitration Association (AAA). Before initiating arbitration, you agree to first attempt to resolve the dispute informally by contacting us at support@qr-craft.online and allowing 30 days for resolution. YOU AGREE THAT ANY ARBITRATION SHALL BE CONDUCTED ON AN INDIVIDUAL BASIS AND NOT AS A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. You waive any right to participate in a class action lawsuit or class-wide arbitration. Either party may bring claims in small claims court in Seminole County, Florida, if the claim qualifies. The arbitration shall take place in Seminole County, Florida, or at another mutually agreed location."
  },
  {
    title: "18. Governing Law",
    content: "These terms shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions. Any legal action or proceeding not subject to arbitration shall be brought exclusively in the state or federal courts located in Seminole County, Florida, and you consent to the personal jurisdiction of such courts."
  },
  {
    title: "19. Changes to Terms",
    content: "We reserve the right to update or modify these terms at any time. We will notify users of any material changes by updating the \"Last updated\" date. Your continued use of the Service after any modifications constitutes acceptance of the updated terms."
  },
  {
    title: "20. Contact Us",
    content: "If you have any questions about these Terms and Conditions, please contact us at support@qr-craft.online or write to us at: QRCraft, 5840 Red Bug Lake Rd 2047, Winter Springs, Florida 32708, USA."
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TermsPage() {
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
            Terms and Conditions
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
            Welcome to QRCraft. These Terms and Conditions govern your use of our website and services. By accessing or using QRCraft, you agree to comply with and be bound by the following terms and conditions.
          </motion.p>

          {sections.map((section) => (
            <motion.div key={section.title} variants={fadeInUp} className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex gap-4">
          <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Privacy Policy</Link>
          <Link href="/faq" className="text-blue-600 hover:text-blue-700 font-medium text-sm">FAQ</Link>
          <a href="mailto:support@qr-craft.online" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Contact Support</a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
