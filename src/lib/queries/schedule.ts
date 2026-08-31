import { prisma } from "@/lib/prisma";
import { getGroupColors } from "@/lib/color-presets";

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

/**
 * Empty schedule. The grafik used to fall back to a hardcoded demo timetable,
 * which published invented lesson times on a real domain whenever the database
 * was empty. `/grafik` renders an explicit "not published yet" state instead.
 */
function emptyScheduleData(): ScheduleData {
  return {
    groups: [],
    schedule: [],
    prices: {},
    groupColors: {},
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
      return emptyScheduleData();
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
    console.error("Failed to fetch schedule from DB:", error);
    return emptyScheduleData();
  }
}

/**
 * Group names a reservation may legitimately reference.
 *
 * Validating against a hardcoded list would reject every group the club creates
 * in the Grafik tab, so this reads the same live rows the public picker is built
 * from. An empty result rejects every reservation, which is correct: with no
 * groups published there is nothing to reserve.
 */
export async function getValidGroupNames(): Promise<string[]> {
  try {
    const rows = await prisma.group.findMany({
      where: { active: true },
      select: { name: true },
    });
    return rows.map((g) => g.name);
  } catch (error) {
    console.error("Failed to fetch group names:", error);
    return [];
  }
}
