export type Slot = {
  group: string;
  day: number;       // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sun
  startTime: string; // "HH:MM" — 15‑min granularity
  track: 1 | 2;      // pool route
};

export const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Niedziela"];

export const TIME_SLOTS = [
  "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
  "19:00", "19:15", "19:30",
];

/** Group name → lesson duration in minutes */
export const GROUP_DURATIONS: Record<string, number> = {
  "Krewetki":       30,
  "Neonki":         30,
  "Koniki Morskie": 45,
  "Płotki":         45,
  "Okonki":         45,
  "Delfiny":        45,
  "Barrakudy":      45,
  "Rekiny":         60,
};

export function getGroupDurationMinutes(groupName: string): number {
  return GROUP_DURATIONS[groupName] ?? 45;
}

// Placeholder schedule — two tracks, non‑overlapping within each track
export const SCHEDULE: Slot[] = [
  // ═══ Krewetki (30 min) — Tor 1, Mon+Wed 16:00 ═══
  { group: "Krewetki", day: 0, startTime: "16:00", track: 1 },
  { group: "Krewetki", day: 2, startTime: "16:00", track: 1 },

  // ═══ Neonki (30 min) — Tor 2, Mon+Wed 16:00 (same time, diff track → OK) ═══
  { group: "Neonki", day: 0, startTime: "16:00", track: 2 },
  { group: "Neonki", day: 2, startTime: "16:00", track: 2 },

  // ═══ Koniki Morskie (45 min) — Tor 1, Mon+Wed 16:30, Sun 15:30 ═══
  { group: "Koniki Morskie", day: 0, startTime: "16:30", track: 1 },
  { group: "Koniki Morskie", day: 2, startTime: "16:30", track: 1 },
  { group: "Koniki Morskie", day: 5, startTime: "15:30", track: 1 },

  // ═══ Płotki (45 min) — Tor 2, Mon+Wed 16:30, Sun 16:00 ═══
  { group: "Płotki", day: 0, startTime: "16:30", track: 2 },
  { group: "Płotki", day: 2, startTime: "16:30", track: 2 },
  { group: "Płotki", day: 5, startTime: "16:00", track: 2 },

  // ═══ Okonki (45 min) — Tor 1, Mon+Wed 17:15, Fri 16:30 ═══
  // (starts after Koniki Morskie ends at 17:15 on Tor 1)
  { group: "Okonki", day: 0, startTime: "17:15", track: 1 },
  { group: "Okonki", day: 2, startTime: "17:15", track: 1 },
  { group: "Okonki", day: 4, startTime: "16:30", track: 1 },

  // ═══ Delfiny (45 min) — Tor 1, Mon+Wed 18:00, Fri 17:15 ═══
  { group: "Delfiny", day: 0, startTime: "18:00", track: 1 },
  { group: "Delfiny", day: 2, startTime: "18:00", track: 1 },
  { group: "Delfiny", day: 4, startTime: "17:15", track: 1 },

  // ═══ Barrakudy (45 min) — Tor 2, Tue+Thu 16:30, Fri 17:15, Sun 16:45 ═══
  { group: "Barrakudy", day: 1, startTime: "16:30", track: 2 },
  { group: "Barrakudy", day: 3, startTime: "16:30", track: 2 },
  { group: "Barrakudy", day: 4, startTime: "17:15", track: 2 },
  { group: "Barrakudy", day: 5, startTime: "16:45", track: 2 },

  // ═══ Rekiny (60 min) — Tor 1, Tue+Thu 17:15, Fri 18:00, Sun 17:30 ═══
  { group: "Rekiny", day: 1, startTime: "17:15", track: 1 },
  { group: "Rekiny", day: 3, startTime: "17:15", track: 1 },
  { group: "Rekiny", day: 4, startTime: "18:00", track: 1 },
  { group: "Rekiny", day: 5, startTime: "17:30", track: 1 },

  // ═══ Delfiny (Tor 2) — Tue+Thu 18:00 ═══
  { group: "Delfiny", day: 1, startTime: "18:00", track: 2 },
  { group: "Delfiny", day: 3, startTime: "18:00", track: 2 },
];

// Prices in PLN per month. Only list valid frequencies per group.
export const PRICES: Record<string, Partial<Record<1 | 2 | 3, number>>> = {
  "Krewetki":       { 1: 173, 2: 290 },
  "Neonki":         { 1: 173, 2: 290 },
  "Koniki Morskie": { 1: 220, 2: 310 },
  "Płotki":         { 1: 220, 2: 310 },
  "Okonki":         { 2: 310, 3: 360 },
  "Delfiny":        { 2: 310, 3: 360 },
  "Barrakudy":      { 2: 350, 3: 408 },
  "Rekiny":         { 3: 408 },
};

// Group color accents
export const GROUP_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "Krewetki":       { bg: "bg-pool-100",   text: "text-deep-600",  ring: "ring-pool-300" },
  "Neonki":         { bg: "bg-pool-100",   text: "text-deep-600",  ring: "ring-pool-300" },
  "Koniki Morskie": { bg: "bg-deep-100",   text: "text-deep-700",  ring: "ring-deep-300" },
  "Płotki":         { bg: "bg-deep-100",   text: "text-deep-700",  ring: "ring-deep-300" },
  "Okonki":         { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Delfiny":        { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Barrakudy":      { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Rekiny":         { bg: "bg-deep-800",   text: "text-white",     ring: "ring-deep-500" },
};
