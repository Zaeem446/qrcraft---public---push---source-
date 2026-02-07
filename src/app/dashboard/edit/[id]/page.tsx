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
import StyledQRPreview, { downloadQRCode } from "@/components/qr/StyledQRPreview";
import type QRCodeStyling from "qr-code-styling";

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
  const qrCodeInstanceRef = useRef<QRCodeStyling | null>(null);

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

  const handleQRReady = useCallback((qrCode: QRCodeStyling) => {
    qrCodeInstanceRef.current = qrCode;
  }, []);

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
    if (!qrCodeInstanceRef.current) {
      toast.error("QR code not ready");
      return;
    }
    try {
      // Note: qr-code-styling only supports png and svg natively
      // For other formats, download as png
      const downloadFormat = format === "png" ? "png" : "png";
      await downloadQRCode(qrCodeInstanceRef.current, name || "qrcode", downloadFormat as "png");
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
                  {qrType ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <StyledQRPreview
                        content={content}
                        type={qrType}
                        design={design}
                        size={180}
                        onReady={handleQRReady}
                      />
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
