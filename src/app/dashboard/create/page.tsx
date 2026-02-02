"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, FolderIcon, QrCodeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import Spinner from "@/components/ui/Spinner";
import TypeSelector from "@/components/qr/TypeSelector";
import ContentForms from "@/components/qr/ContentForms";
import DesignOptions from "@/components/qr/DesignOptions";
import PhoneMockup from "@/components/qr/PhoneMockup";
import { DefaultPhonePreview, renderPreviewForType } from "@/components/qr/PhonePreviews";

// ─── Main Component ─────────────────────────────────────────────────────────
type FormContent = Record<string, any>;

export default function CreateQRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState("");
  const [hoveredType, setHoveredType] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState<FormContent>({});
  const [previewTab, setPreviewTab] = useState<"preview" | "qrcode">("preview");
  const [design, setDesign] = useState<Record<string, any>>({
    dotsColor: "#000000",
    dotsType: "square",
    cornersSquareColor: "#000000",
    cornersSquareType: "default",
    cornersDotColor: "#000000",
    cornersDotType: "default",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.4,
    frameStyle: "none",
    frameId: 0,
    frameColor: "#000000",
    frameText: "Scan me!",
    frameFontSize: 42,
    frameTextColor: "#FFFFFF",
    frameBackgroundColor: "#000000",
    patternGradient: false,
    patternColor2: "#7C3AED",
    bgTransparent: false,
    useGradientBg: false,
    bgColor2: "#7C3AED",
    errorCorrectionLevel: "M",
  });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [createdQr, setCreatedQr] = useState<{ id: string; imageUrl: string } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const activePreview = hoveredType || qrType || "";

  // Fetch QR preview from QRFY via our API
  const fetchPreview = useCallback(async () => {
    if (!qrType) return;
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

  // Debounced preview refresh
  useEffect(() => {
    if (step >= 2 && qrType) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPreview(), 800);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
  }, [step, design, qrType, content, fetchPreview]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please enter a name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content, design }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("QR code created!");
        // Use the current preview as the created QR image
        setCreatedQr({ id: data.id, imageUrl: previewUrl || "" });
        setStep(4);
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to create");
      }
    } catch { toast.error("Something went wrong"); }
    setSaving(false);
  };

  const downloadQr = async (format: "png" | "svg") => {
    if (!createdQr?.imageUrl) return;
    try {
      if (format === "svg") {
        // Re-fetch the QR as SVG from our preview endpoint
        const res = await fetch("/api/qrcodes/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: qrType, content, design, format: "svg" }),
        });
        if (!res.ok) throw new Error("Failed to generate SVG");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name || "qrcode"}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Download the PNG preview
        const a = document.createElement("a");
        a.href = createdQr.imageUrl;
        a.download = `${name || "qrcode"}.png`;
        a.click();
      }
    } catch {
      toast.error("Download failed");
    }
  };

  // ─── Phone Preview Content ──────────────────────────────────────────────
  const renderPhoneContent = () => {
    if (step === 4 && createdQr?.imageUrl) {
      return (
        <div className="h-full bg-white flex items-center justify-center p-6">
          <img src={createdQr.imageUrl} alt="QR Code" className="w-full max-w-[200px]" />
        </div>
      );
    }
    if (step === 1) {
      if (activePreview) return renderPreviewForType(activePreview);
      return <DefaultPhonePreview />;
    }
    if (previewTab === "qrcode") {
      return (
        <div className="h-full bg-white flex items-center justify-center p-6">
          {previewLoading ? (
            <Spinner />
          ) : previewUrl ? (
            <img src={previewUrl} alt="QR Preview" className="w-full max-w-[200px]" />
          ) : (
            <div className="text-center text-gray-400 text-sm">
              <QrCodeIcon className="h-16 w-16 mx-auto mb-2 text-gray-300" />
              <p>QR preview will appear here</p>
            </div>
          )}
        </div>
      );
    }
    if (qrType) return renderPreviewForType(qrType, content);
    return <DefaultPhonePreview />;
  };

  return (
    <div>
      {/* Top bar with steps */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {step === 1 && "1. Select a type of QR code"}
          {step === 2 && "2. Add content to your QR code"}
          {step === 3 && "3. Design the QR"}
          {step === 4 && "Your QR Code is Ready!"}
        </h1>
        <div className="hidden sm:flex items-center gap-2">
          {[
            { num: 1, label: "Type of QR code" },
            { num: 2, label: "Content" },
            { num: 3, label: "QR design" },
            { num: 4, label: "Download" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              {step > s.num ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  step === s.num ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500"
                }`}>{s.num}</span>
              )}
              <span className={`text-xs ${step === s.num ? "text-gray-900 font-medium" : "text-gray-500"}`}>{s.label}</span>
              {i < 3 && <div className="w-8 h-px bg-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left content area */}
        <div className="lg:col-span-2">
          {/* ─── Step 1: Type Selection ──────────────────────────────── */}
          {step === 1 && (
            <TypeSelector
              onSelect={(typeId) => { setQrType(typeId); setStep(2); }}
              hoveredType={hoveredType}
              onHover={setHoveredType}
              selectedType={qrType}
            />
          )}

          {/* ─── Step 2: Content ─────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <ContentForms qrType={qrType} content={content} setContent={setContent} />

              {/* Name */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <QrCodeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Name of the QR Code</p>
                    <p className="text-xs text-gray-500">Give a name to your QR code.</p>
                  </div>
                </div>
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Name</label>
                  <input type="text" placeholder="E.g. My QR code" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400" />
                </div>
              </div>

              {/* Password (placeholder) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Password</p>
                    <p className="text-xs text-gray-500">Protect your QR code with a password.</p>
                  </div>
                </div>
              </div>

              {/* Folder (placeholder) */}
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                <div className="px-5 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Folder</p>
                    <p className="text-xs text-gray-500">Link this QR to an existing or a new folder.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={() => { setStep(3); setPreviewTab("qrcode"); }} className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors">
                  Next <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: QR Design ─────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <DesignOptions design={design} setDesign={setDesign} />

              <div className="flex items-center justify-between pt-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 rounded-lg text-sm text-white font-medium hover:bg-violet-700 transition-colors disabled:opacity-50">
                  {saving ? "Creating..." : "Create"} <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Download ──────────────────────────────────── */}
          {step === 4 && createdQr && (
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircleIcon className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">QR Code Created Successfully!</h2>
                <p className="text-sm text-gray-500 mb-6">Your QR code &ldquo;{name}&rdquo; is ready. Download it in your preferred format.</p>

                {createdQr.imageUrl ? (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6 inline-block">
                    <img src={createdQr.imageUrl} alt="Your QR Code" className="w-64 h-64 mx-auto" />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <QrCodeIcon className="h-32 w-32 mx-auto text-gray-300" />
                    <p className="text-xs text-gray-400 mt-2">QR code preview unavailable</p>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => downloadQr("png")}
                    className="flex items-center gap-2 px-6 py-3 bg-violet-600 rounded-xl text-sm text-white font-medium hover:bg-violet-700 transition-colors">
                    <ArrowDownTrayIcon className="h-4 w-4" /> Download PNG
                  </button>
                  <button onClick={() => downloadQr("svg")}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-violet-600 rounded-xl text-sm text-violet-600 font-medium hover:bg-violet-50 transition-colors">
                    <ArrowDownTrayIcon className="h-4 w-4" /> Download SVG
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => { setCreatedQr(null); setStep(3); }}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <ArrowLeftIcon className="h-4 w-4" /> Edit Design
                </button>
                <button onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 rounded-lg text-sm text-white font-medium hover:bg-gray-800 transition-colors">
                  Go to Dashboard <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Phone Mockup ──────────────────────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {step >= 2 && step < 4 && (
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
            )}
            <PhoneMockup>{renderPhoneContent()}</PhoneMockup>
            {step === 1 && (
              <p className="text-center text-xs text-gray-400 mt-4">Hover over a type to preview</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
