"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, FolderIcon, QrCodeIcon,
  ArrowDownTrayIcon, SparklesIcon, PaintBrushIcon, DocumentCheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { PRICING, PLAN_FEATURES } from "@/lib/utils";
import Spinner from "@/components/ui/Spinner";
import TypeSelector from "@/components/qr/TypeSelector";
import ContentForms from "@/components/qr/ContentForms";
import DesignOptions from "@/components/qr/DesignOptions";
import PhoneMockup from "@/components/qr/PhoneMockup";
import { DefaultPhonePreview, renderPreviewForType } from "@/components/qr/PhonePreviews";
import AdvancedSettings from "@/components/qr/AdvancedSettings";

// Dynamic import with SSR disabled - CustomSVGQR uses browser APIs
const CustomSVGQR = dynamic(
  () => import("@/components/qr/CustomSVGQR").then(mod => mod.default),
  { ssr: false, loading: () => <div className="w-[220px] h-[220px] bg-gray-100 animate-pulse rounded-lg" /> }
);

// ─── Main Component ─────────────────────────────────────────────────────────
type FormContent = Record<string, any>;

const STEPS = [
  { num: 1, label: "Type", icon: SparklesIcon, description: "Choose QR type" },
  { num: 2, label: "Content", icon: DocumentCheckIcon, description: "Add your content" },
  { num: 3, label: "Design", icon: PaintBrushIcon, description: "Customize style" },
  { num: 4, label: "Download", icon: ArrowDownTrayIcon, description: "Get your QR" },
];

type BillingInterval = 'monthly' | 'quarterly' | 'annually';

const billingOptions: { key: BillingInterval; popular?: boolean }[] = [
  { key: 'monthly' },
  { key: 'annually', popular: true },
  { key: 'quarterly' },
];

function CreateQRPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    cornersDotType: 1,
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.4,
    frameStyle: "none",
    frameId: -1,
    frameColor: "#000000",
    frameText: "Scan me!",
    frameFontSize: 42,
    frameTextColor: "#000000",
    frameBackgroundColor: "#FFFFFF",
    patternGradient: false,
    patternColor2: "#7C3AED",
    bgTransparent: false,
    useGradientBg: false,
    bgColor2: "#7C3AED",
    errorCorrectionLevel: "H",
  });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [createdQr, setCreatedQr] = useState<{ id: string; imageUrl: string } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Advanced Settings State
  const [password, setPassword] = useState("");
  const [scanLimit, setScanLimit] = useState<number | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [facebookPixelId, setFacebookPixelId] = useState("");
  const [googleTagManagerId, setGoogleTagManagerId] = useState("");

  // Ad user trial gate state
  const [adUserNeedsTrial, setAdUserNeedsTrial] = useState(false);
  const [showTrialGate, setShowTrialGate] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<BillingInterval>('annually');
  const [trialLoading, setTrialLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const activePreview = hoveredType || qrType || "";

  // Fetch QR preview from QRFY via our API
  const fetchPreview = useCallback(async () => {
    if (!qrType) return;

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

  // Debounced preview refresh
  useEffect(() => {
    if (step >= 2 && qrType) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchPreview(), 1000);
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }
  }, [step, design, qrType, content, fetchPreview]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if this is an ad user who needs trial (on mount)
  useEffect(() => {
    async function checkAdUserStatus() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.requiresCardTrial && !data.stripeSubscriptionId) {
            setAdUserNeedsTrial(true);
          }
        }
      } catch {
        // Silently fail — not critical for page function
      }
    }
    checkAdUserStatus();
  }, []);

  // Handle return from Stripe payment
  useEffect(() => {
    if (searchParams.get("payment") !== "success") return;

    setProcessingPayment(true);
    let retries = 0;
    const maxRetries = 8;

    const pollSubscription = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.stripeSubscriptionId) {
            // Payment confirmed — trigger auto-download
            setProcessingPayment(false);
            setPaymentConfirmed(true);
            setAdUserNeedsTrial(false);
            setShowTrialGate(false);

            // Auto-download from localStorage
            try {
              const pending = localStorage.getItem("pendingQrDownload");
              if (pending) {
                const { qrId, qrName, format } = JSON.parse(pending);
                localStorage.removeItem("pendingQrDownload");
                // Set createdQr so Step 4 renders correctly
                setCreatedQr({ id: qrId, imageUrl: "" });
                setStep(4);
                // Trigger download
                const dlRes = await fetch(`/api/qrcodes/${qrId}/image?format=${format || "png"}`);
                if (dlRes.ok) {
                  const blob = await dlRes.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${qrName || "qrcode"}.${format || "png"}`;
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("QR code downloaded!");
                }
              }
            } catch {
              // Download from localStorage failed — user can still download manually
            }
            return;
          }
        }
      } catch {
        // Network error — will retry
      }

      retries++;
      if (retries < maxRetries) {
        setTimeout(pollSubscription, 2000);
      } else {
        setProcessingPayment(false);
        toast.error("Payment verification timed out. Please refresh the page.");
      }
    };

    pollSubscription();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Start trial for ad user
  const handleStartTrial = async (interval?: BillingInterval) => {
    const chosen = interval || selectedInterval;
    setTrialLoading(true);
    try {
      // Save pending download to localStorage before redirect
      if (createdQr?.id) {
        localStorage.setItem("pendingQrDownload", JSON.stringify({
          qrId: createdQr.id,
          qrName: name,
          format: "png",
        }));
      }

      const res = await fetch("/api/stripe/start-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interval: chosen,
          successRedirect: "/dashboard/create?payment=success",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.redirect) {
          router.push(data.redirect);
          return;
        }
        toast.error(data.error || "Something went wrong");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setTrialLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Please enter a name"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: qrType,
          content,
          design,
          // Advanced Settings
          password: password || undefined,
          scanLimit,
          folderId: folderId || undefined,
          googleAnalyticsId: googleAnalyticsId || undefined,
          facebookPixelId: facebookPixelId || undefined,
          googleTagManagerId: googleTagManagerId || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("QR code created!");
        setCreatedQr({ id: data.id, imageUrl: previewUrl || "" });
        setStep(4);
      } else if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push("/auth/login");
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to create");
      }
    } catch { toast.error("Something went wrong"); }
    setSaving(false);
  };

  const downloadQr = async (format: "png" | "svg") => {
    if (!createdQr?.id) return;
    try {
      // Always fetch from the image API for best quality
      const res = await fetch(`/api/qrcodes/${createdQr.id}/image?format=${format}`);
      if (!res.ok) {
        // If styled image fails, try preview API as fallback
        const fallbackRes = await fetch("/api/qrcodes/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: qrType, content, design, format: format === "svg" ? "svg" : "png" }),
        });
        if (!fallbackRes.ok) throw new Error("Download failed");
        const blob = await fallbackRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name || "qrcode"}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name || "qrcode"}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      toast.error("Download failed. Please try again.");
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

              {/* Advanced Settings - Password, Scan Limit, Folder, Analytics */}
              <AdvancedSettings
                password={password}
                setPassword={setPassword}
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
              />

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
              {/* Processing payment spinner */}
              {processingPayment && (
                <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl p-12 text-center">
                  <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-6" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Processing payment...</h2>
                  <p className="text-gray-500 text-sm">Verifying your subscription. This may take a few seconds.</p>
                </div>
              )}

              {/* Main Step 4 content (not processing) */}
              {!processingPayment && (
                <>
                  <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl p-8 text-center">
                    {/* Success animation */}
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                        <CheckCircleIcon className="h-10 w-10 text-white" />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Created!</h2>
                    <p className="text-gray-500 mb-8">
                      Your QR code &ldquo;{name}&rdquo; is ready
                      {adUserNeedsTrial && !paymentConfirmed ? " — start your free trial to download." : " to use. Download it below."}
                    </p>

                    {createdQr.id ? (
                      <div className="relative inline-block mb-8">
                        <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-3xl blur-xl" />
                        <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                          <img
                            src={`/api/qrcodes/${createdQr.id}/image?format=png`}
                            alt="Your QR Code"
                            className="w-64 h-64 mx-auto object-contain"
                            onError={(e) => {
                              if (createdQr.imageUrl) {
                                (e.target as HTMLImageElement).src = createdQr.imageUrl;
                              }
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-8 mb-8 inline-block">
                        <QrCodeIcon className="h-32 w-32 mx-auto text-gray-300" />
                        <p className="text-xs text-gray-400 mt-3">QR code preview unavailable</p>
                      </div>
                    )}

                    {/* Download buttons (for organic users OR ad users who paid) */}
                    {(!adUserNeedsTrial || paymentConfirmed) && (
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
                    )}
                  </div>

                  {/* Trial gate for ad users */}
                  {adUserNeedsTrial && !paymentConfirmed && (
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl p-8">
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-4">
                          <LockClosedIcon className="h-4 w-4" />
                          Download your QR code
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Start your free trial to download</h3>
                        <p className="text-gray-500 text-sm">Get full access to all premium features for 7 days.</p>
                      </div>

                      {/* Plan cards */}
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        {billingOptions.map((option) => {
                          const plan = PRICING[option.key];
                          const isPopular = option.popular;
                          const isSelected = selectedInterval === option.key;

                          return (
                            <div
                              key={option.key}
                              onClick={() => setSelectedInterval(option.key)}
                              className={
                                "relative bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all " +
                                (isSelected
                                  ? "border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                                  : isPopular
                                    ? "border-blue-300 shadow-md"
                                    : "border-gray-200 hover:border-gray-300")
                              }
                            >
                              {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                                  <SparklesIcon className="h-3 w-3" />
                                  Best Value
                                </div>
                              )}

                              {plan.discount > 0 && (
                                <div className="absolute -top-2 -right-2 w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow">
                                  <span className="text-white text-[10px] font-bold">{plan.discount}%</span>
                                </div>
                              )}

                              {/* Selection indicator */}
                              <div className={
                                "absolute top-3 left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all " +
                                (isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300")
                              }>
                                {isSelected && <CheckIcon className="h-2.5 w-2.5 text-white" />}
                              </div>

                              <h4 className={"text-base font-bold text-center mb-1 " + (isPopular ? "text-blue-600" : "text-gray-900")}>
                                {plan.label}
                              </h4>

                              <div className="text-center mt-3 mb-2">
                                <div className="flex items-baseline justify-center gap-1">
                                  <span className="text-sm font-medium text-green-500">$</span>
                                  <span className="text-3xl font-bold text-green-500">0</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">for 7 days</p>
                                <div className="mt-1.5 inline-flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full">
                                  <span className="text-[10px] text-gray-400 line-through">${plan.perMonth.toFixed(2)}/mo</span>
                                  <span className="text-[10px] text-green-600 font-medium">FREE</span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => { e.stopPropagation(); handleStartTrial(option.key); }}
                                disabled={trialLoading}
                                className={
                                  "w-full py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-3 " +
                                  (isPopular || isSelected
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
                                    : "bg-gray-100 text-gray-900 hover:bg-gray-200")
                                }
                              >
                                {trialLoading && selectedInterval === option.key ? "Processing..." : "Start Free Trial"}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Trust bar */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1">
                          <ShieldCheckIcon className="h-3.5 w-3.5" />
                          Only $0.99 card verification
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircleIcon className="h-3.5 w-3.5 text-green-400" />
                          Cancel anytime
                        </span>
                        <span className="flex items-center gap-1">
                          <LockClosedIcon className="h-3.5 w-3.5" />
                          Secure payment via Stripe
                        </span>
                      </div>
                    </div>
                  )}

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
                </>
              )}
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
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="QR Preview"
                        className="w-[220px] h-[220px] object-contain"
                        onError={() => {
                          // If API image fails to load, clear it to show InstantQRPreview fallback
                          setPreviewUrl(null);
                        }}
                      />
                      {previewLoading && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : qrType ? (
                    <div className="relative">
                      <CustomSVGQR content={content} type={qrType} design={design} size={220} />
                      {previewLoading && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCodeIcon className="h-20 w-20 mx-auto text-gray-200" />
                      <p className="text-xs mt-2">QR preview</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Phone Mockup - shows content preview only */}
            {(step === 1 || previewTab === "preview") && (
              <PhoneMockup>
                {step === 1 ? (
                  activePreview ? renderPreviewForType(activePreview) : <DefaultPhonePreview />
                ) : step === 4 && createdQr?.imageUrl ? (
                  <div className="h-full bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      <img src={createdQr.imageUrl} alt="QR Code" className="w-full max-w-[180px]" />
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

export default function CreateQRPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CreateQRPageContent />
    </Suspense>
  );
}
