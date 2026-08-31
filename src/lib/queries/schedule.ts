import { prisma } from "@/lib/prisma";
import { getGroupColors } from "@/lib/color-presets";
import {
  SCHEDULE as FALLBACK_SCHEDULE,
  PRICES as FALLBACK_PRICES,
  GROUP_COLORS as FALLBACK_COLORS,
} from "@/lib/schedule";

export type ScheduleSlot = {
  group: string;
  day: number;
  startTime: string;
  track: 1 | 2;
};

export type ScheduleData = {
  groups: Array<{
    num: string;
    name: string;
    age: string;
    duration: number; // minutes
    level?: string | null;
    description?: string | null;
  }>;
  schedule: ScheduleSlot[];
  prices: Record<string, Partial<Record<1 | 2 | 3, number>>>;
  groupColors: Record<string, { bg: string; text: string; ring: string }>;
  semesterDayCount: number[] | null;
  semesterLabel: string;
};

const FALLBACK_GROUPS = [
  { num: "01", name: "Krewetki",       age: "3–5 lat",   duration: 30, level: "Oswajanie z wodą", description: "Najmłodsza grupa — pierwsze chwile w wodzie. Oswajanie z basenem, zabawy i nauka podstawowych ruchów." },
  { num: "02", name: "Neonki",         age: "4–6 lat",   duration: 30, level: "Nauka podstaw", description: "Kontynuacja przygody z pływaniem. Samodzielne poruszanie się w wodzie, nurkowanie i pierwsze elementy kraula." },
  { num: "03", name: "Koniki Morskie", age: "5–7 lat",   duration: 45, level: "Pierwsze style", description: "Pierwsza grupa z 45-minutowymi zajęciami. Nauka techniki kraula na piersiach i na grzbiecie, skoki do wody." },
  { num: "04", name: "Płotki",         age: "6–8 lat",   duration: 45, level: "Technika pływania", description: "Rozwój techniki pływackiej i wytrzymałości. Doskonalenie stylu grzbietowego oraz nauka nawrotów." },
  { num: "05", name: "Okonki",         age: "7–9 lat",   duration: 45, level: "Doskonalenie stylów", description: "Kształtowanie prawidłowej techniki wszystkich stylów. Nauka stylu klasycznego i pierwsze elementy treningu sportowego." },
  { num: "06", name: "Delfiny",        age: "8–10 lat",  duration: 45, level: "Zaawansowana technika", description: "Zaawansowana technika czterech stylów, praca nad startami i nawrotami. Przygotowanie do pierwszych zawodów." },
  { num: "07", name: "Barrakudy",      age: "9–12 lat",  duration: 45, level: "Przygotowanie startowe", description: "Grupa dla ambitnych pływaków. Intensywny trening objętościowy, starty w zawodach i budowanie kondycji." },
  { num: "08", name: "Rekiny",         age: "11–15 lat", duration: 45, level: "Grupa wyczynowa", description: "Sekcja sportowa — 45-minutowe treningi, praca nad formą startową i regularne starty w zawodach okręgowych." },
];

function getFallbackData(): ScheduleData {
  return {
    groups: FALLBACK_GROUPS,
    schedule: FALLBACK_SCHEDULE,
    prices: FALLBACK_PRICES,
    groupColors: FALLBACK_COLORS,
    semesterDayCount: null,
    semesterLabel: "",
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
      duration: g.lessonDuration,
      level: g.level,
      description: g.description,
    }));

    const schedule = dbGroups.flatMap((g) =>
      g.slots.map((s) => ({ group: g.name, day: s.day, startTime: s.hour, track: s.track as 1 | 2 }))
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

    const semesterRow = await prisma.semesterDayCount.findUnique({
      where: { id: "default" },
    });
    const semesterDayCount: number[] | null = semesterRow
      ? [
          semesterRow.mon,
          semesterRow.tue,
          semesterRow.wed,
          semesterRow.thu,
          semesterRow.fri,
          semesterRow.sun,
        ]
      : null;
    const semesterLabel = semesterRow?.label ?? "";

    return { groups, schedule, prices, groupColors, semesterDayCount, semesterLabel };
  } catch (error) {
    console.error("Failed to fetch schedule from DB, using fallback:", error);
    return getFallbackData();
  }
}

/**
 * Group names a reservation may legitimately reference.
 *
 * Validating against the hardcoded PRICES keys instead would reject every group
 * the club creates in the Grafik tab, so this reads the same live rows the
 * public picker is built from and only falls back when the table is empty —
 * matching `getScheduleData` above.
 */
export async function getValidGroupNames(): Promise<string[]> {
  try {
    const rows = await prisma.group.findMany({
      where: { active: true },
      select: { name: true },
    });
    if (rows.length > 0) return rows.map((g) => g.name);
  } catch (error) {
    console.error("Failed to fetch group names, using fallback:", error);
  }
  return FALLBACK_GROUPS.map((g) => g.name);
}
