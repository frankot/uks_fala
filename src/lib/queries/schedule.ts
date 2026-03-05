import { prisma } from "@/lib/prisma";
import { getGroupColors } from "@/lib/color-presets";
import {
  SCHEDULE as FALLBACK_SCHEDULE,
  PRICES as FALLBACK_PRICES,
  GROUP_COLORS as FALLBACK_COLORS,
} from "@/lib/schedule";

export type ScheduleData = {
  groups: Array<{
    num: string;
    name: string;
    age: string;
  }>;
  schedule: Array<{ group: string; day: number; hour: string }>;
  prices: Record<string, Partial<Record<1 | 2 | 3, number>>>;
  groupColors: Record<string, { bg: string; text: string; ring: string }>;
};

const FALLBACK_GROUPS = [
  { num: "01", name: "Krewetki",       age: "3–5 lat" },
  { num: "02", name: "Neonki",         age: "4–6 lat" },
  { num: "03", name: "Koniki Morskie", age: "5–7 lat" },
  { num: "04", name: "Płotki",         age: "6–8 lat" },
  { num: "05", name: "Okonki",         age: "7–9 lat" },
  { num: "06", name: "Delfiny",        age: "8–10 lat" },
  { num: "07", name: "Barrakudy",      age: "9–12 lat" },
  { num: "08", name: "Rekiny",         age: "11–15 lat" },
];

function getFallbackData(): ScheduleData {
  return {
    groups: FALLBACK_GROUPS,
    schedule: FALLBACK_SCHEDULE,
    prices: FALLBACK_PRICES,
    groupColors: FALLBACK_COLORS,
  };
}

export async function getScheduleData(): Promise<ScheduleData> {
  try {
    const dbGroups = await prisma.group.findMany({
      where: { active: true },
      include: { slots: true, prices: true },
      orderBy: { sortOrder: "asc" },
    });

    if (dbGroups.length === 0) {
      return getFallbackData();
    }

    const groups = dbGroups.map((g) => ({
      num: g.number,
      name: g.name,
      age: g.ageRange,
    }));

    const schedule = dbGroups.flatMap((g) =>
      g.slots.map((s) => ({ group: g.name, day: s.day, hour: s.hour }))
    );

    const prices: Record<string, Partial<Record<1 | 2 | 3, number>>> = {};
    for (const g of dbGroups) {
      prices[g.name] = {};
      for (const p of g.prices) {
        prices[g.name][p.frequency as 1 | 2 | 3] = p.price;
      }
    }

    const groupColors: Record<string, { bg: string; text: string; ring: string }> = {};
    for (const g of dbGroups) {
      groupColors[g.name] = getGroupColors(g.colorPreset);
    }

    return { groups, schedule, prices, groupColors };
  } catch (error) {
    console.error("Failed to fetch schedule from DB, using fallback:", error);
    return getFallbackData();
  }
}
