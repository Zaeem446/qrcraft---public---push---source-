"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import ContentForms from "@/components/qr/ContentForms";
import DesignOptions from "@/components/qr/DesignOptions";
import toast from "react-hot-toast";
import { QR_TYPES } from "@/lib/utils";

export default function EditQRPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState<Record<string, any>>({});
  const [design, setDesign] = useState<Record<string, any>>({});
  const [qrType, setQrType] = useState("");
  const [qrfyId, setQrfyId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/qrcodes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setContent(data.content);
        setDesign(data.design || {});
        setQrType(data.type);
        setQrfyId(data.qrfyId || null);
      })
      .catch(() => toast.error("Failed to load QR code"))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch("/api/qrcodes/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: qrType, content, design }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(prev => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    }
    setPreviewLoading(false);
  }, [qrType, content, design]);

  useEffect(() => {
    if (!loading && qrType) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPreview(), 600);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
  }, [loading, design, content, qrType, fetchPreview]);

  useEffect(() => {
    if (!loading && qrfyId) {
      fetch(`/api/qrcodes/${id}/image?format=png`)
        .then(res => {
          if (res.ok) return res.blob();
          return null;
        })
        .then(blob => {
          if (blob) {
            setPreviewUrl(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return URL.createObjectURL(blob);
            });
          }
        })
        .catch(() => {});
    }
  }, [loading, qrfyId, id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, design }),
      });
      if (res.ok) {
        toast.success("QR code updated!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  const handleDownload = async (format: "png" | "webp" | "jpeg") => {
    if (!qrfyId) {
      toast.error("Download not available for legacy QR codes");
      return;
    }
    try {
      const res = await fetch(`/api/qrcodes/${id}/image?format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name || "qrcode"}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        toast.error("Download failed");
      }
    } catch {
      toast.error("Download failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  const typeMeta = QR_TYPES.find(t => t.id === qrType);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit QR Code</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Type:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                  {typeMeta?.name || qrType}
                </span>
              </div>
            </div>
          </Card>

          {/* Content */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Content</h2>
            <ContentForms qrType={qrType} content={content} setContent={setContent} />
          </div>

          {/* Design */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Design</h2>
            <DesignOptions design={design} setDesign={setDesign} />
          </div>

          {/* Download section */}
          {qrfyId && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Download QR Code</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleDownload("png")} className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">PNG</button>
                <button onClick={() => handleDownload("webp")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">WEBP</button>
                <button onClick={() => handleDownload("jpeg")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">JPEG</button>
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <Card className="sticky top-24">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[280px]">
              {previewLoading ? (
                <Spinner />
              ) : previewUrl ? (
                <img src={previewUrl} alt="QR Preview" className="w-64 h-64" />
              ) : (
                <Spinner />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
