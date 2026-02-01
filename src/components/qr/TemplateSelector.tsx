"use client";

const TEMPLATES = [
  { id: 0, name: "Default", layout: { header: true, body: true, button: true, split: false } },
  { id: 1, name: "Template 1", layout: { header: true, body: true, button: true, split: true } },
  { id: 2, name: "Template 2", layout: { header: false, body: true, button: true, split: false } },
  { id: 3, name: "Template 3", layout: { header: true, body: false, button: true, split: true } },
  { id: 4, name: "Template 4", layout: { header: true, body: true, button: false, split: false } },
];

interface TemplateSelectorProps {
  value: number;
  onChange: (template: number) => void;
  primaryColor?: string;
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
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
              value === tpl.id
                ? "border-violet-500 bg-violet-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            {/* Mini layout diagram */}
            <div className="w-full aspect-[3/4] rounded-md overflow-hidden border border-gray-100 bg-gray-50 flex flex-col gap-0.5 p-1">
              {tpl.layout.header && (
                <div className="h-2 rounded-sm" style={{ backgroundColor: primaryColor }} />
              )}
              {tpl.layout.split ? (
                <div className="flex-1 flex gap-0.5">
                  <div className="flex-1 rounded-sm bg-gray-200" />
                  <div className="flex-1 rounded-sm bg-gray-200" />
                </div>
              ) : (
                tpl.layout.body && <div className="flex-1 rounded-sm bg-gray-200" />
              )}
              {tpl.layout.button && (
                <div className="h-1.5 w-2/3 mx-auto rounded-sm" style={{ backgroundColor: primaryColor, opacity: 0.7 }} />
              )}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">{tpl.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
