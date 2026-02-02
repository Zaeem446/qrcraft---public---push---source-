"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
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
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange(data.url);
        toast.success("File uploaded successfully");
      } else {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        const msg = data.error || `Upload failed (${res.status})`;
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = "Network error — could not upload file";
      setError(msg);
      toast.error(msg);
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
            dragOver ? "border-violet-400 bg-violet-50"
            : error ? "border-red-300 hover:border-red-400 bg-red-50/50"
            : "border-gray-300 hover:border-violet-400 hover:bg-violet-50"
          }`}
        >
          {uploading ? (
            <Spinner />
          ) : (
            <>
              <ArrowUpTrayIcon className={`h-8 w-8 mb-2 ${error ? "text-red-400" : "text-gray-400"}`} />
              <p className={`text-xs ${error ? "text-red-500" : "text-gray-500"}`}>
                {error || "Drag & drop or click to upload"}
              </p>
              {error && (
                <p className="text-[10px] text-gray-400 mt-1">Click to try again</p>
              )}
            </>
          )}
          <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="hidden"
            onChange={(e) => { setError(""); handleFiles(e.target.files); }} />
        </div>
      )}
    </div>
  );
}
