"use client";

const TEMPLATES = [
  { id: 0, name: "Classic", desc: "Header, content, button" },
  { id: 1, name: "Grid", desc: "Header, two columns, button" },
  { id: 2, name: "Minimal", desc: "No header, content, button" },
  { id: 3, name: "Compact", desc: "Header, two columns" },
  { id: 4, name: "Clean", desc: "Header and content only" },
];

interface TemplateSelectorProps {
  value: number;
  onChange: (template: number) => void;
  primaryColor?: string;
}

function MiniDiagram({ id, color }: { id: number; color: string }) {
  const bg = color;
  const muted = color + "44";

  // Each template gets a unique, clearly distinguishable mini diagram
  switch (id) {
    case 0: // Classic: header block + 3 body lines + button
      return (
        <div className="w-full h-full flex flex-col gap-[3px] p-1.5">
          <div className="h-[10px] rounded-sm" style={{ backgroundColor: bg }} />
          <div className="flex-1 flex flex-col justify-center gap-[2px]">
            <div className="h-[3px] rounded-full bg-gray-300 w-full" />
            <div className="h-[3px] rounded-full bg-gray-200 w-4/5" />
            <div className="h-[3px] rounded-full bg-gray-200 w-3/5" />
          </div>
          <div className="h-[7px] rounded-sm mx-1" style={{ backgroundColor: bg }} />
        </div>
      );
    case 1: // Grid: header + two columns + button
      return (
        <div className="w-full h-full flex flex-col gap-[3px] p-1.5">
          <div className="h-[10px] rounded-sm" style={{ backgroundColor: bg }} />
          <div className="flex-1 flex gap-[3px]">
            <div className="flex-1 rounded-sm" style={{ backgroundColor: muted }} />
            <div className="flex-1 rounded-sm" style={{ backgroundColor: muted }} />
          </div>
          <div className="h-[7px] rounded-sm mx-1" style={{ backgroundColor: bg }} />
        </div>
      );
    case 2: // Minimal: inline title (no header) + body + button
      return (
        <div className="w-full h-full flex flex-col gap-[3px] p-1.5">
          <div className="flex items-center gap-[3px] mt-0.5">
            <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: bg }} />
            <div className="h-[3px] rounded-full bg-gray-300 flex-1" />
          </div>
          <div className="flex-1 flex flex-col justify-center gap-[2px]">
            <div className="h-[3px] rounded-full bg-gray-200 w-full" />
            <div className="h-[3px] rounded-full bg-gray-200 w-4/5" />
            <div className="h-[3px] rounded-full bg-gray-200 w-full" />
          </div>
          <div className="h-[7px] rounded-sm mx-1" style={{ backgroundColor: bg }} />
        </div>
      );
    case 3: // Compact: header + two columns, no button
      return (
        <div className="w-full h-full flex flex-col gap-[3px] p-1.5">
          <div className="h-[10px] rounded-sm" style={{ backgroundColor: bg }} />
          <div className="flex-1 flex gap-[3px]">
            <div className="flex-1 rounded-sm" style={{ backgroundColor: muted }} />
            <div className="flex-1 rounded-sm" style={{ backgroundColor: muted }} />
          </div>
          <div className="h-[3px] rounded-full bg-gray-200 w-3/5 mx-auto" />
        </div>
      );
    case 4: // Clean: header + body, no button
      return (
        <div className="w-full h-full flex flex-col gap-[3px] p-1.5">
          <div className="h-[10px] rounded-sm" style={{ backgroundColor: bg }} />
          <div className="flex-1 flex flex-col justify-center gap-[2px]">
            <div className="h-[3px] rounded-full bg-gray-300 w-full" />
            <div className="h-[3px] rounded-full bg-gray-200 w-5/6" />
            <div className="h-[3px] rounded-full bg-gray-200 w-4/5" />
            <div className="h-[3px] rounded-full bg-gray-200 w-full" />
            <div className="h-[3px] rounded-full bg-gray-200 w-2/3" />
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function TemplateSelector({ value, onChange, primaryColor = "#7C3AED" }: TemplateSelectorProps) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">Template</label>
      <div className="grid grid-cols-5 gap-2">
        {TEMPLATES.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onChange(tpl.id)}
            title={tpl.desc}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 transition-all ${
              value === tpl.id
                ? "border-violet-500 bg-violet-50 shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="w-full aspect-[3/4] rounded-md overflow-hidden border border-gray-100 bg-gray-50">
              <MiniDiagram id={tpl.id} color={primaryColor} />
            </div>
            <span className={`text-[9px] font-medium ${value === tpl.id ? "text-violet-700" : "text-gray-500"}`}>{tpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
