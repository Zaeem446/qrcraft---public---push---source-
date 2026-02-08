'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';
import {
  PlusCircleIcon,
  ChartBarIcon,
  QrCodeIcon,
  UserCircleIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

const mainNav = [
  { href: '/dashboard/create', label: 'Create QR Code', icon: PlusCircleIcon },
  { href: '/dashboard/analytics', label: 'Analytics', icon: ChartBarIcon },
  { href: '/dashboard', label: 'My QR Codes', icon: QrCodeIcon, exact: true },
  { href: '/dashboard/folders', label: 'Folders', icon: FolderIcon },
  { href: '/dashboard/account', label: 'My Account', icon: UserCircleIcon },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCardIcon },
];

const footerNav = [
  { href: 'mailto:support@qr-craft.online', label: 'Contact us', icon: ChatBubbleLeftRightIcon, external: true },
  { href: '/faq', label: 'FAQs', icon: QuestionMarkCircleIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthUser();

  // TODO: Get trial info from database/API instead of session
  const isTrialing = false;
  const trialDaysLeft: number = 0;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center space-x-2.5 px-6 h-16 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
          <QrCodeIcon className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">QRCraft</span>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {mainNav.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-violet-600 rounded-r-full" />
              )}
              <item.icon className={`h-5 w-5 ${isActive ? 'text-violet-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Trial badge + Upgrade */}
      {isTrialing && (
        <div className="px-4 pb-3">
          <div className="bg-gray-50 rounded-xl p-3.5">
            <div className="flex items-center gap-2 mb-3">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">
                {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
              </span>
            </div>
            <Link href="/pricing">
              <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all">
                Upgrade
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Footer links */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-0.5">
        {footerNav.map((item) =>
          'external' in item && item.external ? (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <item.icon className="h-4.5 w-4.5 text-gray-400" />
              <span>{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <item.icon className="h-4.5 w-4.5 text-gray-400" />
              <span>{item.label}</span>
            </Link>
          )
        )}
      </div>
    </aside>
  );
}
