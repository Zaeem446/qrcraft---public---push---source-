'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { QR_TYPES } from '@/lib/utils';

interface QRCode {
  id: string;
  name: string;
  type: string;
  slug: string | null;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    plan: string;
    subscriptionStatus: string;
  };
}

export default function AdminQRCodesPage() {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<QRCode | null>(null);
  const [viewModal, setViewModal] = useState<QRCode | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchQRCodes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search,
        type: typeFilter,
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/qrcodes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQrcodes(data.qrcodes);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRCodes();
  }, [page, search, typeFilter, statusFilter]);

  const handleToggleActive = async (qr: QRCode) => {
    try {
      const res = await fetch(`/api/admin/qrcodes/${qr.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !qr.isActive }),
      });
      if (res.ok) {
        toast.success(qr.isActive ? 'QR code deactivated' : 'QR code activated');
        fetchQRCodes();
      } else {
        toast.error('Failed to update');
      }
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/qrcodes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('QR code deleted');
        setDeleteModal(null);
        fetchQRCodes();
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedQRs.length === 0) return;

    try {
      const res = await fetch('/api/admin/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, type: 'qrcodes', ids: selectedQRs }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.affected} QR codes updated`);
        setSelectedQRs([]);
        fetchQRCodes();
      } else {
        toast.error('Bulk action failed');
      }
    } catch {
      toast.error('Bulk action failed');
    }
  };

  const toggleSelectAll = () => {
    if (selectedQRs.length === qrcodes.length) {
      setSelectedQRs([]);
    } else {
      setSelectedQRs(qrcodes.map((q) => q.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedQRs.includes(id)) {
      setSelectedQRs(selectedQRs.filter((i) => i !== id));
    } else {
      setSelectedQRs([...selectedQRs, id]);
    }
  };

  const getTypeName = (typeId: string) => {
    return QR_TYPES.find((t) => t.id === typeId)?.name || typeId;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Types</option>
            {QR_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedQRs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
            <span className="text-sm text-gray-600">{selectedQRs.length} selected</span>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
              Activate
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
              Deactivate
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction('delete')}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* QR Codes Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedQRs.length === qrcodes.length && qrcodes.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scans</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <Spinner size="md" />
                </td>
              </tr>
            ) : qrcodes.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  No QR codes found
                </td>
              </tr>
            ) : (
              qrcodes.map((qr) => (
                <tr key={qr.id} className={`hover:bg-gray-50 ${!qr.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedQRs.includes(qr.id)}
                      onChange={() => toggleSelect(qr.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={`/api/qrcodes/${qr.id}/image?format=webp`}
                          alt={qr.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{qr.name}</p>
                        {qr.slug && <p className="text-xs text-gray-500">/{qr.slug}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-600">{getTypeName(qr.type)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-gray-900">{qr.user.name}</p>
                      <p className="text-xs text-gray-500">{qr.user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(qr)}
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                        qr.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {qr.isActive ? (
                        <CheckCircleIcon className="h-3.5 w-3.5" />
                      ) : (
                        <XCircleIcon className="h-3.5 w-3.5" />
                      )}
                      {qr.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{qr.scanCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">
                    {new Date(qr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewModal(qr)}
                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <Link href={`/dashboard/edit/${qr.id}`} target="_blank">
                        <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteModal(qr)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of {total} QR codes
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

      {/* View Modal */}
      <Modal isOpen={!!viewModal} onClose={() => setViewModal(null)} title={viewModal?.name || 'QR Code'}>
        {viewModal && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={`/api/qrcodes/${viewModal.id}/image?format=png`}
                alt={viewModal.name}
                className="w-48 h-48"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Type</p>
                <p className="font-medium">{getTypeName(viewModal.type)}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className={`font-medium ${viewModal.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {viewModal.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Scans</p>
                <p className="font-medium">{viewModal.scanCount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{new Date(viewModal.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Owner</p>
                <p className="font-medium">{viewModal.user.name} ({viewModal.user.email})</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant={viewModal.isActive ? 'danger' : 'primary'}
                onClick={() => {
                  handleToggleActive(viewModal);
                  setViewModal(null);
                }}
                className="flex-1"
              >
                {viewModal.isActive ? 'Deactivate' : 'Activate'}
              </Button>
              <Button variant="outline" onClick={() => setViewModal(null)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete QR Code">
        {deleteModal && (
          <div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.name}</strong>? This will also delete all scan data. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteModal(null)}>
                Cancel
              </Button>
              <Button variant="danger" isLoading={saving} onClick={() => handleDelete(deleteModal.id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
