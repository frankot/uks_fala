import { prisma } from "@/lib/prisma";
import { slugifyStable } from "@/lib/slugify";

export async function getAllCoachesAdmin() {
  return prisma.coach.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCoachesPublic(limit?: number) {
  return prisma.coach.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    ...(limit ? { take: limit } : {}),
  });
}

type CoachRecord = Awaited<ReturnType<typeof getCoachesPublic>>[number];

/**
 * Coaches have no slug column, so slugs are derived from the name. Duplicate
 * names get a numeric suffix, keyed off the same ordering every time so the
 * generated URLs stay stable between the list and the detail page.
 */
function withSlugs<T extends { name: string }>(coaches: T[]) {
  const seen = new Map<string, number>();
  return coaches.map((coach) => {
    const base = slugifyStable(coach.name) || "trener";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return { ...coach, slug: count === 1 ? base : `${base}-${count}` };
  });
}

export async function getCoachesPublicWithSlugs(limit?: number) {
  // Slugs are always derived from the full published list, so a limited
  // homepage selection links to the same URLs as the full /trenerzy list.
  const all = withSlugs(await getCoachesPublic());
  return limit ? all.slice(0, limit) : all;
}

export async function getCoachBySlug(
  slug: string,
): Promise<(CoachRecord & { slug: string }) | null> {
  const all = await getCoachesPublicWithSlugs();
  return all.find((coach) => coach.slug === slug) ?? null;
}
