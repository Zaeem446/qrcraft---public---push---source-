'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  QrCodeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  EyeIcon,
  StarIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  StopIcon,
  PlayIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import PhoneMockup from '@/components/qr/PhoneMockup';
import { renderPreviewForType } from '@/components/qr/PhonePreviews';
import { formatNumber, formatDate, QR_TYPES } from '@/lib/utils';

interface QRCodeItem {
  id: string;
  name: string;
  type: string;
  slug: string | null;
  qrfyId: number | null;
  content: Record<string, any>;
  scanCount: number;
  isActive: boolean;
  isFavorite: boolean;
  folderId: string | null;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  qrCount?: number;
}

export default function DashboardPage() {
  const [qrcodes, setQrcodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-scans' | 'name'>('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [previewModal, setPreviewModal] = useState<QRCodeItem | null>(null);
  const [previewTab, setPreviewTab] = useState<'preview' | 'qrcode'>('preview');

  // New state for folders, favorites, and bulk selection
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const fetchQRCodes = async () => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '12', search });
      const res = await fetch(`/api/qrcodes?${params}`);
      const data = await res.json();
      setQrcodes(data.qrcodes || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch {
      toast.error('Failed to load QR codes');
    }
  };

  useEffect(() => {
    fetchQRCodes().then(() => setLoading(false));
  }, [page, search]);

  // Fetch folders
  useEffect(() => {
    fetch('/api/folders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setFolders(data);
      })
      .catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('QR code deleted');
        setDeleteModal(null);
        fetchQRCodes();
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

  // Toggle favorite
  const handleToggleFavorite = async (id: string) => {
    try {
      const res = await fetch(`/api/qrcodes/${id}/favorite`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setQrcodes(prev => prev.map(qr => qr.id === id ? { ...qr, isFavorite: data.isFavorite } : qr));
      }
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/qrcodes/${id}/toggle-status`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setQrcodes(prev => prev.map(qr => qr.id === id ? { ...qr, isActive: data.isActive } : qr));
        toast.success(data.isActive ? 'QR code activated' : 'QR code deactivated');
      }
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  // Duplicate QR code
  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/qrcodes/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        toast.success('QR code duplicated');
        fetchQRCodes();
      } else {
        toast.error('Failed to duplicate');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  // Bulk operations
  const handleBulkAction = async (action: string, data?: Record<string, any>) => {
    if (selectedIds.size === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch('/api/qrcodes/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: Array.from(selectedIds), data }),
      });
      if (res.ok) {
        toast.success(`Bulk ${action} completed`);
        setSelectedIds(new Set());
        fetchQRCodes();
      } else {
        toast.error('Bulk operation failed');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setBulkLoading(false);
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Select all visible
  const selectAll = () => {
    if (selectedIds.size === filteredQRCodes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQRCodes.map(qr => qr.id)));
    }
  };

  // Client-side filtering and sorting
  const filteredQRCodes = qrcodes
    .filter((qr) => {
      if (statusFilter === 'active' && !qr.isActive) return false;
      if (statusFilter === 'inactive' && qr.isActive) return false;
      if (typeFilter !== 'all' && qr.type !== typeFilter) return false;
      if (favoriteFilter && !qr.isFavorite) return false;
      if (folderFilter && qr.folderId !== folderFilter) return false;
      if (folderFilter === 'none' && qr.folderId !== null) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'most-scans': return b.scanCount - a.scanCount;
        case 'name': return a.name.localeCompare(b.name);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My QR Codes</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} QR code{totalCount !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create QR Code
          </Button>
        </Link>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Favorites toggle */}
          <button
            onClick={() => setFavoriteFilter(!favoriteFilter)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
              favoriteFilter ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {favoriteFilter ? <StarIconSolid className="h-4 w-4" /> : <StarIcon className="h-4 w-4" />}
            Favorites
          </button>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
              showFilters ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4" />
            Filters
          </button>

          {/* Sort */}
          <div className="relative">
            <ArrowsUpDownIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white appearance-none cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="most-scans">Most scans</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
              >
                <option value="all">All Types</option>
                {QR_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Folder</label>
              <select
                value={folderFilter || ''}
                onChange={(e) => setFolderFilter(e.target.value || null)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
              >
                <option value="">All Folders</option>
                <option value="none">No Folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={selectAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-100 rounded-lg transition-colors"
            >
              <CheckIcon className="h-4 w-4" />
              {selectedIds.size === filteredQRCodes.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-violet-600">
              {selectedIds.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('toggle-active', { isActive: true })}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <PlayIcon className="h-4 w-4" />
              Activate
            </button>
            <button
              onClick={() => handleBulkAction('toggle-active', { isActive: false })}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <StopIcon className="h-4 w-4" />
              Deactivate
            </button>
            <button
              onClick={() => handleBulkAction('toggle-favorite', { isFavorite: true })}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <StarIconSolid className="h-4 w-4" />
              Favorite
            </button>
            {folders.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value) handleBulkAction('move-to-folder', { folderId: e.target.value === 'none' ? null : e.target.value });
                  e.target.value = '';
                }}
                disabled={bulkLoading}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
              >
                <option value="">Move to folder...</option>
                <option value="none">No Folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            )}
            <button
              onClick={() => {
                if (confirm(`Delete ${selectedIds.size} QR codes? This cannot be undone.`)) {
                  handleBulkAction('delete');
                }
              }}
              disabled={bulkLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* QR Code List */}
      {filteredQRCodes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <QrCodeIcon className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {qrcodes.length === 0 ? "No QR codes yet" : "No matching QR codes"}
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {qrcodes.length === 0
              ? "Create your first QR code to start tracking scans and engaging your audience."
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          {qrcodes.length === 0 && (
            <Link href="/dashboard/create">
              <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First QR Code
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQRCodes.map((qr) => (
            <div
              key={qr.id}
              className={`bg-white rounded-2xl border p-5 flex items-center justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
                selectedIds.has(qr.id) ? 'border-violet-300 bg-violet-50/30' : 'border-gray-100 hover:border-violet-200'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Selection checkbox */}
                <button
                  onClick={() => toggleSelection(qr.id)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedIds.has(qr.id) ? 'border-violet-500 bg-violet-500' : 'border-gray-300 hover:border-violet-400'
                  }`}
                >
                  {selectedIds.has(qr.id) && <CheckIcon className="h-3 w-3 text-white" />}
                </button>

                <div className="w-14 h-14 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-violet-100/50 shadow-sm">
                  <img
                    src={`/api/qrcodes/${qr.id}/image?format=webp`}
                    alt={qr.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg class="h-6 w-6 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /></svg>';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{qr.name}</h3>
                    {qr.isFavorite && (
                      <StarIconSolid className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    )}
                    <button
                      onClick={() => handleToggleStatus(qr.id)}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium cursor-pointer transition-colors ${
                        qr.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {qr.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      {getTypeName(qr.type)}
                    </span>
                    <span>{formatNumber(qr.scanCount)} scans</span>
                    {qr.folderId && folders.find(f => f.id === qr.folderId) && (
                      <span className="inline-flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: folders.find(f => f.id === qr.folderId)?.color || '#7C3AED' }}
                        />
                        {folders.find(f => f.id === qr.folderId)?.name}
                      </span>
                    )}
                    <span className="hidden sm:inline text-gray-400">{formatDate(qr.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                <button
                  onClick={() => handleToggleFavorite(qr.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    qr.isFavorite ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
                  }`}
                  title={qr.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {qr.isFavorite ? <StarIconSolid className="h-4.5 w-4.5" /> : <StarIcon className="h-4.5 w-4.5" />}
                </button>
                <button
                  onClick={() => { setPreviewModal(qr); setPreviewTab('preview'); }}
                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  title="Preview"
                >
                  <EyeIcon className="h-4.5 w-4.5" />
                </button>
                <Link href={`/dashboard/analytics/${qr.id}`}>
                  <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Analytics">
                    <ChartBarIcon className="h-4.5 w-4.5" />
                  </button>
                </Link>
                <Link href={`/dashboard/edit/${qr.id}`}>
                  <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Edit">
                    <PencilIcon className="h-4.5 w-4.5" />
                  </button>
                </Link>
                <button
                  onClick={() => handleDuplicate(qr.id)}
                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  title="Duplicate"
                >
                  <DocumentDuplicateIcon className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setDeleteModal(qr.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
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

      {/* Preview Modal */}
      <Modal isOpen={!!previewModal} onClose={() => setPreviewModal(null)} title={previewModal?.name || 'Preview'}>
        {previewModal && (
          <div className="flex flex-col items-center">
            <div className="flex bg-gray-100 rounded-full p-0.5 mb-4">
              <button onClick={() => setPreviewTab('preview')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  previewTab === 'preview' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}>Preview</button>
              <button onClick={() => setPreviewTab('qrcode')}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                  previewTab === 'qrcode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}>QR code</button>
            </div>
            <PhoneMockup>
              {previewTab === 'qrcode' ? (
                <div className="h-full bg-white flex items-center justify-center p-6">
                  <img
                    src={`/api/qrcodes/${previewModal.id}/image?format=png`}
                    alt="QR Code"
                    className="w-full max-w-[200px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                renderPreviewForType(previewModal.type, previewModal.content)
              )}
            </PhoneMockup>
            <div className="flex gap-3 mt-4">
              <Link href={`/dashboard/edit/${previewModal.id}`}>
                <Button size="sm">
                  <PencilIcon className="h-4 w-4 mr-1.5" /> Edit
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => setPreviewModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
