"use client";

import { useState } from "react";
import {
  QrCodeIcon, ChevronDownIcon, ArrowPathIcon,
  PhotoIcon as PhotoSolidIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

// ─── SVG Pattern Thumbnails ──────────────────────────────────────────────────

function PatternSVG({ style }: { style: string }) {
  const s = 48;
  const cells = 5;
  const cs = s / cells;

  const renderCell = (x: number, y: number, key: number) => {
    // Skip some cells for visual variety
    if ((x + y) % 3 === 2) return null;
    const cx = x * cs + cs / 2;
    const cy = y * cs + cs / 2;
    const r = cs * 0.35;

    switch (style) {
      case "square":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} fill="currentColor" />;
      case "rounded":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={cs * 0.3} fill="currentColor" />;
      case "dots":
        return <circle key={key} cx={cx} cy={cy} r={r} fill="currentColor" />;
      case "classy":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={1} fill="currentColor" />;
      case "classy-rounded":
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} rx={cs * 0.4} ry={1} fill="currentColor" />;
      case "extra-rounded":
        return <circle key={key} cx={cx} cy={cy} r={r * 1.1} fill="currentColor" />;
      default:
        return <rect key={key} x={x * cs + 1} y={y * cs + 1} width={cs - 2} height={cs - 2} fill="currentColor" />;
    }
  };

  const elements: React.ReactNode[] = [];
  let k = 0;
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const el = renderCell(x, y, k++);
      if (el) elements.push(el);
    }
  }

  return (
    <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
      {elements}
    </svg>
  );
}

function CornerSquareSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "square":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="0" stroke="currentColor" strokeWidth="6" fill="none" />
          <rect x="16" y="16" width="16" height="16" fill="currentColor" />
        </svg>
      );
    case "dot":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
          <circle cx="24" cy="24" r="8" fill="currentColor" />
        </svg>
      );
    case "extra-rounded":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="12" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="4" fill="currentColor" />
        </svg>
      );
    default: // "default"
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="5" fill="none" />
          <rect x="16" y="16" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      );
  }
}

function CornerDotSVG({ style }: { style: string }) {
  const s = 48;
  switch (style) {
    case "dot":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <circle cx="24" cy="24" r="12" fill="currentColor" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" fill="currentColor" />
        </svg>
      );
    default: // "default"
      return (
        <svg viewBox={`0 0 ${s} ${s}`} className="w-12 h-12 text-gray-700">
          <rect x="12" y="12" width="24" height="24" rx="4" fill="currentColor" />
        </svg>
      );
  }
}

// ─── Inline Color Picker ────────────────────────────────────────────────────
function InlineColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 font-mono" />
      </div>
    </div>
  );
}

// ─── Accordion Section ──────────────────────────────────────────────────────
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

// ─── Design Options Constants ────────────────────────────────────────────────

const SHAPE_STYLES = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
  { id: "classy-rounded", label: "Classy Round" },
  { id: "extra-rounded", label: "Extra Round" },
];

const CORNER_SQUARE_STYLES = [
  { id: "default", label: "Default" },
  { id: "square", label: "Square" },
  { id: "dot", label: "Dot" },
  { id: "extra-rounded", label: "Rounded" },
];

const CORNER_DOT_STYLES = [
  { id: "default", label: "Default" },
  { id: "dot", label: "Dot" },
  { id: "square", label: "Square" },
];

const ERROR_CORRECTION = [
  { id: "L", label: "Low" },
  { id: "M", label: "Medium" },
  { id: "Q", label: "Quartile" },
  { id: "H", label: "High" },
];

// ─── Main DesignOptions Component ────────────────────────────────────────────

interface DesignOptionsProps {
  design: Record<string, any>;
  setDesign: (d: Record<string, any>) => void;
}

export default function DesignOptions({ design, setDesign }: DesignOptionsProps) {
  const set = (key: string, val: any) => setDesign({ ...design, [key]: val });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error("Logo must be under 1MB"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) set("logo", result);
    };
    reader.readAsDataURL(file);
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
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {SHAPE_STYLES.map(p => (
                <button key={p.id} onClick={() => set("dotsType", p.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.dotsType === p.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <PatternSVG style={p.id} />
                  <span className="text-[10px] font-medium text-gray-600">{p.label}</span>
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
            <div className="grid grid-cols-4 gap-2">
              {CORNER_SQUARE_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersSquareType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersSquareType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerSquareSVG style={c.id} />
                  <span className="text-[10px] font-medium text-gray-600">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">Corner dot style</label>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_DOT_STYLES.map(c => (
                <button key={c.id} onClick={() => set("cornersDotType", c.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    design.cornersDotType === c.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <CornerDotSVG style={c.id} />
                  <span className="text-[10px] font-medium text-gray-600">{c.label}</span>
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
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {Array.from({ length: 31 }, (_, i) => i).map(id => (
                <button key={id} onClick={() => setDesign({ ...design, frameId: id, frameStyle: id === 0 ? "none" : String(id) })}
                  className={`relative w-full aspect-square text-xs font-medium rounded-lg border-2 transition-all flex items-center justify-center ${
                    design.frameId === id ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}>
                  {id === 0 ? (
                    <span className="text-[10px]">None</span>
                  ) : (
                    <>
                      <div className="absolute inset-1 border border-gray-300 rounded-sm" />
                      <span className="text-[10px] font-bold relative z-10">{id}</span>
                    </>
                  )}
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
                <InlineColorPicker label="Frame color" value={design.frameColor || "#000000"} onChange={v => set("frameColor", v)} />
                <InlineColorPicker label="Text color" value={design.frameTextColor || "#FFFFFF"} onChange={v => set("frameTextColor", v)} />
              </div>
              <InlineColorPicker label="Frame background" value={design.frameBackgroundColor || "#000000"} onChange={v => set("frameBackgroundColor", v)} />
            </>
          )}
        </div>
      </AccordionSection>

      {/* Logo */}
      <AccordionSection
        icon={<PhotoSolidIcon className="h-5 w-5 text-gray-500" />}
        title="Add Logo" subtitle="Make your QR code unique by adding your logo.">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-3 block">Upload your logo (Maximum size: 1 MB)</label>
          <label className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors">
            <PhotoSolidIcon className="h-6 w-6 text-gray-400" />
            <span className="text-[9px] text-gray-400 mt-0.5">Upload</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
          {design.logo && (
            <div className="flex items-center gap-2 mt-3">
              <img src={design.logo} alt="Logo" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
              <p className="text-xs text-green-600">Logo uploaded</p>
              <button onClick={() => set("logo", "")} className="text-xs text-red-500 ml-auto hover:underline">Remove</button>
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
