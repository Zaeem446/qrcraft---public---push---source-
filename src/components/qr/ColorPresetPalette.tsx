"use client";

import { CheckIcon } from "@heroicons/react/24/outline";

const COLOR_PRESETS: { name: string; primary: string; secondary: string }[] = [
  { name: "Red", primary: "#DC2626", secondary: "#FEE2E2" },
  { name: "Teal", primary: "#0D9488", secondary: "#CCFBF1" },
  { name: "Green", primary: "#16A34A", secondary: "#DCFCE7" },
  { name: "Gold", primary: "#CA8A04", secondary: "#FEF9C3" },
  { name: "Pink", primary: "#EC4899", secondary: "#FCE7F3" },
  { name: "Purple", primary: "#9333EA", secondary: "#F3E8FF" },
  { name: "Blue", primary: "#2563EB", secondary: "#DBEAFE" },
  { name: "Orange", primary: "#EA580C", secondary: "#FED7AA" },
  { name: "Dark", primary: "#1F2937", secondary: "#F3F4F6" },
  { name: "Red Dark", primary: "#991B1B", secondary: "#1F2937" },
  { name: "Violet", primary: "#7C3AED", secondary: "#FFFFFF" },
  { name: "Black", primary: "#000000", secondary: "#FFFFFF" },
];

interface ColorPresetPaletteProps {
  value: { primary?: string; secondary?: string };
  onChange: (primary: string, secondary: string) => void;
}

export default function ColorPresetPalette({ value, onChange }: ColorPresetPaletteProps) {
  const isActive = (preset: typeof COLOR_PRESETS[number]) =>
    value.primary?.toLowerCase() === preset.primary.toLowerCase() &&
    value.secondary?.toLowerCase() === preset.secondary.toLowerCase();

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">Color Presets</label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            title={preset.name}
            onClick={() => onChange(preset.primary, preset.secondary)}
            className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
              isActive(preset) ? "border-violet-500 ring-2 ring-violet-200" : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-1/2" style={{ backgroundColor: preset.primary }} />
              <div className="absolute bottom-0 left-0 w-full h-1/2" style={{ backgroundColor: preset.secondary }} />
            </div>
            {isActive(preset) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <CheckIcon className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
