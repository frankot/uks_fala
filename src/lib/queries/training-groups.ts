import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getGroupColors } from "@/lib/color-presets";

export const TRAINING_GROUPS_TAG = "training-groups";
/** The home-page section is public marketing copy — an hour of staleness is fine. */
const REVALIDATE_SECONDS = 60 * 60;

export type TrainingGroupCard = {
  num: string;
  name: string;
  age: string;
  level: string | null;
  sessions: string | null;
  duration: string;
  accent: string;
  border: string;
};

/** "1× / tyg." or "1–3× / tyg.", from the frequencies the group has a price for. */
function formatSessions(frequencies: number[]): string | null {
  if (frequencies.length === 0) return null;
  const min = Math.min(...frequencies);
  const max = Math.max(...frequencies);
  return min === max ? `${min}× / tyg.` : `${min}–${max}× / tyg.`;
}

async function fetchTrainingGroups(): Promise<TrainingGroupCard[]> {
  const groups = await prisma.group.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    select: {
      number: true,
      name: true,
      ageRange: true,
      level: true,
      lessonDuration: true,
      colorPreset: true,
      prices: { select: { frequency: true } },
    },
  });

  return groups.map((g) => {
    const colors = getGroupColors(g.colorPreset);
    return {
      num: g.number,
      name: g.name,
      age: g.ageRange,
      level: g.level,
      sessions: formatSessions(g.prices.map((p) => p.frequency)),
      duration: `${g.lessonDuration} min`,
      accent: `${colors.bg} ${colors.text}`,
      border: colors.border,
    };
  });
}

/**
 * Cached for an hour so a page refresh does not hit the database; CMS group edits
 * call revalidateTag(TRAINING_GROUPS_TAG) to publish immediately.
 */
export const getTrainingGroups = unstable_cache(
  fetchTrainingGroups,
  ["training-groups"],
  { revalidate: REVALIDATE_SECONDS, tags: [TRAINING_GROUPS_TAG] },
);
