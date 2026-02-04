'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  subscriptionStatus: string;
  trialEndsAt: string;
  subscriptionEndsAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  qrCodeCount: number;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [extendModal, setExtendModal] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search,
        status: statusFilter,
        sortBy: 'subscriptionStatus',
      });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, statusFilter]);

  const handleExtendSubscription = async (userId: string, data: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Subscription updated');
        setExtendModal(null);
        fetchUsers();
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAction = async (user: User, action: 'activate' | 'expire' | 'extend30') => {
    const data: any = {};

    if (action === 'activate') {
      data.subscriptionStatus = 'active';
      data.subscriptionEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    } else if (action === 'expire') {
      data.subscriptionStatus = 'expired';
    } else if (action === 'extend30') {
      const currentEnd = user.subscriptionEndsAt ? new Date(user.subscriptionEndsAt) : new Date();
      data.subscriptionEndsAt = new Date(currentEnd.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      data.subscriptionStatus = 'active';
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success('Subscription updated');
        fetchUsers();
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'trialing':
        return <ClockIcon className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'past_due':
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDaysRemaining = (endDate: string | null) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active', value: users.filter((u) => u.subscriptionStatus === 'active').length, color: 'bg-green-500' },
          { label: 'Trialing', value: users.filter((u) => u.subscriptionStatus === 'trialing').length, color: 'bg-blue-500' },
          { label: 'Expired', value: users.filter((u) => u.subscriptionStatus === 'expired').length, color: 'bg-red-500' },
          { label: 'Past Due', value: users.filter((u) => u.subscriptionStatus === 'past_due').length, color: 'bg-amber-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${stat.color} rounded-full`} />
              <span className="text-gray-600">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="expired">Expired</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ends At</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Codes</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stripe</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <Spinner size="md" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const daysRemaining = user.subscriptionStatus === 'trialing'
                  ? getDaysRemaining(user.trialEndsAt)
                  : getDaysRemaining(user.subscriptionEndsAt);

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize font-medium text-gray-900">{user.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(user.subscriptionStatus)}
                        <span className="capitalize text-gray-700">{user.subscriptionStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-gray-900">
                          {user.subscriptionStatus === 'trialing'
                            ? new Date(user.trialEndsAt).toLocaleDateString()
                            : user.subscriptionEndsAt
                            ? new Date(user.subscriptionEndsAt).toLocaleDateString()
                            : '-'}
                        </p>
                        {daysRemaining !== null && (
                          <p className={`text-xs ${daysRemaining <= 3 ? 'text-red-600' : daysRemaining <= 7 ? 'text-amber-600' : 'text-gray-500'}`}>
                            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Expired'}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.qrCodeCount}</td>
                    <td className="px-4 py-3">
                      {user.stripeSubscriptionId ? (
                        <span className="text-xs text-green-600">Connected</span>
                      ) : (
                        <span className="text-xs text-gray-400">Not connected</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuickAction(user, 'extend30')}
                        >
                          +30 days
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExtendModal(user)}
                        >
                          Edit
                        </Button>
                        {user.subscriptionStatus === 'expired' ? (
                          <Button
                            size="sm"
                            onClick={() => handleQuickAction(user, 'activate')}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleQuickAction(user, 'expire')}
                          >
                            Expire
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extend Modal */}
      <Modal isOpen={!!extendModal} onClose={() => setExtendModal(null)} title="Manage Subscription">
        {extendModal && (
          <ExtendSubscriptionForm
            user={extendModal}
            onSave={(data) => handleExtendSubscription(extendModal.id, data)}
            onCancel={() => setExtendModal(null)}
            saving={saving}
          />
        )}
      </Modal>
    </div>
  );
}

function ExtendSubscriptionForm({
  user,
  onSave,
  onCancel,
  saving,
}: {
  user: User;
  onSave: (data: any) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [formData, setFormData] = useState({
    plan: user.plan,
    subscriptionStatus: user.subscriptionStatus,
    trialEndsAt: user.trialEndsAt ? user.trialEndsAt.split('T')[0] : '',
    subscriptionEndsAt: user.subscriptionEndsAt ? user.subscriptionEndsAt.split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleExtendDays = (days: number) => {
    const currentEnd = formData.subscriptionEndsAt ? new Date(formData.subscriptionEndsAt) : new Date();
    const newEnd = new Date(currentEnd.getTime() + days * 24 * 60 * 60 * 1000);
    setFormData({ ...formData, subscriptionEndsAt: newEnd.toISOString().split('T')[0] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Managing subscription for <strong>{user.name}</strong> ({user.email})
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
          <select
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.subscriptionStatus}
            onChange={(e) => setFormData({ ...formData, subscriptionStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="expired">Expired</option>
            <option value="canceled">Canceled</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trial Ends At</label>
        <input
          type="date"
          value={formData.trialEndsAt}
          onChange={(e) => setFormData({ ...formData, trialEndsAt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Ends At</label>
        <input
          type="date"
          value={formData.subscriptionEndsAt}
          onChange={(e) => setFormData({ ...formData, subscriptionEndsAt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleExtendDays(7)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            +7 days
          </button>
          <button
            type="button"
            onClick={() => handleExtendDays(30)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            +30 days
          </button>
          <button
            type="button"
            onClick={() => handleExtendDays(90)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            +90 days
          </button>
          <button
            type="button"
            onClick={() => handleExtendDays(365)}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            +1 year
          </button>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}
