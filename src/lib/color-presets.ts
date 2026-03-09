export const COLOR_PRESETS = {
  pool:     { bg: "bg-pool-100",    text: "text-deep-600",    ring: "ring-pool-300",    label: "Błękitny" },
  deep:     { bg: "bg-deep-100",    text: "text-deep-700",    ring: "ring-deep-300",    label: "Granatowy" },
  coral:    { bg: "bg-coral-100",   text: "text-coral-600",   ring: "ring-coral-300",   label: "Koralowy" },
  deepDark: { bg: "bg-deep-800",    text: "text-white",        ring: "ring-deep-500",    label: "Ciemny" },
  emerald:  { bg: "bg-emerald-100", text: "text-emerald-700", ring: "ring-emerald-300", label: "Zielony" },
  amber:    { bg: "bg-amber-100",   text: "text-amber-700",   ring: "ring-amber-300",   label: "Złoty" },
  violet:   { bg: "bg-violet-100",  text: "text-violet-700",  ring: "ring-violet-300",  label: "Fioletowy" },
  teal:     { bg: "bg-teal-100",    text: "text-teal-700",    ring: "ring-teal-300",    label: "Morski" },
  rose:     { bg: "bg-rose-100",    text: "text-rose-700",    ring: "ring-rose-300",    label: "Różowy" },
  slate:    { bg: "bg-slate-100",   text: "text-slate-700",   ring: "ring-slate-300",   label: "Szary" },
} as const;

export type ColorPresetKey = keyof typeof COLOR_PRESETS;

export const COLOR_PRESET_KEYS = Object.keys(COLOR_PRESETS) as ColorPresetKey[];

export function getGroupColors(preset: string): { bg: string; text: string; ring: string } {
  const p = COLOR_PRESETS[preset as ColorPresetKey];
  return p ? { bg: p.bg, text: p.text, ring: p.ring } : { bg: COLOR_PRESETS.pool.bg, text: COLOR_PRESETS.pool.text, ring: COLOR_PRESETS.pool.ring };
}
