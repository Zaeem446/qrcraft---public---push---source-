"use client";

import { useState, useRef } from "react";
import Spinner from "@/components/ui/Spinner";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface FileUploadFieldProps {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  multiple?: boolean;
}

export default function FileUploadField({ label, accept, value, onChange, multiple }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
      }
    } catch {
      // silent fail
    }
    setUploading(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    upload(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      {value ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {accept.startsWith("image") ? (
            <img src={value} alt="Uploaded" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center">
              <ArrowUpTrayIcon className="h-5 w-5 text-violet-600" />
            </div>
          )}
          <span className="text-xs text-gray-600 truncate flex-1">{value.split("/").pop()}</span>
          <button onClick={() => onChange("")} className="text-xs text-red-500 hover:underline flex items-center gap-1">
            <XMarkIcon className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            dragOver ? "border-violet-400 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-violet-50"
          }`}
        >
          {uploading ? (
            <Spinner />
          ) : (
            <>
              <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500">Drag & drop or click to upload</p>
            </>
          )}
          <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
            onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}
    </div>
  );
}
