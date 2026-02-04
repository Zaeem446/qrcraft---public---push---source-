'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UsersIcon,
  QrCodeIcon,
  CursorArrowRaysIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import Spinner from '@/components/ui/Spinner';

interface Stats {
  overview: {
    totalUsers: number;
    newUsersThisMonth: number;
    totalQRCodes: number;
    activeQRCodes: number;
    inactiveQRCodes: number;
    totalScans: number;
    scansThisMonth: number;
  };
  subscriptions: {
    active: number;
    trialing: number;
    expired: number;
  };
  usersByPlan: { plan: string; count: number }[];
  recentUsers: any[];
  topQRCodes: any[];
  scansChart: { date: string; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats.overview.totalUsers,
      change: `+${stats.overview.newUsersThisMonth} this month`,
      icon: UsersIcon,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      name: 'Total QR Codes',
      value: stats.overview.totalQRCodes,
      change: `${stats.overview.activeQRCodes} active`,
      icon: QrCodeIcon,
      color: 'bg-violet-500',
      href: '/admin/qrcodes',
    },
    {
      name: 'Total Scans',
      value: stats.overview.totalScans.toLocaleString(),
      change: `${stats.overview.scansThisMonth.toLocaleString()} this month`,
      icon: CursorArrowRaysIcon,
      color: 'bg-green-500',
      href: '/admin/analytics',
    },
    {
      name: 'Active Subscriptions',
      value: stats.subscriptions.active,
      change: `${stats.subscriptions.trialing} trialing`,
      icon: CreditCardIcon,
      color: 'bg-amber-500',
      href: '/admin/subscriptions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                <ArrowTrendingUpIcon className="h-3 w-3" />
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{stats.subscriptions.active}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Trialing</span>
              <span className="font-semibold text-blue-600">{stats.subscriptions.trialing}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Expired</span>
              <span className="font-semibold text-red-600">{stats.subscriptions.expired}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Plan</h3>
          <div className="space-y-4">
            {stats.usersByPlan.map((item) => (
              <div key={item.plan} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{item.plan}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active</span>
              <span className="font-semibold text-green-600">{stats.overview.activeQRCodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inactive</span>
              <span className="font-semibold text-red-600">{stats.overview.inactiveQRCodes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold text-gray-900">{stats.overview.totalQRCodes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users & Top QR Codes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Link href="/admin/users" className="text-sm text-violet-600 hover:text-violet-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      user.subscriptionStatus === 'active'
                        ? 'bg-green-100 text-green-700'
                        : user.subscriptionStatus === 'trialing'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.subscriptionStatus}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.qrCodeCount} QR codes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top QR Codes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top QR Codes by Scans</h3>
            <Link href="/admin/qrcodes" className="text-sm text-violet-600 hover:text-violet-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.topQRCodes.map((qr, index) => (
              <div key={qr.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{qr.name}</p>
                    <p className="text-sm text-gray-500">{qr.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{qr.scanCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">scans</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scans Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans (Last 7 Days)</h3>
        <div className="h-48 flex items-end gap-2">
          {stats.scansChart.map((day) => {
            const maxCount = Math.max(...stats.scansChart.map((d) => d.count), 1);
            const height = (day.count / maxCount) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-violet-500 rounded-t-lg transition-all hover:bg-violet-600"
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${day.count} scans`}
                />
                <span className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
