"use client";

import ColorPresetPalette from "./ColorPresetPalette";
import TemplateSelector from "./TemplateSelector";
import FontPicker from "./FontPicker";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type PageDesignMode = "pdf" | "3color" | "2color" | "1color";

interface PageDesignSectionProps {
  content: Record<string, any>;
  setContent: (c: Record<string, any>) => void;
  mode: PageDesignMode;
}

function SectionAccordion({ title, subtitle, children, defaultOpen = false }: {
  title: string; subtitle: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h3.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.5A1.125 1.125 0 0112 7.875v1.5c0 .621.504 1.125 1.125 1.125h3.75" />
          </svg>
        </div>
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

function ColorPickerField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <input type="color" value={value} onChange={e => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
          <div className="w-full h-full" style={{ backgroundColor: value }} />
        </div>
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 font-mono" />
      </div>
    </div>
  );
}

export default function PageDesignSection({ content, setContent, mode }: PageDesignSectionProps) {
  const pd = content.pageDesign || {};
  const setPD = (updates: Record<string, any>) =>
    setContent({ ...content, pageDesign: { ...pd, ...updates } });

  const primary = pd.primary || "#7C3AED";
  const secondary = pd.secondary || "#FFFFFF";
  const tertiary = pd.tertiary || "#F3F4F6";

  return (
    <SectionAccordion title="Landing Page Design" subtitle="Customize the look and feel of your QR landing page.">
      <div className="space-y-4">
        {/* Template selector for PDF */}
        {mode === "pdf" && (
          <TemplateSelector
            value={content.template ?? 0}
            onChange={(v) => setContent({ ...content, template: v })}
            primaryColor={primary}
          />
        )}

        {/* Color presets */}
        <ColorPresetPalette
          value={{ primary, secondary }}
          onChange={(p, s) => setPD({ primary: p, secondary: s })}
        />

        {/* Color pickers */}
        {mode === "1color" ? (
          <ColorPickerField
            label="Accent Color"
            value={pd.color || pd.primary || "#7C3AED"}
            onChange={(v) => setPD({ color: v, primary: v })}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ColorPickerField label="Primary Color" value={primary} onChange={(v) => setPD({ primary: v })} />
            <ColorPickerField label="Secondary Color" value={secondary} onChange={(v) => setPD({ secondary: v })} />
          </div>
        )}

        {mode === "3color" && (
          <ColorPickerField label="Tertiary Color" value={tertiary} onChange={(v) => setPD({ tertiary: v })} />
        )}

        {/* Fonts section for PDF */}
        {mode === "pdf" && (
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-700">Fonts</p>
            <FontPicker
              label="Title Font"
              family={content.titleFont?.family || "Poppins"}
              color={content.titleFont?.color || "#000000"}
              onFamilyChange={(f) => setContent({ ...content, titleFont: { ...content.titleFont, family: f } })}
              onColorChange={(c) => setContent({ ...content, titleFont: { ...content.titleFont, color: c } })}
            />
            <FontPicker
              label="Text Font"
              family={content.textFont?.family || "Inter"}
              color={content.textFont?.color || "#374151"}
              onFamilyChange={(f) => setContent({ ...content, textFont: { ...content.textFont, family: f } })}
              onColorChange={(c) => setContent({ ...content, textFont: { ...content.textFont, color: c } })}
            />
          </div>
        )}

        {/* Header color for PDF */}
        {mode === "pdf" && (
          <div className="pt-2 border-t border-gray-100">
            <ColorPickerField
              label="Header Color"
              value={content.headerColor || primary}
              onChange={(v) => setContent({ ...content, headerColor: v })}
            />
          </div>
        )}
      </div>
    </SectionAccordion>
  );
}
