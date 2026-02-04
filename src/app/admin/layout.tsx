'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  QrCodeIcon,
  CreditCardIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuthUser } from '@/hooks/useAuthUser';
import Spinner from '@/components/ui/Spinner';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, exact: true },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'QR Codes', href: '/admin/qrcodes', icon: QrCodeIcon },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCardIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, signOut } = useAuthUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (isLoading) return;

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Check if user is admin via API
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push('/dashboard');
        }
      } catch {
        setIsAdmin(false);
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [user, isLoading, router]);

  if (isLoading || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ShieldCheckIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">Admin Panel</span>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.name || 'Admin'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Logged in as <span className="font-medium text-gray-900">{user?.email}</span>
              </span>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
