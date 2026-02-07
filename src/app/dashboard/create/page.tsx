"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, FolderIcon, QrCodeIcon,
  ArrowDownTrayIcon, SparklesIcon, PaintBrushIcon, DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Spinner from "@/components/ui/Spinner";
import TypeSelector from "@/components/qr/TypeSelector";
import ContentForms from "@/components/qr/ContentForms";
import DesignOptions from "@/components/qr/DesignOptions";
import PhoneMockup from "@/components/qr/PhoneMockup";
import { DefaultPhonePreview, renderPreviewForType } from "@/components/qr/PhonePreviews";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled - CustomSVGQR uses browser APIs
const CustomSVGQR = dynamic(
  () => import("@/components/qr/CustomSVGQR").then(mod => mod.default),
  { ssr: false, loading: () => <div className="w-[220px] h-[220px] bg-gray-100 animate-pulse rounded-xl" /> }
);

// Import download function separately
const downloadQRCodeFn = async (svgElement: SVGSVGElement, name: string, format: "png" | "svg") => {
  const { downloadCustomQR } = await import("@/components/qr/CustomSVGQR");
  return downloadCustomQR(svgElement, name, format);
};

// ─── Main Component ─────────────────────────────────────────────────────────
type FormContent = Record<string, any>;

const STEPS = [
  { num: 1, label: "Type", icon: SparklesIcon, description: "Choose QR type" },
  { num: 2, label: "Content", icon: DocumentCheckIcon, description: "Add your content" },
  { num: 3, label: "Design", icon: PaintBrushIcon, description: "Customize style" },
  { num: 4, label: "Download", icon: ArrowDownTrayIcon, description: "Get your QR" },
];

export default function CreateQRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState("");
  const [hoveredType, setHoveredType] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState<FormContent>({});
  const [previewTab, setPreviewTab] = useState<"preview" | "qrcode">("preview");
  const [design, setDesign] = useState<Record<string, any>>({
    dotsColor: "#6D28D9",
    dotsType: "rounded",
    cornersSquareColor: "#6D28D9",
    cornersSquareType: "extra-rounded",
    cornersDotColor: "#6D28D9",
    cornersDotType: "dot",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.4,
    frameStyle: "none",
    frameId: -1,
    frameColor: "#6D28D9",
    frameText: "Scan me!",
    frameFontSize: 42,
    frameTextColor: "#FFFFFF",
    frameBackgroundColor: "#6D28D9",
    patternGradient: false,
    patternColor2: "#7C3AED",
    bgTransparent: false,
    useGradientBg: false,
    bgColor2: "#7C3AED",
    errorCorrectionLevel: "H",
  });
  const [saving, setSaving] = useState(false);
  const [createdQr, setCreatedQr] = useState<{ id: string; slug: string } | null>(null);
  const qrSvgRef = useRef<SVGSVGElement | null>(null);

  const activePreview = hoveredType || qrType || "";

  // Handle QR code ready - store the SVG element for downloads
  const handleQRReady = useCallback((svgElement: SVGSVGElement | null) => {
    qrSvgRef.current = svgElement;
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
        setCreatedQr({ id: data.id, slug: data.slug });
        setStep(4);
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to create");
      }
    } catch { toast.error("Something went wrong"); }
    setSaving(false);
  };

  const downloadQr = async (format: "png" | "svg") => {
    if (!qrSvgRef.current) {
      toast.error("QR code not ready");
      return;
    }
    try {
      await downloadQRCodeFn(qrSvgRef.current, name || "qrcode", format);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Premium header with steps */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {step === 1 && "Choose QR Code Type"}
              {step === 2 && "Add Your Content"}
              {step === 3 && "Design Your QR Code"}
              {step === 4 && "Your QR Code is Ready!"}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 && "Select the type of QR code that best fits your needs"}
              {step === 2 && "Fill in the details for your QR code"}
              {step === 3 && "Customize colors, patterns, frames and more"}
              {step === 4 && "Download your QR code in your preferred format"}
            </p>
          </div>
        </div>

        {/* Step indicators - premium design */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="flex items-center bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            {STEPS.map((s, i) => {
              const IconComp = s.icon;
              const isActive = step === s.num;
              const isCompleted = step > s.num;

              return (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                        : isCompleted
                          ? "bg-green-50 text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="h-5 w-5" />
                    ) : (
                      <IconComp className="h-5 w-5" />
                    )}
                    <span className="text-sm font-semibold">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 transition-colors ${
                      step > s.num ? "bg-green-400" : "bg-gray-200"
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile step indicator */}
        <div className="sm:hidden flex items-center justify-center gap-2">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                step === s.num
                  ? "bg-violet-600 scale-125"
                  : step > s.num
                    ? "bg-green-500"
                    : "bg-gray-300"
              }`}
            />
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

              {/* Name - Premium card */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="px-5 py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <QrCodeIcon className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">QR Code Name</p>
                    <p className="text-xs text-gray-500">Give your QR code a memorable name</p>
                  </div>
                </div>
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <input type="text" placeholder="E.g. My Business Card QR" value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 text-gray-900 placeholder-gray-400 transition-all" />
                </div>
              </div>

              {/* Password & Folder placeholders */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Password Protection</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FolderIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">Organize in Folder</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={() => { setStep(3); setPreviewTab("qrcode"); }} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-sm text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                  Continue to Design <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: QR Design ─────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <DesignOptions design={design} setDesign={setDesign} />

              <div className="flex items-center justify-between pt-6">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  <ArrowLeftIcon className="h-4 w-4" /> Back
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-sm text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? (
                    <>
                      <Spinner size="sm" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create QR Code <CheckCircleIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Download ──────────────────────────────────── */}
          {step === 4 && createdQr && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl p-8 text-center">
                {/* Success animation */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                    <CheckCircleIcon className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Created!</h2>
                <p className="text-gray-500 mb-8">Your QR code &ldquo;{name}&rdquo; is ready to use. Download it below.</p>

                <div className="relative inline-block mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                  <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <CustomSVGQR
                      content={content}
                      type={qrType}
                      design={design}
                      size={256}
                      slug={createdQr.slug}
                      onReady={handleQRReady}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={() => downloadQr("png")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                    <ArrowDownTrayIcon className="h-5 w-5" /> Download PNG
                  </button>
                  <button onClick={() => downloadQr("svg")}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-violet-200 rounded-xl text-violet-600 font-semibold hover:bg-violet-50 hover:border-violet-300 transition-all">
                    <ArrowDownTrayIcon className="h-5 w-5" /> Download SVG
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => { setCreatedQr(null); setStep(3); }}
                  className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                  <ArrowLeftIcon className="h-4 w-4" /> Edit Design
                </button>
                <button onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 rounded-xl text-sm text-white font-semibold hover:bg-gray-800 transition-all">
                  Go to Dashboard <ArrowRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right: Preview Panel ──────────────────────────────────── */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            {/* Tab switcher */}
            {step >= 2 && step < 4 && (
              <div className="flex justify-center mb-4">
                <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                  <button onClick={() => setPreviewTab("qrcode")}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                      previewTab === "qrcode"
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    <QrCodeIcon className="h-4 w-4 inline mr-1.5" />
                    QR Code
                  </button>
                  <button onClick={() => setPreviewTab("preview")}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                      previewTab === "preview"
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}>
                    Preview
                  </button>
                </div>
              </div>
            )}

            {/* QR Code Display (separate, clean) */}
            {step >= 2 && step < 4 && previewTab === "qrcode" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
                <div className="flex items-center justify-center">
                  {qrType ? (
                    <CustomSVGQR
                      content={content}
                      type={qrType}
                      design={design}
                      size={220}
                      onReady={handleQRReady}
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCodeIcon className="h-20 w-20 mx-auto text-gray-200" />
                      <p className="text-xs mt-2">QR preview</p>
                    </div>
                  )}
                </div>
                <p className="text-center text-[10px] text-gray-400 mt-3">Live styled preview</p>
              </div>
            )}

            {/* Phone Mockup - shows content preview only */}
            {(step === 1 || previewTab === "preview") && (
              <PhoneMockup>
                {step === 1 ? (
                  activePreview ? renderPreviewForType(activePreview) : <DefaultPhonePreview />
                ) : step === 4 && createdQr ? (
                  <div className="h-full bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <CustomSVGQR content={content} type={qrType} design={design} size={160} slug={createdQr.slug} />
                    </div>
                  </div>
                ) : qrType ? (
                  renderPreviewForType(qrType, content)
                ) : (
                  <DefaultPhonePreview />
                )}
              </PhoneMockup>
            )}

            {step === 1 && (
              <p className="text-center text-sm text-gray-400 mt-6">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  Hover over a type to preview
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
