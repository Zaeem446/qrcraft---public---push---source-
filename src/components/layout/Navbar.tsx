'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">QR</span>
            </div>
            <span className="text-xl font-bold text-gray-900">QRCraft</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link>
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="primary" size="sm">Dashboard</Button>
                </Link>
                <button onClick={() => signOut()} className="text-gray-600 hover:text-gray-900 transition-colors">Sign Out</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">Get Started Free</Button>
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/pricing" className="block text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Pricing</Link>
            <Link href="/faq" className="block text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>FAQ</Link>
            {session ? (
              <>
                <Link href="/dashboard" className="block" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Dashboard</Button>
                </Link>
                <button onClick={() => signOut()} className="block text-gray-600 hover:text-gray-900">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="block" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
