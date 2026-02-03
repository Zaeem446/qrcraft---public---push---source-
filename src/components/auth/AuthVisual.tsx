'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCodeIcon } from '@heroicons/react/24/outline';

// Animated visual panel for auth pages - cycles between QR and phone mockup
export default function AuthVisual() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      {/* Animated content */}
      <div className="relative h-full flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {activeSlide === 0 ? (
            <motion.div
              key="qr"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex flex-col items-center"
            >
              {/* Hook/Hanger shape */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="120" height="100" viewBox="0 0 120 100" className="text-blue-400">
                  <path
                    d="M60 10 C60 10, 80 10, 80 30 C80 50, 60 50, 60 50 L60 95"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="60" cy="10" r="8" fill="currentColor" />
                </svg>
              </motion.div>

              {/* QR Code Card */}
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl shadow-blue-500/20 p-6 -mt-4"
              >
                <div className="w-48 h-48 relative">
                  {/* Stylized QR pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Corner squares */}
                    <rect x="5" y="5" width="25" height="25" rx="4" fill="#1e40af" />
                    <rect x="10" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="13" width="9" height="9" rx="1" fill="#1e40af" />

                    <rect x="70" y="5" width="25" height="25" rx="4" fill="#1e40af" />
                    <rect x="75" y="10" width="15" height="15" rx="2" fill="white" />
                    <rect x="78" y="13" width="9" height="9" rx="1" fill="#1e40af" />

                    <rect x="5" y="70" width="25" height="25" rx="4" fill="#1e40af" />
                    <rect x="10" y="75" width="15" height="15" rx="2" fill="white" />
                    <rect x="13" y="78" width="9" height="9" rx="1" fill="#1e40af" />

                    {/* Center logo area */}
                    <rect x="38" y="38" width="24" height="24" rx="4" fill="white" />
                    <rect x="42" y="42" width="16" height="16" rx="2" fill="#6366f1" />
                    <path d="M47 50 L50 53 L56 47" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Random dots pattern */}
                    {[
                      [35, 8], [42, 8], [49, 8], [56, 15], [63, 8],
                      [8, 35], [8, 42], [8, 49], [8, 56], [15, 63],
                      [35, 70], [42, 77], [49, 84], [56, 70], [63, 77],
                      [70, 35], [77, 42], [84, 49], [70, 56], [77, 63],
                      [35, 35], [63, 35], [35, 63], [63, 63],
                      [42, 28], [56, 28], [28, 42], [28, 56],
                      [70, 70], [77, 77], [84, 84], [84, 70], [70, 84],
                    ].map(([x, y], i) => (
                      <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#1e40af" opacity={0.8 + Math.random() * 0.2} />
                    ))}
                  </svg>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              {/* Phone mockup */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                {/* Phone frame */}
                <div className="w-[280px] h-[560px] bg-white rounded-[40px] shadow-2xl shadow-gray-400/30 border-8 border-gray-800 overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl" />

                  {/* Screen content */}
                  <div className="h-full bg-gray-50 pt-8 px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <QrCodeIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm">QRCraft</span>
                      </div>
                      <div className="w-6 h-4 flex flex-col justify-center gap-1">
                        <div className="w-full h-0.5 bg-gray-400 rounded" />
                        <div className="w-4 h-0.5 bg-gray-400 rounded" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">My QR codes</h3>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">+</span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-4 text-xs">
                      <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">All</span>
                      <span className="text-gray-400">Statics</span>
                      <span className="text-gray-400">Dynamics</span>
                      <span className="text-gray-400">Favs</span>
                    </div>

                    {/* QR Cards */}
                    {[
                      { name: 'My landing', type: 'Landing page', scans: '198k', views: '230k' },
                      { name: 'Service feedback', type: 'Feedback', scans: '10k', views: '12k' },
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <QrCodeIcon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                            </div>
                            <p className="text-[10px] text-blue-600">{item.type}</p>
                            <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                              <span>{item.scans} scans</span>
                              <span>{item.views} views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeSlide === i ? 'bg-blue-600 w-6' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
