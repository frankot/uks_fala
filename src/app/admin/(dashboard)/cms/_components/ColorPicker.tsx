"use client";

import { COLOR_PRESETS, COLOR_PRESET_KEYS, type ColorPresetKey } from "@/lib/color-presets";

interface Props {
  value: string;
  onChange: (key: ColorPresetKey) => void;
}

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
        Kolor grupy
      </p>
      <div className="flex gap-3">
        {COLOR_PRESET_KEYS.map((key) => {
          const preset = COLOR_PRESETS[key];
          const isSelected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-2.5 transition-all ${
                isSelected
                  ? "border-deep-400 bg-deep-50 shadow-sm"
                  : "border-sand-200 bg-white hover:border-sand-300"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${preset.bg} ${preset.text}`}
              >
                Aa
              </span>
              <span className="text-[11px] font-medium text-sand-600">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
