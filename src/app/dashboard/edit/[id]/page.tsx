"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import ContentForms from "@/components/qr/ContentForms";
import DesignOptions from "@/components/qr/DesignOptions";
import PhoneMockup from "@/components/qr/PhoneMockup";
import { renderPreviewForType } from "@/components/qr/PhonePreviews";
import toast from "react-hot-toast";
import { QR_TYPES } from "@/lib/utils";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import InstantQRPreview from "@/components/qr/InstantQRPreview";
import AdvancedSettings from "@/components/qr/AdvancedSettings";

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
  const [previewTab, setPreviewTab] = useState<"preview" | "qrcode">("preview");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Advanced settings state
  const [password, setPassword] = useState("");
  const [hasExistingPassword, setHasExistingPassword] = useState(false);
  const [removePassword, setRemovePassword] = useState(false);
  const [scanLimit, setScanLimit] = useState<number | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [facebookPixelId, setFacebookPixelId] = useState("");
  const [googleTagManagerId, setGoogleTagManagerId] = useState("");

  useEffect(() => {
    fetch(`/api/qrcodes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setName(data.name);
        setContent(data.content);
        setDesign(data.design || {});
        setQrType(data.type);
        setQrfyId(data.qrfyId || null);
        // Load advanced settings
        setHasExistingPassword(!!data.accessPassword);
        setScanLimit(data.scanLimit ?? null);
        setFolderId(data.folderId || null);
        setGoogleAnalyticsId(data.googleAnalyticsId || "");
        setFacebookPixelId(data.facebookPixelId || "");
        setGoogleTagManagerId(data.googleTagManagerId || "");
      })
      .catch(() => toast.error("Failed to load QR code"))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchPreview = useCallback(async () => {
    // Abort any previous in-flight request to prevent race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setPreviewLoading(true);
    try {
      const res = await fetch("/api/qrcodes/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: qrType, content, design }),
        signal: abortControllerRef.current.signal,
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
      // Ignore abort errors - they're expected when user changes design quickly
      if (err instanceof Error && err.name === 'AbortError') return;
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
    if (!loading) {
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
  }, [loading, id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name,
        content,
        design,
        scanLimit,
        folderId,
        googleAnalyticsId: googleAnalyticsId || null,
        facebookPixelId: facebookPixelId || null,
        googleTagManagerId: googleTagManagerId || null,
      };

      // Handle password changes
      if (removePassword) {
        payload.removePassword = true;
      } else if (password) {
        payload.password = password;
      }

      const res = await fetch(`/api/qrcodes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

          {/* Advanced Settings */}
          <AdvancedSettings
            password={password}
            setPassword={setPassword}
            hasExistingPassword={hasExistingPassword}
            removePassword={removePassword}
            setRemovePassword={setRemovePassword}
            scanLimit={scanLimit}
            setScanLimit={setScanLimit}
            folderId={folderId}
            setFolderId={setFolderId}
            googleAnalyticsId={googleAnalyticsId}
            setGoogleAnalyticsId={setGoogleAnalyticsId}
            facebookPixelId={facebookPixelId}
            setFacebookPixelId={setFacebookPixelId}
            googleTagManagerId={googleTagManagerId}
            setGoogleTagManagerId={setGoogleTagManagerId}
            isEditMode={true}
          />

          {/* Download section */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Download QR Code</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleDownload("png")} className="px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors">PNG</button>
              <button onClick={() => handleDownload("webp")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">WEBP</button>
              <button onClick={() => handleDownload("jpeg")} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">JPEG</button>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>Cancel</Button>
            <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
          </div>
        </div>

        {/* Preview */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <div className="flex justify-center mb-4">
              <div className="flex bg-gray-100 rounded-full p-0.5">
                <button onClick={() => setPreviewTab("preview")}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    previewTab === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}>Preview</button>
                <button onClick={() => setPreviewTab("qrcode")}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    previewTab === "qrcode" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}>QR code</button>
              </div>
            </div>
            <PhoneMockup>
              {previewTab === "qrcode" ? (
                <div className="h-full bg-gradient-to-br from-violet-50 to-purple-50 flex flex-col items-center justify-center p-4">
                  {previewUrl ? (
                    <div className="relative">
                      <div className="bg-white rounded-2xl p-4 shadow-lg">
                        <img
                          src={previewUrl}
                          alt="QR Preview"
                          className="w-[180px] h-[180px] object-contain"
                          onError={() => setPreviewUrl(null)}
                        />
                      </div>
                      {previewLoading && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : qrType ? (
                    <div className="relative">
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <InstantQRPreview content={content} type={qrType} design={design} size={180} />
                      </div>
                      {previewLoading && (
                        <div className="absolute inset-0 bg-white/50 rounded-2xl flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                      <QrCodeIcon className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                      <p>QR preview will appear here</p>
                    </div>
                  )}
                </div>
              ) : (
                qrType ? renderPreviewForType(qrType, content) : <div className="h-full bg-white" />
              )}
            </PhoneMockup>
          </div>
        </div>
      </div>
    </div>
  );
}
