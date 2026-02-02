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

export default function FileUploadField({ label, accept, value, onChange }: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const readAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      if (file.size > 50 * 1024 * 1024) {
        throw new Error("File too large (max 50MB)");
      }
      const dataUrl = await readAsDataUrl(file);
      onChange(dataUrl);
      toast.success("File loaded successfully");
    } catch (err: any) {
      const msg = err?.message || "Could not load file";
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
          <span className="text-xs text-gray-600 truncate flex-1">
            {value.startsWith("data:") ? "File loaded" : value.split("/").pop()}
          </span>
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
          <input ref={inputRef} type="file" accept={accept} className="hidden"
            onChange={(e) => { setError(""); handleFiles(e.target.files); }} />
        </div>
      )}
    </div>
  );
}
