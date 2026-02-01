'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  GlobeAltIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  MusicalNoteIcon,
  TicketIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  ChartBarIcon,
  PaintBrushIcon,
  BoltIcon,
  ShieldCheckIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  CursorArrowRaysIcon,
  Bars3Icon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  CameraIcon,
  HandThumbUpIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const qrTypes = [
  {
    id: 'website',
    name: 'Website',
    icon: GlobeAltIcon,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    desc: 'Spread the word about your business or personal website! Simply generate a QR code that leads to your URL.',
    preview: { title: 'My Website', url: 'https://example.com', subtitle: 'Visit our website for more info' },
  },
  {
    id: 'vcard',
    name: 'vCard',
    icon: UserIcon,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    desc: 'Transform your business card into a vCard QR code. Share all your details with a single scan, and update the content at any time.',
    preview: { title: 'John Smith', url: 'CEO at TechCorp', subtitle: '+1 (555) 123-4567' },
  },
  {
    id: 'menu',
    name: 'Menu',
    icon: ClipboardDocumentListIcon,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    desc: 'Paper menus are a thing of the past now that you can share your restaurant menus via QR codes.',
    preview: { title: 'Restaurant Menu', url: 'Today\'s Specials', subtitle: 'Scan to view full menu' },
  },
  {
    id: 'business',
    name: 'Business',
    icon: BuildingOfficeIcon,
    color: 'from-slate-600 to-gray-700',
    bgColor: 'bg-slate-50',
    textColor: 'text-slate-600',
    desc: 'Communicate vital business information like operating hours, contact info, and location with an editable QR code.',
    preview: { title: 'Business Page', url: 'Mon-Fri: 9AM - 5PM', subtitle: '123 Business Ave' },
  },
  {
    id: 'apps',
    name: 'Apps',
    icon: DevicePhoneMobileIcon,
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    desc: 'Save users time by sharing a link to the App Store and Google Play Store to help them download your latest app!',
    preview: { title: 'Download Our App', url: 'Available on iOS & Android', subtitle: '4.8 stars rating' },
  },
  {
    id: 'wifi',
    name: 'WiFi',
    icon: WifiIcon,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    desc: 'Your employees are probably sick of telling customers your WiFi password. Share access with a QR code instead!',
    preview: { title: 'WiFi Access', url: 'Network: CoffeeShop_5G', subtitle: 'Scan to connect automatically' },
  },
  {
    id: 'video',
    name: 'Video',
    icon: VideoCameraIcon,
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    desc: 'Link directly to your video content. Perfect for tutorials, promos, and product demos.',
    preview: { title: 'Watch Video', url: 'Product Demo 2025', subtitle: 'Duration: 3:45' },
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: DocumentIcon,
    color: 'from-amber-500 to-yellow-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    desc: 'Share PDF documents instantly. Brochures, catalogs, manuals — all accessible with one scan.',
    preview: { title: 'PDF Document', url: 'Product_Catalog.pdf', subtitle: '24 pages • 2.4 MB' },
  },
  {
    id: 'images',
    name: 'Images',
    icon: PhotoIcon,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    desc: 'Create a beautiful image gallery accessible by QR code. Perfect for portfolios and event photos.',
    preview: { title: 'Photo Gallery', url: '12 photos', subtitle: 'Wedding Collection 2025' },
  },
  {
    id: 'links',
    name: 'Links',
    icon: Bars3Icon,
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    desc: 'Share multiple links in one QR code. Like a mini landing page for all your important URLs.',
    preview: { title: 'My Links', url: '5 links', subtitle: 'Portfolio • Blog • Store' },
  },
  {
    id: 'mp3',
    name: 'MP3',
    icon: MusicalNoteIcon,
    color: 'from-fuchsia-500 to-purple-600',
    bgColor: 'bg-fuchsia-50',
    textColor: 'text-fuchsia-600',
    desc: 'Share audio files, podcasts, or music with a simple scan. No downloads needed.',
    preview: { title: 'Audio Track', url: 'Summer Vibes.mp3', subtitle: '3:22 • 4.1 MB' },
  },
  {
    id: 'coupon',
    name: 'Coupon',
    icon: TicketIcon,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    desc: 'Create digital coupons and discounts. Track redemptions and update offers in real-time.',
    preview: { title: '20% OFF', url: 'Code: SAVE20', subtitle: 'Valid until Dec 2025' },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: ChatBubbleLeftIcon,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    desc: 'Let customers start a WhatsApp conversation with you instantly. Pre-fill messages for quick support.',
    preview: { title: 'WhatsApp Chat', url: '+1 (555) 987-6543', subtitle: 'Tap to start chatting' },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: CameraIcon,
    color: 'from-pink-500 to-orange-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    desc: 'Grow your Instagram following. One scan takes users directly to your profile.',
    preview: { title: '@yourprofile', url: '12.5K followers', subtitle: 'Follow us on Instagram' },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: HandThumbUpIcon,
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    desc: 'Drive traffic to your Facebook page or group. Increase likes and engagement effortlessly.',
    preview: { title: 'Facebook Page', url: '5.2K likes', subtitle: 'Like & Follow us' },
  },
  {
    id: 'social',
    name: 'Social Media',
    icon: ShareIcon,
    color: 'from-violet-500 to-indigo-600',
    bgColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    desc: 'All your social media profiles in one QR code. One scan, all platforms.',
    preview: { title: 'Social Links', url: '6 platforms', subtitle: 'Connect everywhere' },
  },
  {
    id: 'review',
    name: 'Review',
    icon: StarIcon,
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    desc: 'Collect customer reviews easily. Direct scanners to your Google, Yelp, or Trustpilot page.',
    preview: { title: 'Leave a Review', url: '★★★★★', subtitle: 'We value your feedback' },
  },
  {
    id: 'event',
    name: 'Event',
    icon: CalendarIcon,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
    desc: 'Share event details, dates, location, and RSVP links. Perfect for conferences and parties.',
    preview: { title: 'Tech Summit 2025', url: 'May 15-17, 2025', subtitle: 'San Francisco, CA' },
  },
  {
    id: 'email',
    name: 'Email',
    icon: EnvelopeIcon,
    color: 'from-sky-500 to-blue-600',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-600',
    desc: 'Pre-compose emails for your customers. One scan opens their email client with everything filled in.',
    preview: { title: 'Send Email', url: 'hello@company.com', subtitle: 'Pre-filled subject & body' },
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: ChatBubbleBottomCenterTextIcon,
    color: 'from-lime-500 to-green-600',
    bgColor: 'bg-lime-50',
    textColor: 'text-lime-600',
    desc: 'Pre-compose text messages. Customers scan and send with one tap. Great for opt-ins.',
    preview: { title: 'Send SMS', url: '+1 (555) 000-0000', subtitle: 'Pre-filled message ready' },
  },
];

const features = [
  {
    title: 'Dynamic QR Codes',
    desc: 'Edit your QR code content anytime, even after printing. Update URLs, menus, or contact info without creating a new code.',
    icon: BoltIcon,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Advanced Analytics',
    desc: 'Track every scan in real-time. See device types, browsers, locations, and scan patterns on a beautiful dashboard.',
    icon: ChartBarIcon,
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Full Customization',
    desc: 'Match your brand with custom colors, gradients, dot patterns, eye styles, logos, and frame designs.',
    icon: PaintBrushIcon,
    color: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Enterprise Ready',
    desc: 'Secure redirects, 99.9% uptime, data encryption, and blazing fast sub-100ms redirect speeds.',
    icon: ShieldCheckIcon,
    color: 'from-emerald-500 to-teal-600',
  },
];

const steps = [
  { num: 1, title: 'Choose Your Type', desc: 'Pick from 20+ QR code types designed for every use case.', icon: QrCodeIcon },
  { num: 2, title: 'Add Your Content', desc: 'Fill in your details — URLs, contact info, menus, and more.', icon: SparklesIcon },
  { num: 3, title: 'Customize Design', desc: 'Brand it with your colors, logo, patterns, and frame styles.', icon: PaintBrushIcon },
  { num: 4, title: 'Download & Track', desc: 'Export in PNG, SVG, or JPG and track every scan.', icon: ArrowDownTrayIcon },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function HomePage() {
  const [activeType, setActiveType] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-rotate QR types
  useEffect(() => {
    if (autoPlay) {
      intervalRef.current = setInterval(() => {
        setActiveType((prev) => (prev + 1) % qrTypes.length);
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay]);

  const handleTypeClick = (index: number) => {
    setActiveType(index);
    setAutoPlay(false);
    // Resume autoplay after 10s
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const currentType = qrTypes[activeType];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
                <SparklesIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">20+ QR Code Types Available</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                The Most Advanced{' '}
                <span className="gradient-text">QR Code</span>{' '}
                Generator
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
                Create dynamic, fully customizable QR codes with powerful analytics.
                Edit content anytime, track every scan, and grow your business.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"
                >
                  Create QR Code Free
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all hover:-translate-y-0.5"
                >
                  View Pricing
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-6 flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  14-day free trial
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  Cancel anytime
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Interactive Phone Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="relative">
                {/* Phone frame */}
                <div className="w-[300px] sm:w-[340px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl shadow-gray-900/30">
                  {/* Screen */}
                  <div className="bg-white rounded-[2.4rem] overflow-hidden min-h-[580px] relative">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-8 pt-4 pb-2">
                      <span className="text-xs font-semibold text-gray-900">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-gray-900 rounded-sm relative">
                          <div className="absolute inset-0.5 bg-gray-900 rounded-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Preview content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="px-6 pt-4 pb-8"
                      >
                        {/* QR type header */}
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentType.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <currentType.icon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{currentType.preview.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{currentType.preview.url}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{currentType.preview.subtitle}</p>

                        {/* Fake QR code preview */}
                        <div className="mt-6 bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
                          <div className="w-40 h-40 relative">
                            <div className="absolute inset-0 grid grid-cols-7 grid-rows-7 gap-1">
                              {Array.from({ length: 49 }).map((_, i) => {
                                const isCorner =
                                  (i < 3 || (i >= 4 && i < 7)) && (i % 7 < 3 || i % 7 >= 4) ||
                                  (i >= 42 && i < 49 && i % 7 < 3);
                                const isRandom = Math.random() > 0.4;
                                return (
                                  <motion.div
                                    key={`${activeType}-${i}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.01, duration: 0.2 }}
                                    className={`rounded-sm ${
                                      isCorner || isRandom ? `bg-gradient-to-br ${currentType.color}` : 'bg-transparent'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <div className={`mt-6 bg-gradient-to-r ${currentType.color} text-white rounded-xl py-3 text-center font-semibold text-sm shadow-lg`}>
                          Scan to {currentType.name === 'vCard' ? 'Save Contact' : currentType.name === 'WiFi' ? 'Connect' : 'Open'}
                        </div>

                        {/* Stats preview */}
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                          <span>Scans today: 127</span>
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Active
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' as const }}
                  className="absolute -left-16 top-20 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden lg:flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CursorArrowRaysIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Scans</p>
                    <p className="text-sm font-bold text-gray-900">2.4M+</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' as const, delay: 0.5 }}
                  className="absolute -right-12 bottom-32 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 hidden lg:flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <QrCodeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">QR Codes</p>
                    <p className="text-sm font-bold text-gray-900">500K+</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QR Type Showcase - Interactive */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              One QR Code for <span className="gradient-text">Every Need</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from 20+ QR code types. Each one is dynamic, trackable, and fully customizable.
            </motion.p>
          </motion.div>

          {/* Type selector grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3 mb-10"
          >
            {qrTypes.map((type, index) => (
              <motion.button
                key={type.id}
                variants={scaleIn}
                onClick={() => handleTypeClick(index)}
                className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                  activeType === index
                    ? `border-blue-500 bg-blue-50 shadow-md shadow-blue-500/10`
                    : 'border-transparent bg-white hover:border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeType === index ? `bg-gradient-to-br ${type.color} text-white shadow-lg` : `${type.bgColor} ${type.textColor}`
                }`}>
                  <type.icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-medium truncate w-full text-center ${
                  activeType === index ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {type.name}
                </span>
                {activeType === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Selected type detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`bg-gradient-to-r ${currentType.color} rounded-3xl p-8 sm:p-12 text-white`}
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <currentType.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">{currentType.name} QR Code</h3>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">{currentType.desc}</p>
                  <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all group"
                  >
                    Create {currentType.name} QR Code
                    <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="flex justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="w-48 h-48 bg-white rounded-xl p-4 mx-auto">
                      <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-0.5">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <motion.div
                            key={`grid-${activeType}-${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.008 }}
                            className={`rounded-xs ${Math.random() > 0.45 ? 'bg-gray-900' : 'bg-white'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-center text-white/70 text-sm mt-4">Scan to preview</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools for creating, managing, and analyzing your QR codes
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-gray-900">
              Create Your QR Code in <span className="gradient-text">4 Simple Steps</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              From creation to tracking — it only takes a minute
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeInUp}
                className="relative text-center"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-blue-300 to-transparent" />
                )}
                <div className="relative inline-flex">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 rotate-3 hover:rotate-0 transition-transform">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'QR Codes Created', value: '500K+' },
              { label: 'Total Scans', value: '2.4M+' },
              { label: 'Happy Customers', value: '12K+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-gray-500 mt-1 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-10 sm:p-16 text-center"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white/10 rounded-full blur-2xl translate-x-1/3 translate-y-1/3" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Create Your First QR Code?
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of businesses already using QRCraft. Start your free 14-day trial today — no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
