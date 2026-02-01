"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import ColorPicker from "@/components/ui/ColorPicker";
import { QR_TYPES } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  GlobeAltIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  Bars3Icon,
  MusicalNoteIcon,
  TicketIcon,
  ChatBubbleLeftIcon,
  CameraIcon,
  HandThumbUpIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GlobeAltIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  VideoCameraIcon,
  DocumentIcon,
  PhotoIcon,
  Bars3Icon,
  MusicalNoteIcon,
  TicketIcon,
  ChatBubbleLeftIcon,
  CameraIcon,
  HandThumbUpIcon,
  ShareIcon,
  StarIcon,
  CalendarIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
};

// Preview descriptions for phone mockup
const PREVIEW_INFO: Record<string, { title: string; subtitle: string; color: string }> = {
  website: { title: "Website URL", subtitle: "Direct visitors to any webpage with a single scan", color: "from-blue-500 to-cyan-500" },
  vcard: { title: "vCard Contact", subtitle: "Share your full contact details instantly", color: "from-violet-500 to-purple-500" },
  menu: { title: "Restaurant Menu", subtitle: "Display your menu in a beautiful digital format", color: "from-orange-500 to-red-500" },
  business: { title: "Business Page", subtitle: "Showcase your business with a professional landing page", color: "from-emerald-500 to-teal-500" },
  apps: { title: "App Download", subtitle: "Link directly to App Store and Google Play", color: "from-pink-500 to-rose-500" },
  wifi: { title: "WiFi Access", subtitle: "Let guests connect to WiFi without typing passwords", color: "from-sky-500 to-blue-500" },
  video: { title: "Video", subtitle: "Share videos from YouTube, Vimeo or upload your own", color: "from-red-500 to-orange-500" },
  pdf: { title: "PDF Document", subtitle: "Share documents, brochures, and catalogs digitally", color: "from-amber-500 to-yellow-500" },
  images: { title: "Image Gallery", subtitle: "Create a beautiful photo gallery for any occasion", color: "from-fuchsia-500 to-pink-500" },
  links: { title: "Link List", subtitle: "Multiple links in one QR code, like a bio page", color: "from-indigo-500 to-violet-500" },
  mp3: { title: "Audio File", subtitle: "Share music, podcasts, or audio recordings", color: "from-green-500 to-emerald-500" },
  coupon: { title: "Digital Coupon", subtitle: "Drive sales with scannable discount codes", color: "from-yellow-500 to-amber-500" },
  whatsapp: { title: "WhatsApp", subtitle: "Start a WhatsApp conversation with one scan", color: "from-green-500 to-green-600" },
  instagram: { title: "Instagram", subtitle: "Grow your Instagram following effortlessly", color: "from-pink-500 to-purple-500" },
  facebook: { title: "Facebook", subtitle: "Connect visitors to your Facebook page", color: "from-blue-600 to-blue-700" },
  social: { title: "Social Media", subtitle: "All your social profiles in one place", color: "from-violet-500 to-fuchsia-500" },
  review: { title: "Reviews", subtitle: "Collect customer reviews and feedback easily", color: "from-amber-500 to-orange-500" },
  event: { title: "Event", subtitle: "Share event details with date, time and location", color: "from-teal-500 to-cyan-500" },
  email: { title: "Email", subtitle: "Pre-compose an email for instant communication", color: "from-blue-500 to-indigo-500" },
  sms: { title: "SMS", subtitle: "Send pre-written text messages with a scan", color: "from-green-400 to-emerald-500" },
  bitcoin: { title: "Bitcoin", subtitle: "Accept cryptocurrency payments via QR code", color: "from-orange-400 to-amber-500" },
  text: { title: "Plain Text", subtitle: "Display any text message when scanned", color: "from-gray-500 to-gray-600" },
};

const DOT_STYLES = ["square", "dots", "rounded", "extra-rounded", "classy", "classy-rounded"];
const EYE_STYLES = ["square", "dot", "extra-rounded"];

type FormContent = Record<string, any>;

export default function CreateQRPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [qrType, setQrType] = useState("");
  const [hoveredType, setHoveredType] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState<FormContent>({});
  const [design, setDesign] = useState({
    dotsColor: "#000000",
    dotsType: "square",
    cornersSquareColor: "#000000",
    cornersSquareType: "square",
    cornersDotColor: "#000000",
    cornersDotType: "square",
    backgroundColor: "#FFFFFF",
    logo: "",
    logoSize: 0.3,
    logoMargin: 5,
    frameStyle: "",
    frameColor: "#000000",
    frameText: "",
    frameTextColor: "#FFFFFF",
  });
  const [saving, setSaving] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const activePreview = hoveredType || qrType || "website";
  const previewInfo = PREVIEW_INFO[activePreview] || PREVIEW_INFO.website;

  const generatePreview = useCallback(async () => {
    if (!qrType || Object.keys(content).length === 0) return;
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = window.location.origin;
      const previewUrl = baseUrl + "/r/preview";
      const qr = new QRCodeStyling({
        width: 256,
        height: 256,
        data: previewUrl,
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });

      const blob = await qr.getRawData("png");
      if (blob) {
        const blobObj = blob instanceof Blob ? blob : new Blob([new Uint8Array(blob as any)], { type: "image/png" });
        const url = URL.createObjectURL(blobObj);
        setQrDataUrl(url);
      }
    } catch (e) {
      console.error("QR preview error:", e);
    }
  }, [qrType, content, design]);

  useEffect(() => {
    if (step >= 3) generatePreview();
  }, [step, design, generatePreview]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a name for your QR code");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type: qrType, content, design }),
      });
      if (res.ok) {
        toast.success("QR code created!");
        router.push("/dashboard");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create QR code");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  const handleDownload = async (format: "png" | "svg" | "jpeg") => {
    try {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      const baseUrl = window.location.origin;
      const qr = new QRCodeStyling({
        width: 1024,
        height: 1024,
        data: baseUrl + "/r/preview",
        dotsOptions: { color: design.dotsColor, type: design.dotsType as any },
        cornersSquareOptions: { color: design.cornersSquareColor, type: design.cornersSquareType as any },
        cornersDotOptions: { color: design.cornersDotColor, type: design.cornersDotType as any },
        backgroundOptions: { color: design.backgroundColor },
        imageOptions: { crossOrigin: "anonymous", margin: design.logoMargin },
        image: design.logo || undefined,
      });
      qr.download({ name: name || "qrcode", extension: format === "jpeg" ? "jpeg" : format });
    } catch {
      toast.error("Download failed");
    }
  };

  const renderContentForm = () => {
    switch (qrType) {
      case "website":
        return (
          <div className="space-y-4">
            <Input label="Website URL" placeholder="https://example.com" value={content.url || ""} onChange={(e) => setContent({ ...content, url: e.target.value })} />
          </div>
        );
      case "vcard":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={content.firstName || ""} onChange={(e) => setContent({ ...content, firstName: e.target.value })} />
              <Input label="Last Name" value={content.lastName || ""} onChange={(e) => setContent({ ...content, lastName: e.target.value })} />
            </div>
            <Input label="Phone" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <Input label="Email" type="email" value={content.email || ""} onChange={(e) => setContent({ ...content, email: e.target.value })} />
            <Input label="Organization" value={content.org || ""} onChange={(e) => setContent({ ...content, org: e.target.value })} />
            <Input label="Title" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <Input label="Website" value={content.website || ""} onChange={(e) => setContent({ ...content, website: e.target.value })} />
            <Input label="Address" value={content.address || ""} onChange={(e) => setContent({ ...content, address: e.target.value })} />
          </div>
        );
      case "wifi":
        return (
          <div className="space-y-4">
            <Input label="Network Name (SSID)" value={content.ssid || ""} onChange={(e) => setContent({ ...content, ssid: e.target.value })} />
            <Input label="Password" value={content.password || ""} onChange={(e) => setContent({ ...content, password: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Encryption</label>
              <select value={content.encryption || "WPA"} onChange={(e) => setContent({ ...content, encryption: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </div>
        );
      case "email":
        return (
          <div className="space-y-4">
            <Input label="Email Address" type="email" value={content.email || ""} onChange={(e) => setContent({ ...content, email: e.target.value })} />
            <Input label="Subject" value={content.subject || ""} onChange={(e) => setContent({ ...content, subject: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4} />
            </div>
          </div>
        );
      case "sms":
        return (
          <div className="space-y-4">
            <Input label="Phone Number" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4} />
            </div>
          </div>
        );
      case "whatsapp":
        return (
          <div className="space-y-4">
            <Input label="Phone Number (with country code)" placeholder="+1234567890" value={content.phone || ""} onChange={(e) => setContent({ ...content, phone: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pre-filled Message</label>
              <textarea value={content.message || ""} onChange={(e) => setContent({ ...content, message: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={3} />
            </div>
          </div>
        );
      case "event":
        return (
          <div className="space-y-4">
            <Input label="Event Name" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="datetime-local" value={content.startDate || ""} onChange={(e) => setContent({ ...content, startDate: e.target.value })} />
              <Input label="End Date" type="datetime-local" value={content.endDate || ""} onChange={(e) => setContent({ ...content, endDate: e.target.value })} />
            </div>
            <Input label="Location" value={content.location || ""} onChange={(e) => setContent({ ...content, location: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={content.description || ""} onChange={(e) => setContent({ ...content, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={3} />
            </div>
          </div>
        );
      case "coupon":
        return (
          <div className="space-y-4">
            <Input label="Coupon Title" value={content.title || ""} onChange={(e) => setContent({ ...content, title: e.target.value })} />
            <Input label="Discount" placeholder="20% OFF" value={content.discount || ""} onChange={(e) => setContent({ ...content, discount: e.target.value })} />
            <Input label="Coupon Code" value={content.code || ""} onChange={(e) => setContent({ ...content, code: e.target.value })} />
            <Input label="Expiry Date" type="date" value={content.expiryDate || ""} onChange={(e) => setContent({ ...content, expiryDate: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
              <textarea value={content.terms || ""} onChange={(e) => setContent({ ...content, terms: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={3} />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <Input label="URL or Content" placeholder="Enter URL or content" value={content.url || ""} onChange={(e) => setContent({ ...content, url: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={content.description || ""} onChange={(e) => setContent({ ...content, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500" rows={3} placeholder="Optional description" />
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create QR Code</h1>
        <p className="text-gray-500 text-sm mt-1">Select a QR code type to get started</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-1 mb-8">
        {[
          { num: 1, label: "Select Type" },
          { num: 2, label: "Add Content" },
          { num: 3, label: "Customize" },
          { num: 4, label: "Download" },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <button
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                step === s.num
                  ? "bg-violet-100 text-violet-700"
                  : step > s.num
                  ? "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                  step === s.num
                    ? "bg-violet-600 text-white"
                    : step > s.num
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                {step > s.num ? "\u2713" : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < 3 && <div className="w-6 sm:w-10 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Type Selection with Phone Mockup */}
      {step === 1 && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* QR Type Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {QR_TYPES.map((type) => {
                const IconComp = ICON_MAP[type.icon];
                const isSelected = qrType === type.id;
                const isHovered = hoveredType === type.id;
                return (
                  <button
                    key={type.id}
                    onMouseEnter={() => setHoveredType(type.id)}
                    onMouseLeave={() => setHoveredType("")}
                    onClick={() => {
                      setQrType(type.id);
                      setStep(2);
                    }}
                    className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 shadow-sm"
                        : isHovered
                        ? "border-violet-300 bg-violet-50/50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-violet-300"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
                        isSelected || isHovered
                          ? "bg-violet-100"
                          : "bg-gray-100 group-hover:bg-violet-50"
                      }`}
                    >
                      {IconComp && (
                        <IconComp
                          className={`h-5 w-5 transition-colors ${
                            isSelected || isHovered
                              ? "text-violet-600"
                              : "text-gray-500 group-hover:text-violet-500"
                          }`}
                        />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              {/* iPhone frame */}
              <div className="relative mx-auto w-[280px]">
                <div className="bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-gray-900 rounded-b-2xl z-10" />
                  {/* Screen */}
                  <div className="bg-white rounded-[2.25rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="h-12 bg-white flex items-end justify-center pb-1">
                      <div className="w-[60px] h-[5px] bg-gray-900 rounded-full" />
                    </div>
                    {/* Content with gradient */}
                    <div className={`bg-gradient-to-br ${previewInfo.color} px-6 pt-8 pb-12 transition-all duration-300`}>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                          {(() => {
                            const typeData = QR_TYPES.find((t) => t.id === activePreview);
                            const Icon = typeData ? ICON_MAP[typeData.icon] : null;
                            return Icon ? <Icon className="h-8 w-8 text-white" /> : null;
                          })()}
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">{previewInfo.title}</h3>
                        <p className="text-white/80 text-xs leading-relaxed">{previewInfo.subtitle}</p>
                      </div>
                    </div>
                    {/* Mock content area */}
                    <div className="px-5 py-6 space-y-3">
                      <div className="h-3 bg-gray-200 rounded-full w-3/4" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-5/6" />
                      <div className="mt-5 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl" />
                    </div>
                    {/* Home indicator */}
                    <div className="h-8 flex items-center justify-center">
                      <div className="w-[100px] h-[4px] bg-gray-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-4">
                Hover over a type to preview
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Steps 2-4 layout */}
      {step >= 2 && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 2: Content */}
            {step === 2 && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Enter Content for {QR_TYPES.find((t) => t.id === qrType)?.name}
                </h2>
                <div className="mb-4">
                  <Input label="QR Code Name" placeholder="My QR Code" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                {renderContentForm()}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Next: Design
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Design */}
            {step === 3 && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Design</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Colors</h3>
                    <div className="space-y-3">
                      <ColorPicker label="Dots Color" value={design.dotsColor} onChange={(c) => setDesign({ ...design, dotsColor: c })} />
                      <ColorPicker label="Background" value={design.backgroundColor} onChange={(c) => setDesign({ ...design, backgroundColor: c })} />
                      <ColorPicker label="Eye Color" value={design.cornersSquareColor} onChange={(c) => setDesign({ ...design, cornersSquareColor: c, cornersDotColor: c })} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Dot Pattern</h3>
                    <div className="flex flex-wrap gap-2">
                      {DOT_STYLES.map((s) => (
                        <button key={s} onClick={() => setDesign({ ...design, dotsType: s })} className={"px-3 py-1.5 text-sm rounded-lg border transition-all " + (design.dotsType === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Eye Style</h3>
                    <div className="flex flex-wrap gap-2">
                      {EYE_STYLES.map((s) => (
                        <button key={s} onClick={() => setDesign({ ...design, cornersSquareType: s })} className={"px-3 py-1.5 text-sm rounded-lg border transition-all " + (design.cornersSquareType === s ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Logo</h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const data = await res.json();
                        if (data.url) setDesign({ ...design, logo: data.url });
                      }}
                      className="text-sm text-gray-600"
                    />
                    {design.logo && <p className="text-xs text-green-600 mt-1">Logo uploaded</p>}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={() => setStep(4)} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Next: Download
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 4: Download */}
            {step === 4 && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Download & Save</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" onClick={() => handleDownload("png")}>Download PNG</Button>
                    <Button variant="outline" onClick={() => handleDownload("svg")}>Download SVG</Button>
                    <Button variant="outline" onClick={() => handleDownload("jpeg")}>Download JPG</Button>
                  </div>
                  <hr />
                  <Button onClick={handleSave} isLoading={saving} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                    Save QR Code
                  </Button>
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                </div>
              </Card>
            )}
          </div>

          {/* Preview panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
              <div ref={qrRef} className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[280px]">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Preview" className="w-64 h-64" />
                ) : (
                  <div className="text-center text-gray-400">
                    <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                      <p className="text-sm">QR preview will appear here</p>
                    </div>
                  </div>
                )}
              </div>
              {name && <p className="text-center text-sm text-gray-600 mt-3">{name}</p>}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
