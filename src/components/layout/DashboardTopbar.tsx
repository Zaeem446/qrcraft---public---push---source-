'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  HomeIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CogIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: HomeIcon },
  { href: '/dashboard/create', label: 'Create QR', icon: PlusCircleIcon },
  { href: '/dashboard/analytics', label: 'Analytics', icon: ChartBarIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: CogIcon },
];

export default function DashboardTopbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:ml-64">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm text-gray-600">{session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <span className="text-xl font-bold">QRCraft</span>
              <button onClick={() => setMobileOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
