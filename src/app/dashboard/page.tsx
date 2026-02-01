'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  QrCodeIcon,
  CursorArrowRaysIcon,
  SignalIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { formatNumber, formatDate, QR_TYPES } from '@/lib/utils';

interface QRCodeItem {
  _id: string;
  name: string;
  type: string;
  slug: string;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [qrcodes, setQrcodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalQRCodes: 0, totalScans: 0, activeQRCodes: 0 });
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchQRCodes = async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '10', search });
      const res = await fetch(`/api/qrcodes?${params}`);
      const data = await res.json();
      setQrcodes(data.qrcodes || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      toast.error('Failed to load QR codes');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      setStats({
        totalQRCodes: data.totalQRCodes || 0,
        totalScans: data.totalScans || 0,
        activeQRCodes: data.activeQRCodes || 0,
      });
    } catch {}
  };

  useEffect(() => {
    Promise.all([fetchQRCodes(), fetchStats()]).then(() => setLoading(false));
  }, [page, search]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('QR code deleted');
        setDeleteModal(null);
        fetchQRCodes();
        fetchStats();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setDeleting(false);
  };

  const getTypeName = (typeId: string) => {
    return QR_TYPES.find((t) => t.id === typeId)?.name || typeId;
  };

  const trialEndsAt = session?.user?.trialEndsAt ? new Date(session.user.trialEndsAt) : null;
  const isTrialing = session?.user?.subscriptionStatus === 'trialing' && trialEndsAt && trialEndsAt > new Date();
  const trialDaysLeft = trialEndsAt ? Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {isTrialing && (
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 flex items-center justify-between">
          <p className="text-sm">
            You have <strong>{trialDaysLeft} days</strong> left in your free trial.
          </p>
          <Link href="/pricing">
            <Button variant="secondary" size="sm">Upgrade Now</Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/dashboard/create">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <QrCodeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total QR Codes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalQRCodes)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CursorArrowRaysIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalScans)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <SignalIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active QR Codes</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.activeQRCodes)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search QR codes..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* QR Code List */}
      {qrcodes.length === 0 ? (
        <Card className="text-center py-12">
          <QrCodeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes yet</h3>
          <p className="text-gray-500 mb-6">Create your first QR code to get started</p>
          <Link href="/dashboard/create">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create QR Code
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {qrcodes.map((qr) => (
            <Card key={qr._id} className="flex items-center justify-between" hover>
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <QrCodeIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{getTypeName(qr.type)}</span>
                    <span>{formatNumber(qr.scanCount)} scans</span>
                    <span className="hidden sm:inline">{formatDate(qr.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Link href={`/dashboard/analytics/${qr._id}`}>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Analytics">
                    <ChartBarIcon className="h-5 w-5" />
                  </button>
                </Link>
                <Link href={`/dashboard/edit/${qr._id}`}>
                  <button className="p-2 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </Link>
                <button
                  onClick={() => setDeleteModal(qr._id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete QR Code">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this QR code? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" isLoading={deleting} onClick={() => deleteModal && handleDelete(deleteModal)}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
