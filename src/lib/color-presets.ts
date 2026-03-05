export const COLOR_PRESETS = {
  pool:     { bg: "bg-pool-100",  text: "text-deep-600",  ring: "ring-pool-300",  label: "Błękitny" },
  deep:     { bg: "bg-deep-100",  text: "text-deep-700",  ring: "ring-deep-300",  label: "Granatowy" },
  coral:    { bg: "bg-coral-100", text: "text-coral-600", ring: "ring-coral-300", label: "Koralowy" },
  deepDark: { bg: "bg-deep-800",  text: "text-white",     ring: "ring-deep-500",  label: "Ciemny" },
} as const;

export type ColorPresetKey = keyof typeof COLOR_PRESETS;

export const COLOR_PRESET_KEYS = Object.keys(COLOR_PRESETS) as ColorPresetKey[];

export function getGroupColors(preset: string): { bg: string; text: string; ring: string } {
  const p = COLOR_PRESETS[preset as ColorPresetKey];
  return p ? { bg: p.bg, text: p.text, ring: p.ring } : { bg: COLOR_PRESETS.pool.bg, text: COLOR_PRESETS.pool.text, ring: COLOR_PRESETS.pool.ring };
}
