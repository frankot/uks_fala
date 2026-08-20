export const COLOR_PRESETS = {
  pool: {
    bg: "bg-pool-100",
    text: "text-deep-600",
    ring: "ring-pool-300",
    border: "border-pool-200",
    label: "Błękitny",
  },
  deep: {
    bg: "bg-deep-100",
    text: "text-deep-700",
    ring: "ring-deep-300",
    border: "border-deep-200",
    label: "Granatowy",
  },
  coral: {
    bg: "bg-coral-100",
    text: "text-coral-600",
    ring: "ring-coral-300",
    border: "border-coral-200",
    label: "Koralowy",
  },
  deepDark: {
    bg: "bg-deep-800",
    text: "text-white",
    ring: "ring-deep-500",
    border: "border-deep-700",
    label: "Ciemny",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    border: "border-emerald-200",
    label: "Zielony",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    ring: "ring-amber-300",
    border: "border-amber-200",
    label: "Złoty",
  },
  violet: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    ring: "ring-violet-300",
    border: "border-violet-200",
    label: "Fioletowy",
  },
  teal: {
    bg: "bg-teal-100",
    text: "text-teal-700",
    ring: "ring-teal-300",
    border: "border-teal-200",
    label: "Morski",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    ring: "ring-rose-300",
    border: "border-rose-200",
    label: "Różowy",
  },
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    ring: "ring-slate-300",
    border: "border-slate-200",
    label: "Szary",
  },
} as const;

export type ColorPresetKey = keyof typeof COLOR_PRESETS;

export const COLOR_PRESET_KEYS = Object.keys(COLOR_PRESETS) as ColorPresetKey[];

export function getGroupColors(preset: string): {
  bg: string;
  text: string;
  ring: string;
  border: string;
} {
  const p = COLOR_PRESETS[preset as ColorPresetKey] ?? COLOR_PRESETS.pool;
  return { bg: p.bg, text: p.text, ring: p.ring, border: p.border };
}
