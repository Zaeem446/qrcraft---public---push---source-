"use client";

import { useState, useRef } from "react";
import Spinner from "@/components/ui/Spinner";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

interface FileEntry {
  file: string;
  name: string;
}

interface MultiFileUploadProps {
  label: string;
  accept: string;
  value: FileEntry[];
  onChange: (files: FileEntry[]) => void;
}

export default function MultiFileUpload({ label, accept, value, onChange }: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const files = Array.isArray(value) ? value : [];

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange([...files, { file: data.url, name: file.name }]);
      }
    } catch {
      // silent fail
    }
    setUploading(false);
  };

  const remove = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...files];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onChange(updated);
  };

  const moveDown = (idx: number) => {
    if (idx >= files.length - 1) return;
    const updated = [...files];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onChange(updated);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    for (let i = 0; i < fileList.length; i++) {
      upload(fileList[i]);
    }
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      {files.length > 0 && (
        <div className="space-y-2 mb-3">
          {files.map((entry, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <ArrowUpTrayIcon className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-xs text-gray-600 truncate flex-1">{entry.name || entry.file.split("/").pop()}</span>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx >= files.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1 text-red-400 hover:text-red-600"
                >
                  <XMarkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-xs text-gray-500 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-colors cursor-pointer"
      >
        {uploading ? <Spinner /> : <><ArrowUpTrayIcon className="h-4 w-4" /> Add another file</>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
