"use client";

import { useState, useEffect } from "react";
import {
  LockClosedIcon,
  ChartBarIcon,
  FolderIcon,
  StopIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeSlashIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Folder {
  id: string;
  name: string;
  color: string;
  qrCount?: number;
}

interface AdvancedSettingsProps {
  // Password Protection
  password: string;
  setPassword: (val: string) => void;
  hasExistingPassword?: boolean;
  removePassword?: boolean;
  setRemovePassword?: (val: boolean) => void;

  // Scan Limit
  scanLimit: number | null;
  setScanLimit: (val: number | null) => void;

  // Folder
  folderId: string | null;
  setFolderId: (val: string | null) => void;

  // Analytics
  googleAnalyticsId: string;
  setGoogleAnalyticsId: (val: string) => void;
  facebookPixelId: string;
  setFacebookPixelId: (val: string) => void;
  googleTagManagerId: string;
  setGoogleTagManagerId: (val: string) => void;

  // Mode
  isEditMode?: boolean;
}

export default function AdvancedSettings({
  password,
  setPassword,
  hasExistingPassword,
  removePassword,
  setRemovePassword,
  scanLimit,
  setScanLimit,
  folderId,
  setFolderId,
  googleAnalyticsId,
  setGoogleAnalyticsId,
  facebookPixelId,
  setFacebookPixelId,
  googleTagManagerId,
  setGoogleTagManagerId,
  isEditMode = false,
}: AdvancedSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  // Fetch folders
  useEffect(() => {
    if (isExpanded && folders.length === 0) {
      setLoadingFolders(true);
      fetch("/api/folders")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setFolders(data);
        })
        .catch(console.error)
        .finally(() => setLoadingFolders(false));
    }
  }, [isExpanded, folders.length]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      if (res.ok) {
        const folder = await res.json();
        setFolders([...folders, folder]);
        setFolderId(folder.id);
        setNewFolderName("");
        setShowNewFolder(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const hasAnyAdvancedSetting =
    password ||
    hasExistingPassword ||
    scanLimit !== null ||
    folderId ||
    googleAnalyticsId ||
    facebookPixelId ||
    googleTagManagerId;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header - Always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <ChartBarIcon className="h-6 w-6 text-slate-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">Advanced Settings</p>
            <p className="text-xs text-gray-500">
              {hasAnyAdvancedSetting
                ? "Custom settings configured"
                : "Password, scan limits, analytics & more"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasAnyAdvancedSetting && (
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-medium rounded-full">
              Active
            </span>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-5 space-y-6">
          {/* Password Protection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LockClosedIcon className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-semibold text-gray-900">
                Password Protection
              </label>
              <div className="group relative">
                <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                  Require a password before users can access the QR content.
                </div>
              </div>
            </div>

            {isEditMode && hasExistingPassword && !removePassword && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-sm text-green-700 flex items-center gap-2">
                  <LockClosedIcon className="h-4 w-4" />
                  Password protection enabled
                </span>
                {setRemovePassword && (
                  <button
                    type="button"
                    onClick={() => setRemovePassword(true)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}

            {(!isEditMode || !hasExistingPassword || removePassword) && (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isEditMode && removePassword
                      ? "Enter new password"
                      : "Set a password (optional)"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Scan Limit */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <StopIcon className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-semibold text-gray-900">
                Scan Limit
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                placeholder="Unlimited"
                value={scanLimit ?? ""}
                onChange={(e) =>
                  setScanLimit(e.target.value ? parseInt(e.target.value) : null)
                }
                className="flex-1 px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setScanLimit(null)}
                className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all ${
                  scanLimit === null
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                Unlimited
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Set to 0 to disable the QR code immediately, or leave unlimited.
            </p>
          </div>

          {/* Folder Organization */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-semibold text-gray-900">
                Organize in Folder
              </label>
            </div>
            {loadingFolders ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-violet-500 rounded-full animate-spin" />
                Loading folders...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFolderId(null)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                    folderId === null
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  No Folder
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setFolderId(folder.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border-2 transition-all flex items-center gap-2 ${
                      folderId === folder.id
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    {folder.name}
                  </button>
                ))}
                {showNewFolder ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                      className="px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 w-32"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      className="px-3 py-2 bg-violet-600 text-white text-sm font-medium rounded-xl hover:bg-violet-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewFolder(false);
                        setNewFolderName("");
                      }}
                      className="px-3 py-2 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowNewFolder(true)}
                    className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-violet-300 hover:text-violet-600 transition-all"
                  >
                    + New Folder
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Analytics Integration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-semibold text-gray-900">
                Analytics Integration
              </label>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">
                PRO
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Google Analytics
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Facebook Pixel
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={facebookPixelId}
                  onChange={(e) => setFacebookPixelId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">
                  Google Tag Manager
                </label>
                <input
                  type="text"
                  placeholder="GTM-XXXXXXX"
                  value={googleTagManagerId}
                  onChange={(e) => setGoogleTagManagerId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Track scans with your own analytics tools. IDs will be added to the
              landing page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
