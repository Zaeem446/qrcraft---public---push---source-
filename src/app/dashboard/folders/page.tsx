'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

interface Folder {
  id: string;
  name: string;
  color: string;
  qrCount: number;
  createdAt: string;
}

const FOLDER_COLORS = [
  '#7C3AED', // violet
  '#2563EB', // blue
  '#0891B2', // cyan
  '#059669', // emerald
  '#65A30D', // lime
  '#CA8A04', // yellow
  '#EA580C', // orange
  '#DC2626', // red
  '#DB2777', // pink
  '#7C3AED', // purple
];

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [deleteModal, setDeleteModal] = useState<Folder | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/folders');
      const data = await res.json();
      if (Array.isArray(data)) setFolders(data);
    } catch {
      toast.error('Failed to load folders');
    }
  };

  useEffect(() => {
    fetchFolders().then(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim(), color: newFolderColor }),
      });
      if (res.ok) {
        toast.success('Folder created');
        setNewFolderName('');
        setNewFolderColor(FOLDER_COLORS[0]);
        setShowCreateForm(false);
        fetchFolders();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to create folder');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setCreating(false);
  };

  const handleUpdate = async () => {
    if (!editingFolder || !editName.trim()) return;
    try {
      const res = await fetch(`/api/folders/${editingFolder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), color: editColor }),
      });
      if (res.ok) {
        toast.success('Folder updated');
        setEditingFolder(null);
        fetchFolders();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update folder');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/folders/${deleteModal.id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Folder deleted');
        setDeleteModal(null);
        fetchFolders();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to delete folder');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setDeleting(false);
  };

  const startEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setEditName(folder.name);
    setEditColor(folder.color);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Folders</h1>
            <p className="text-sm text-gray-500 mt-1">
              Organize your QR codes into folders
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Folder</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Folder Name</label>
              <input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Color</label>
              <div className="flex gap-1.5">
                {FOLDER_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFolderColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      newFolderColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleCreate} isLoading={creating}>Create Folder</Button>
            <Button variant="outline" onClick={() => { setShowCreateForm(false); setNewFolderName(''); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Folders List */}
      {folders.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FolderIcon className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders yet</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Create folders to organize your QR codes by project, campaign, or category.
          </p>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First Folder
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-violet-200 transition-all duration-300"
            >
              {editingFolder?.id === folder.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    {FOLDER_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setEditColor(color)}
                        className={`w-6 h-6 rounded-md border-2 transition-all ${
                          editColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
                    >
                      <CheckIcon className="h-4 w-4" /> Save
                    </button>
                    <button
                      onClick={() => setEditingFolder(null)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: folder.color + '20' }}
                      >
                        <FolderIcon className="h-5 w-5" style={{ color: folder.color }} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{folder.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <QrCodeIcon className="h-3.5 w-3.5" />
                          {folder.qrCount} QR code{folder.qrCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(folder)}
                        className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal(folder)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard?folder=${folder.id}`}
                    className="inline-flex items-center text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    View QR codes
                    <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Folder">
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete <strong>{deleteModal?.name}</strong>?
        </p>
        {deleteModal && deleteModal.qrCount > 0 && (
          <p className="text-amber-600 text-sm mb-4 p-3 bg-amber-50 rounded-lg">
            This folder contains {deleteModal.qrCount} QR code{deleteModal.qrCount !== 1 ? 's' : ''}.
            They will be moved to &quot;No Folder&quot; and will not be deleted.
          </p>
        )}
        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" isLoading={deleting} onClick={handleDelete}>Delete Folder</Button>
        </div>
      </Modal>
    </div>
  );
}
