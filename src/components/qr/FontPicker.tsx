"use client";

const FONT_FAMILIES = [
  "Lato",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Poppins",
  "Inter",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Helvetica",
];

interface FontPickerProps {
  label: string;
  family: string;
  color: string;
  onFamilyChange: (family: string) => void;
  onColorChange: (color: string) => void;
}

export default function FontPicker({ label, family, color, onFamilyChange, onColorChange }: FontPickerProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
      <div className="flex items-center gap-2">
        <select
          value={family}
          onChange={(e) => onFamilyChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <div className="flex items-center gap-1.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
            />
            <div className="w-full h-full" style={{ backgroundColor: color }} />
          </div>
          <input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-20 px-2 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 font-mono"
          />
        </div>
      </div>
    </div>
  );
}
