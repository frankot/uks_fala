export type Slot = {
  group: string;
  day: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sun
  hour: string; // "HH:MM"
};

export const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Niedziela"];

export const TIME_SLOTS = [
  "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

// Placeholder schedule — edit times/days freely
export const SCHEDULE: Slot[] = [
  // Krewetki (01) — Mon, Wed 16:00
  { group: "Krewetki", day: 0, hour: "16:00" },
  { group: "Krewetki", day: 2, hour: "16:00" },

  // Neonki (02) — Tue, Thu 16:00
  { group: "Neonki", day: 1, hour: "16:00" },
  { group: "Neonki", day: 3, hour: "16:00" },

  // Koniki Morskie (03) — Mon, Wed 16:30, Sun 15:30
  { group: "Koniki Morskie", day: 0, hour: "16:30" },
  { group: "Koniki Morskie", day: 2, hour: "16:30" },
  { group: "Koniki Morskie", day: 5, hour: "15:30" },

  // Płotki (04) — Tue, Thu 16:30, Sun 16:00
  { group: "Płotki", day: 1, hour: "16:30" },
  { group: "Płotki", day: 3, hour: "16:30" },
  { group: "Płotki", day: 5, hour: "16:00" },

  // Okonki (05) — Mon, Wed 17:00, Fri 16:30
  { group: "Okonki", day: 0, hour: "17:00" },
  { group: "Okonki", day: 2, hour: "17:00" },
  { group: "Okonki", day: 4, hour: "16:30" },

  // Delfiny (06) — Tue, Thu 17:00, Fri 17:00
  { group: "Delfiny", day: 1, hour: "17:00" },
  { group: "Delfiny", day: 3, hour: "17:00" },
  { group: "Delfiny", day: 4, hour: "17:00" },

  // Barrakudy (07) — Mon, Wed 17:30, Fri 17:30, Sun 16:30
  { group: "Barrakudy", day: 0, hour: "17:30" },
  { group: "Barrakudy", day: 2, hour: "17:30" },
  { group: "Barrakudy", day: 4, hour: "17:30" },
  { group: "Barrakudy", day: 5, hour: "16:30" },

  // Rekiny (08) — Mon–Fri 18:00, Sun 18:00
  { group: "Rekiny", day: 0, hour: "18:00" },
  { group: "Rekiny", day: 1, hour: "18:00" },
  { group: "Rekiny", day: 2, hour: "18:00" },
  { group: "Rekiny", day: 3, hour: "18:00" },
  { group: "Rekiny", day: 4, hour: "18:00" },
  { group: "Rekiny", day: 5, hour: "18:00" },
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

// Group color accents (matching TrainingGroups.tsx badge colors)
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
