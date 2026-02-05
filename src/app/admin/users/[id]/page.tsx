'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  QrCodeIcon,
  CursorArrowRaysIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface QRCode {
  id: string;
  name: string;
  type: string;
  slug: string | null;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  totalScans: number;
  analytics: {
    devices: { name: string; count: number }[];
    recentScans: {
      country: string | null;
      city: string | null;
      device: string | null;
      browser: string | null;
      createdAt: string;
    }[];
  };
}

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  provider: string;
  authMethod: string;
  emailVerified: boolean;
  isAdmin: boolean;
  isDisabled: boolean;
  plan: string;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  isTrialActive: boolean;
  trialDaysLeft: number;
  country: string | null;
  city: string | null;
  createdAt: string;
  updatedAt: string;
  qrCodeCount: number;
  totalScans: number;
  qrcodes: QRCode[];
}

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQR, setExpandedQR] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/admin/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        toast.error('User not found');
        router.push('/admin/users');
      }
    } catch {
      toast.error('Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleToggleQR = async (qrId: string, isActive: boolean) => {
    setActionLoading(qrId);
    try {
      const res = await fetch(`/api/admin/qrcodes/${qrId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        toast.success(`QR code ${!isActive ? 'activated' : 'deactivated'}`);
        fetchUser();
      } else {
        toast.error('Failed to update QR code');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setActionLoading(null);
  };

  const handleExtendTrial = async (days: number) => {
    if (!user) return;
    setActionLoading('trial');
    try {
      const currentEnd = user.trialEndsAt ? new Date(user.trialEndsAt) : new Date();
      const base = currentEnd > new Date() ? currentEnd : new Date();
      base.setDate(base.getDate() + days);

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialEndsAt: base.toISOString(),
          subscriptionStatus: 'trialing',
        }),
      });
      if (res.ok) {
        toast.success(`Trial extended by ${days} days`);
        fetchUser();
      }
    } catch {
      toast.error('Failed to extend trial');
    }
    setActionLoading(null);
  };

  const handleActivateSubscription = async () => {
    setActionLoading('activate');
    try {
      const endsAt = new Date();
      endsAt.setDate(endsAt.getDate() + 30);

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'professional',
          subscriptionStatus: 'active',
          subscriptionEndsAt: endsAt.toISOString(),
        }),
      });
      if (res.ok) {
        toast.success('Subscription activated for 30 days');
        fetchUser();
      }
    } catch {
      toast.error('Failed to activate subscription');
    }
    setActionLoading(null);
  };

  const handleExpireSubscription = async () => {
    setActionLoading('expire');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'free',
          subscriptionStatus: 'expired',
        }),
      });
      if (res.ok) {
        toast.success('Subscription expired');
        fetchUser();
      }
    } catch {
      toast.error('Failed to expire subscription');
    }
    setActionLoading(null);
  };

  const handleSetTrialDate = async () => {
    const input = document.getElementById('trial-date-picker') as HTMLInputElement;
    if (!input?.value) {
      toast.error('Please select a date');
      return;
    }
    setActionLoading('trial-set');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trialEndsAt: new Date(input.value).toISOString(),
          subscriptionStatus: 'trialing',
        }),
      });
      if (res.ok) {
        toast.success('Trial date updated');
        fetchUser();
      }
    } catch {
      toast.error('Failed to update trial date');
    }
    setActionLoading(null);
  };

  const handleSetSubDate = async () => {
    const input = document.getElementById('sub-date-picker') as HTMLInputElement;
    if (!input?.value) {
      toast.error('Please select a date');
      return;
    }
    setActionLoading('sub-set');
    try {
      const newDate = new Date(input.value);
      const isPast = newDate < new Date();

      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionEndsAt: newDate.toISOString(),
          subscriptionStatus: isPast ? 'expired' : 'active',
          plan: isPast ? 'free' : 'professional',
        }),
      });
      if (res.ok) {
        toast.success(isPast ? 'Subscription expired' : 'Subscription date updated');
        fetchUser();
      }
    } catch {
      toast.error('Failed to update subscription date');
    }
    setActionLoading(null);
  };

  const handleToggleDisabled = async () => {
    if (!user) return;
    setActionLoading('disable');
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDisabled: !user.isDisabled }),
      });
      if (res.ok) {
        toast.success(user.isDisabled ? 'User enabled' : 'User disabled');
        fetchUser();
      }
    } catch {
      toast.error('Something went wrong');
    }
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'trialing':
        return 'bg-blue-100 text-blue-700';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-700';
      case 'canceled':
      case 'expired':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
              {user.image ? (
                <img src={user.image} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <UserIcon className="h-8 w-8 text-violet-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                {user.isAdmin && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    Admin
                  </span>
                )}
                {user.isDisabled && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(user.subscriptionStatus)}`}>
                  {user.subscriptionStatus}
                </span>
                <span className="text-xs text-gray-500 capitalize">Plan: {user.plan}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleDisabled}
              disabled={actionLoading === 'disable'}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                user.isDisabled
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              {user.isDisabled ? 'Enable User' : 'Disable User'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CalendarDaysIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Signed Up</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{formatDate(user.createdAt)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <KeyIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Auth Method</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{user.authMethod}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <MapPinIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Location</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {user.country || user.city
              ? `${user.city || ''}${user.city && user.country ? ', ' : ''}${user.country || ''}`
              : 'Unknown'}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <QrCodeIcon className="h-4 w-4" />
            <span className="text-xs font-medium">QR Codes</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{user.qrCodeCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <CursorArrowRaysIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Total Scans</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{user.totalScans.toLocaleString()}</p>
        </div>
      </div>

      {/* Subscription & Trial Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Trial</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${user.isTrialActive ? 'text-green-600' : 'text-red-600'}`}>
                {user.isTrialActive ? `Active (${user.trialDaysLeft} days left)` : 'Expired'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ends At</span>
              <span className="text-gray-900">
                {user.trialEndsAt ? formatDate(user.trialEndsAt) : 'N/A'}
              </span>
            </div>
          </div>
          {/* Quick extend */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => handleExtendTrial(7)}
              disabled={actionLoading === 'trial'}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              +7 days
            </button>
            <button
              onClick={() => handleExtendTrial(14)}
              disabled={actionLoading === 'trial'}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              +14 days
            </button>
            <button
              onClick={() => handleExtendTrial(30)}
              disabled={actionLoading === 'trial'}
              className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
            >
              +30 days
            </button>
          </div>
          {/* Set exact date */}
          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Set exact date</label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                defaultValue={user.trialEndsAt ? new Date(user.trialEndsAt).toISOString().slice(0, 16) : ''}
                id="trial-date-picker"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={() => handleSetTrialDate()}
                disabled={actionLoading === 'trial-set'}
                className="px-3 py-1.5 text-xs bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 whitespace-nowrap"
              >
                {actionLoading === 'trial-set' ? '...' : 'Set'}
              </button>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCardIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Subscription</h3>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium text-gray-900 capitalize">{user.plan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColor(user.subscriptionStatus)}`}>
                {user.subscriptionStatus}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Stripe ID</span>
              <span className="text-gray-900 font-mono text-xs">
                {user.stripeCustomerId || 'None'}
              </span>
            </div>
            {user.subscriptionEndsAt && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ends At</span>
                <span className="text-gray-900">{formatDate(user.subscriptionEndsAt)}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleActivateSubscription}
              disabled={actionLoading === 'activate'}
              className="px-3 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
            >
              Activate 30 days
            </button>
            <button
              onClick={handleExpireSubscription}
              disabled={actionLoading === 'expire'}
              className="px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
            >
              Expire Sub
            </button>
          </div>
          {/* Set exact subscription end date */}
          <div className="border-t border-gray-100 pt-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Set subscription end date</label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                defaultValue={user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt).toISOString().slice(0, 16) : ''}
                id="sub-date-picker"
                className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={() => handleSetSubDate()}
                disabled={actionLoading === 'sub-set'}
                className="px-3 py-1.5 text-xs bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 whitespace-nowrap"
              >
                {actionLoading === 'sub-set' ? '...' : 'Set'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Account Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Email Verified</p>
            <div className="flex items-center gap-1.5">
              {user.emailVerified ? (
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">{user.emailVerified ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Provider</p>
            <p className="text-sm font-medium capitalize">{user.provider}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Last Updated</p>
            <p className="text-sm font-medium">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* QR Codes with Analytics */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">
              QR Codes ({user.qrcodes.length})
            </h3>
          </div>
        </div>

        {user.qrcodes.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No QR codes created yet</p>
        ) : (
          <div className="space-y-3">
            {user.qrcodes.map((qr) => {
              const isExpanded = expandedQR === qr.id;
              return (
                <div key={qr.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* QR Code Row */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => setExpandedQR(isExpanded ? null : qr.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {isExpanded ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{qr.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                          <span className="capitalize">{qr.type}</span>
                          <span>{formatDate(qr.createdAt)}</span>
                          {qr.slug && (
                            <span className="font-mono text-gray-400">/r/{qr.slug}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {qr.totalScans.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">scans</p>
                      </div>
                      <button
                        onClick={() => handleToggleQR(qr.id, qr.isActive)}
                        disabled={actionLoading === qr.id}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          qr.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {actionLoading === qr.id ? '...' : qr.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Analytics */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Device Breakdown */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">
                            Device Breakdown
                          </h4>
                          {qr.analytics.devices.length > 0 ? (
                            <div className="space-y-2">
                              {qr.analytics.devices.map((d) => (
                                <div
                                  key={d.name}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-gray-600 capitalize">{d.name}</span>
                                  <span className="font-medium text-gray-900">{d.count}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No scan data</p>
                          )}
                        </div>

                        {/* Recent Scans */}
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-2">
                            Recent Scans
                          </h4>
                          {qr.analytics.recentScans.length > 0 ? (
                            <div className="space-y-2">
                              {qr.analytics.recentScans.map((scan, i) => (
                                <div key={i} className="text-xs text-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span>
                                      {scan.country || 'Unknown'}, {scan.city || 'Unknown'}
                                    </span>
                                    <span className="text-gray-400">
                                      {new Date(scan.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <span className="text-gray-400">
                                    {scan.device || 'Unknown'} - {scan.browser || 'Unknown'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400">No scan data</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
