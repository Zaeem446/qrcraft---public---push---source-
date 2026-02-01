"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface DynamicListFieldProps {
  label: string;
  fields: FieldDef[];
  value: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
}

export default function DynamicListField({ label, fields, value, onChange }: DynamicListFieldProps) {
  const items = Array.isArray(value) ? value : [];

  const addRow = () => {
    const empty: Record<string, string> = {};
    for (const f of fields) empty[f.key] = "";
    onChange([...items, empty]);
  };

  const removeRow = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, key: string, val: string) => {
    const updated = items.map((item, i) => (i === idx ? { ...item, [key]: val } : item));
    onChange(updated);
  };

  return (
    <div>
      <label className="text-xs font-medium text-gray-600 mb-2 block">{label}</label>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
              {fields.map((f) =>
                f.type === "select" ? (
                  <select
                    key={f.key}
                    value={item[f.key] || ""}
                    onChange={(e) => updateRow(idx, f.key, e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-700 bg-white"
                  >
                    <option value="">Select {f.label}</option>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    key={f.key}
                    type="text"
                    placeholder={f.placeholder || f.label}
                    value={item[f.key] || ""}
                    onChange={(e) => updateRow(idx, f.key, e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 placeholder-gray-400"
                  />
                )
              )}
            </div>
            <button onClick={() => removeRow(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-0.5">
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addRow} className="mt-2 flex items-center gap-1.5 text-xs text-violet-600 font-medium hover:text-violet-700">
        <PlusIcon className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}
