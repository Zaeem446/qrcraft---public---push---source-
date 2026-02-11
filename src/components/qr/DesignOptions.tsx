"use client";

import { useState } from "react";
import {
  QrCodeIcon, ChevronDownIcon, ArrowPathIcon,
  PhotoIcon as PhotoSolidIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  QRFY_SHAPE_SVGS,
  QRFY_BORDER_SVGS,
  QRFY_CENTER_SVGS,
  QRFY_FRAME_SVGS,
} from "@/lib/qrfy-svgs";

// ─── SVG Pattern Thumbnails (using QRFY numbers directly) ─────────────────────

// Render actual QRFY Shape SVG by number (1-19)
function PatternSVG({ num }: { num: number }) {
  const svgData = QRFY_SHAPE_SVGS[num];
  if (!svgData) return null;

  return (
    <svg
      viewBox={svgData.viewBox}
      className="w-12 h-12 text-gray-700"
      dangerouslySetInnerHTML={{ __html: svgData.inner.replace(/#000000/g, 'currentColor') }}
    />
  );
}

// Render actual QRFY Border style SVG by number (1-15)
function CornerSquareSVG({ num }: { num: number }) {
  const svgData = QRFY_BORDER_SVGS[num];
  if (!svgData) return null;

  return (
    <svg
      viewBox={svgData.viewBox}
      className="w-12 h-12 text-gray-600"
      dangerouslySetInnerHTML={{ __html: svgData.inner.replace(/#000000/g, 'currentColor') }}
    />
  );
}

// Render QRFY Center style SVG by number (1-17)
function CornerDotSVG({ num }: { num: number }) {
  const svgData = QRFY_CENTER_SVGS[num];
  if (!svgData) return null;

  return (
    <svg
      viewBox={svgData.viewBox}
      className="w-12 h-12 text-gray-600"
      dangerouslySetInnerHTML={{ __html: svgData.inner.replace(/#000000/g, 'currentColor') }}
    />
  );
}

// Render actual QRFY Frame SVG
function FrameSVG({ id }: { id: number }) {
  const svgData = QRFY_FRAME_SVGS[id];
  if (!svgData) {
    // Fallback for unknown frames
    return (
      <svg viewBox="0 0 48 48" className="w-10 h-10 text-gray-400">
        <rect x="6" y="4" width="36" height="40" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // Handle special SVG attributes for frames
  const processedInner = svgData.inner
    .replace(/#000000/g, 'currentColor')
    .replace(/fill="currentColor"/g, 'fill="currentColor"')
    .replace(/stroke="currentColor"/g, 'stroke="currentColor"');

  return (
    <svg
      viewBox={svgData.viewBox}
      className="w-10 h-10 text-gray-600"
      style={{ fill: 'none' }}
      dangerouslySetInnerHTML={{ __html: processedInner }}
    />
  );
}

// Accordion Section component
function AccordionSection({ icon, title, subtitle, children, defaultOpen = false }: {
  icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">{icon}</div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

// Inline color picker component
function InlineColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-6 h-6 rounded-md border border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-xs font-mono border border-gray-200 rounded text-gray-700 uppercase"
        />
      </div>
    </div>
  );
}

// ─── Design Options Constants (using QRFY numbers directly) ──────────────────

// 19 Shape styles - using QRFY numbers (1-19)
const SHAPE_STYLES = [
  { id: 1, label: "Style 1" },
  { id: 2, label: "Style 2" },
  { id: 3, label: "Style 3" },
  { id: 4, label: "Style 4" },
  { id: 5, label: "Style 5" },
  { id: 6, label: "Style 6" },
  { id: 7, label: "Style 7" },
  { id: 8, label: "Style 8" },
  { id: 9, label: "Style 9" },
  { id: 10, label: "Style 10" },
  { id: 11, label: "Style 11" },
  { id: 12, label: "Style 12" },
  { id: 13, label: "Style 13" },
  { id: 14, label: "Style 14" },
  { id: 15, label: "Style 15" },
  { id: 16, label: "Style 16" },
  { id: 17, label: "Style 17" },
  { id: 18, label: "Style 18" },
  { id: 19, label: "Style 19" },
];

// 16 Border styles
const CORNER_SQUARE_STYLES = [
  { id: 1, label: "Border 1" },
  { id: 2, label: "Border 2" },
  { id: 3, label: "Border 3" },
  { id: 4, label: "Border 4" },
  { id: 5, label: "Border 5" },
  { id: 6, label: "Border 6" },
  { id: 7, label: "Border 7" },
  { id: 8, label: "Border 8" },
  { id: 9, label: "Border 9" },
  { id: 10, label: "Border 10" },
  { id: 11, label: "Border 11" },
  { id: 12, label: "Border 12" },
  { id: 13, label: "Border 13" },
  { id: 14, label: "Border 14" },
  { id: 15, label: "Border 15" },
  { id: 16, label: "Border 16" },
];

// 17 Center styles (QRFY corner dot API styles)
const CORNER_DOT_STYLES = [
  { id: 1, label: "Center 1" },
  { id: 2, label: "Center 2" },
  { id: 3, label: "Center 3" },
  { id: 4, label: "Center 4" },
  { id: 5, label: "Center 5" },
  { id: 6, label: "Center 6" },
  { id: 7, label: "Center 7" },
  { id: 8, label: "Center 8" },
  { id: 9, label: "Center 9" },
  { id: 10, label: "Center 10" },
  { id: 11, label: "Center 11" },
  { id: 12, label: "Center 12" },
  { id: 13, label: "Center 13" },
  { id: 14, label: "Center 14" },
  { id: 15, label: "Center 15" },
  { id: 16, label: "Center 16" },
  { id: 17, label: "Center 17" },
];

const ERROR_CORRECTION = [
  { id: "L", label: "Low" },
  { id: "M", label: "Medium" },
  { id: "Q", label: "Quartile" },
  { id: "H", label: "High" },
];

// Frame metadata - maps to QRFY frame IDs
const FRAME_META = [
  { id: 0, label: "None" },
  { id: 1, label: "Frame 1" },
  { id: 2, label: "Frame 2" },
  { id: 3, label: "Frame 3" },
  { id: 4, label: "Frame 4" },
  { id: 5, label: "Frame 5" },
  { id: 6, label: "Frame 6" },
  { id: 7, label: "Frame 7" },
  { id: 8, label: "Frame 8" },
  { id: 9, label: "Frame 9" },
  { id: 10, label: "Frame 10" },
  { id: 11, label: "Frame 11" },
  { id: 12, label: "Frame 12" },
  { id: 13, label: "Frame 13" },
  { id: 14, label: "Frame 14" },
  { id: 15, label: "Frame 15" },
  { id: 16, label: "Frame 16" },
  { id: 17, label: "Frame 17" },
  { id: 18, label: "Frame 18" },
  { id: 19, label: "Frame 19" },
  { id: 20, label: "Frame 20" },
  { id: 21, label: "Frame 21" },
  { id: 22, label: "Frame 22" },
  { id: 23, label: "Frame 23" },
  { id: 24, label: "Frame 24" },
  { id: 25, label: "Frame 25" },
  { id: 26, label: "Frame 26" },
  { id: 27, label: "Frame 27" },
  { id: 28, label: "Frame 28" },
  { id: 29, label: "Frame 29" },
  { id: 30, label: "Frame 30" },
  { id: 31, label: "Frame 31" },
];

// Preset logo URLs (external sources - QRFY can't fetch from its own domain)
const PRESET_LOGOS = [
  { id: "", label: "None", url: "" },
  { id: "whatsapp", label: "WhatsApp", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/120px-WhatsApp.svg.png" },
  { id: "facebook", label: "Facebook", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/120px-Facebook_Logo_%282019%29.png" },
  { id: "instagram", label: "Instagram", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/120px-Instagram_logo_2016.svg.png" },
  { id: "twitter", label: "X/Twitter", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/120px-X_logo_2023.svg.png" },
  { id: "youtube", label: "YouTube", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/120px-YouTube_full-color_icon_%282017%29.svg.png" },
  { id: "linkedin", label: "LinkedIn", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/120px-LinkedIn_logo_initials.png" },
  { id: "tiktok", label: "TikTok", url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/120px-TikTok_logo.svg.png" },
  { id: "telegram", label: "Telegram", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/120px-Telegram_logo.svg.png" },
  { id: "paypal", label: "PayPal", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png" },
  { id: "bitcoin", label: "Bitcoin", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/120px-Bitcoin.svg.png" },
];


// ─── Main DesignOptions Component ────────────────────────────────────────────

interface DesignOptionsProps {
  design: Record<string, any>;
  setDesign: (d: Record<string, any>) => void;
}

export default function DesignOptions({ design, setDesign }: DesignOptionsProps) {
  const set = (key: string, val: any) => setDesign({ ...design, [key]: val });
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      set("logo", data.url);
      toast.success("Logo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Shape Pattern */}
      <AccordionSection
        icon={<QrCodeIcon className="h-5 w-5 text-gray-500" />}
        title="QR Code Pattern" subtitle="Choose a shape pattern for your QR code." defaultOpen>
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Pattern style</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              {SHAPE_STYLES.map(p => (
                <button key={p.id} onClick={() => set("dotsType", p.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.dotsType === p.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <PatternSVG num={p.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Pattern color</label>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-sm text-gray-600">Gradient</span>
                <div className="ml-auto">
                  <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${design.patternGradient ? "bg-violet-500" : "bg-gray-300"}`}
                    onClick={() => set("patternGradient", !design.patternGradient)}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.patternGradient ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              </div>
              <InlineColorPicker label="Color" value={design.dotsColor || "#000000"} onChange={v => set("dotsColor", v)} />
            </div>
            {design.patternGradient && (
              <InlineColorPicker label="Color 2" value={design.patternColor2 || "#7C3AED"} onChange={v => set("patternColor2", v)} />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <ArrowPathIcon className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Background color</label>
            <label className="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" checked={design.bgTransparent || false} onChange={e => set("bgTransparent", e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-sm text-gray-600">Transparent background</span>
            </label>
            {!design.bgTransparent && (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-600">Gradient</span>
                    <div className="ml-auto">
                      <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${design.useGradientBg ? "bg-violet-500" : "bg-gray-300"}`}
                        onClick={() => set("useGradientBg", !design.useGradientBg)}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${design.useGradientBg ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                  </div>
                  <InlineColorPicker label="Background" value={design.backgroundColor || "#FFFFFF"} onChange={v => set("backgroundColor", v)} />
                </div>
                {design.useGradientBg && (
                  <InlineColorPicker label="Background color 2" value={design.bgColor2 || "#7C3AED"} onChange={v => set("bgColor2", v)} />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <span className="text-amber-700 text-sm">For optimal QR code reading, use high-contrast colors.</span>
          </div>
        </div>
      </AccordionSection>

      {/* Corners */}
      <AccordionSection
        icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M3 9V5a2 2 0 012-2h4"/><path d="M15 3h4a2 2 0 012 2v4"/><circle cx="12" cy="12" r="3"/></svg>}
        title="QR Code Corners" subtitle="Select corner square and dot styles.">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Corner square style</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {CORNER_SQUARE_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersSquareType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersSquareType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerSquareSVG num={c.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Corner dot style</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-2">
              {CORNER_DOT_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersDotType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersDotType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerDotSVG num={c.id} />
                  <span className="text-[10px] font-medium text-gray-600 leading-tight text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <InlineColorPicker label="Corner square color" value={design.cornersSquareColor || "#000000"} onChange={v => set("cornersSquareColor", v)} />
            <InlineColorPicker label="Corner dot color" value={design.cornersDotColor || "#000000"} onChange={v => set("cornersDotColor", v)} />
          </div>
        </div>
      </AccordionSection>

      {/* Frame */}
      <AccordionSection
        icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>}
        title="Frame" subtitle="Add a frame with text around your QR code.">
        <div className="space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Frame template</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {FRAME_META.map(f => (
                <button key={f.id} onClick={() => setDesign({ ...design, frameId: f.id, frameStyle: f.id === 0 ? "none" : String(f.id) })}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    design.frameId === f.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  <FrameSVG id={f.id} />
                  <span className="text-[9px] font-medium leading-tight text-center">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
          {(design.frameId || 0) > 0 && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1.5 block">Frame text (max 30 chars)</label>
                <input type="text" maxLength={30} value={design.frameText || "Scan me!"} onChange={e => set("frameText", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Font size: {design.frameFontSize || 42}</label>
                <input type="range" min="30" max="98" step="1" value={design.frameFontSize || 42}
                  onChange={e => set("frameFontSize", parseInt(e.target.value))}
                  className="w-full accent-violet-500" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InlineColorPicker label="Frame color" value={design.frameColor || "#7C3AED"} onChange={v => set("frameColor", v)} />
                <InlineColorPicker label="Text color" value={design.frameTextColor || "#FFFFFF"} onChange={v => set("frameTextColor", v)} />
              </div>
              <InlineColorPicker label="Frame background" value={design.frameBackgroundColor || "#7C3AED"} onChange={v => set("frameBackgroundColor", v)} />
            </>
          )}
        </div>
      </AccordionSection>

      {/* Logo */}
      <AccordionSection
        icon={<PhotoSolidIcon className="h-5 w-5 text-gray-500" />}
        title="Add Logo" subtitle="Add a central logo to your QR code.">
        <div className="space-y-4">
          {/* Preset Logos */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-3 block">Select a logo</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_LOGOS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => set("logo", preset.url)}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                    design.logo === preset.url
                      ? "border-violet-500 bg-violet-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  title={preset.label}
                >
                  {preset.url ? (
                    <img src={preset.url} alt={preset.label} className="w-7 h-7 object-contain" />
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4" y1="4" x2="20" y2="20" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Or upload your own</label>
            <label className={`flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              uploading ? "border-violet-400 bg-violet-50" : "border-gray-300 hover:border-violet-400 hover:bg-gray-50"
            }`}>
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-violet-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm text-violet-600">Uploading...</span>
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload logo (PNG, JPG - max 2MB)</span>
                </>
              )}
              <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>

          {/* Show selected logo */}
          {design.logo && (
            <div className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-200 rounded-lg">
              <img src={design.logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="flex-1">
                <p className="text-sm font-medium text-violet-700">Logo selected</p>
                <p className="text-xs text-violet-600">Will appear in the center of the QR code</p>
              </div>
              <button
                onClick={() => set("logo", "")}
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Error Correction */}
      <AccordionSection
        icon={<svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
        title="Error Correction" subtitle="Higher levels allow more damage but reduce data capacity.">
        <div className="flex gap-2">
          {ERROR_CORRECTION.map(ec => (
            <button key={ec.id} onClick={() => set("errorCorrectionLevel", ec.id)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                design.errorCorrectionLevel === ec.id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}>
              {ec.id} - {ec.label}
            </button>
          ))}
        </div>
      </AccordionSection>
    </div>
  );
}
