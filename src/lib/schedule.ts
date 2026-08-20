/**
 * Fallback grafik — rendered only when the database has no groups.
 * Mirrors prisma/seed.ts. The grid geometry (days, hours, row height) lives in
 * `@/lib/schedule-grid`, not here.
 */

export type Slot = {
  group: string;
  day: number; // 0=Pon, 1=Wt, 2=Śr, 3=Czw, 4=Pt, 5=Niedz
  startTime: string; // "HH:MM" — 15-min granularity
  track: 1 | 2; // pool lane
};

export const SCHEDULE: Slot[] = [
  // Krewetki (30 min)
  { group: "Krewetki", day: 2, startTime: "17:15", track: 2 },
  { group: "Krewetki", day: 3, startTime: "17:15", track: 2 },
  { group: "Krewetki", day: 5, startTime: "15:30", track: 2 },

  // Neonki (30 min)
  { group: "Neonki", day: 0, startTime: "16:00", track: 2 },
  { group: "Neonki", day: 1, startTime: "16:15", track: 1 },
  { group: "Neonki", day: 2, startTime: "16:45", track: 2 },
  { group: "Neonki", day: 4, startTime: "16:30", track: 2 },
  { group: "Neonki", day: 5, startTime: "16:00", track: 2 },

  // Koniki Morskie (45 min)
  { group: "Koniki Morskie", day: 0, startTime: "16:00", track: 1 },
  { group: "Koniki Morskie", day: 1, startTime: "16:15", track: 2 },
  { group: "Koniki Morskie", day: 2, startTime: "16:00", track: 1 },
  { group: "Koniki Morskie", day: 3, startTime: "17:45", track: 2 },
  { group: "Koniki Morskie", day: 4, startTime: "16:30", track: 1 },
  { group: "Koniki Morskie", day: 5, startTime: "15:30", track: 1 },

  // Płotki (45 min)
  { group: "Płotki", day: 0, startTime: "16:45", track: 1 },
  { group: "Płotki", day: 1, startTime: "17:00", track: 2 },
  { group: "Płotki", day: 2, startTime: "17:45", track: 2 },
  { group: "Płotki", day: 3, startTime: "16:00", track: 1 },
  { group: "Płotki", day: 5, startTime: "16:15", track: 1 },

  // Okonki (45 min)
  { group: "Okonki", day: 0, startTime: "16:45", track: 2 },
  { group: "Okonki", day: 1, startTime: "16:45", track: 1 },
  { group: "Okonki", day: 2, startTime: "16:45", track: 1 },
  { group: "Okonki", day: 3, startTime: "16:45", track: 1 },
  { group: "Okonki", day: 4, startTime: "17:00", track: 2 },
  { group: "Okonki", day: 5, startTime: "16:30", track: 2 },

  // Delfiny (45 min)
  { group: "Delfiny", day: 0, startTime: "17:30", track: 1 },
  { group: "Delfiny", day: 1, startTime: "17:45", track: 2 },
  { group: "Delfiny", day: 2, startTime: "17:30", track: 1 },
  { group: "Delfiny", day: 3, startTime: "18:30", track: 2 },
  { group: "Delfiny", day: 4, startTime: "17:15", track: 1 },
  { group: "Delfiny", day: 5, startTime: "17:00", track: 1 },

  // Barrakudy (45 min)
  { group: "Barrakudy", day: 0, startTime: "17:30", track: 2 },
  { group: "Barrakudy", day: 1, startTime: "17:30", track: 1 },
  { group: "Barrakudy", day: 2, startTime: "18:30", track: 2 },
  { group: "Barrakudy", day: 3, startTime: "17:30", track: 1 },
  { group: "Barrakudy", day: 4, startTime: "17:45", track: 2 },
  { group: "Barrakudy", day: 5, startTime: "17:15", track: 2 },

  // Rekiny (45 min)
  { group: "Rekiny", day: 0, startTime: "18:15", track: 1 },
  { group: "Rekiny", day: 1, startTime: "18:30", track: 2 },
  { group: "Rekiny", day: 2, startTime: "18:15", track: 1 },
  { group: "Rekiny", day: 3, startTime: "18:15", track: 1 },
  { group: "Rekiny", day: 4, startTime: "18:00", track: 1 },
  { group: "Rekiny", day: 5, startTime: "17:45", track: 1 },
];

/** Cena za jedne zajęcia, zależnie od liczby treningów w tygodniu. */
export const PRICES: Record<string, Partial<Record<1 | 2 | 3, number>>> = {
  Krewetki: { 1: 200, 2: 175, 3: 155 },
  Neonki: { 1: 200, 2: 175, 3: 155 },
  "Koniki Morskie": { 1: 220, 2: 190, 3: 170 },
  Płotki: { 1: 220, 2: 190, 3: 170 },
  Okonki: { 1: 230, 2: 200, 3: 180 },
  Delfiny: { 1: 230, 2: 200, 3: 180 },
  Barrakudy: { 1: 240, 2: 210, 3: 185 },
  Rekiny: { 1: 260, 2: 225, 3: 200 },
};

/** Matches the colorPreset of each group in prisma/seed.ts. */
export const GROUP_COLORS: Record<
  string,
  { bg: string; text: string; ring: string }
> = {
  Krewetki: { bg: "bg-pool-100", text: "text-deep-600", ring: "ring-pool-300" },
  Neonki: { bg: "bg-teal-100", text: "text-teal-700", ring: "ring-teal-300" },
  "Koniki Morskie": {
    bg: "bg-deep-100",
    text: "text-deep-700",
    ring: "ring-deep-300",
  },
  Płotki: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
  },
  Okonki: { bg: "bg-amber-100", text: "text-amber-700", ring: "ring-amber-300" },
  Delfiny: {
    bg: "bg-coral-100",
    text: "text-coral-600",
    ring: "ring-coral-300",
  },
  Barrakudy: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    ring: "ring-violet-300",
  },
  Rekiny: { bg: "bg-deep-800", text: "text-white", ring: "ring-deep-500" },
};
