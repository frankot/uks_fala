import { prisma } from "@/lib/prisma";

export async function getLatestAchievements(limit = 3) {
  return prisma.achievement.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAllAchievements(page = 1, perPage = 9) {
  const [items, total] = await Promise.all([
    prisma.achievement.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.achievement.count({ where: { published: true } }),
  ]);

  return { items, total, totalPages: Math.ceil(total / perPage) };
}

export async function getAchievementBySlug(slug: string) {
  return prisma.achievement.findUnique({ where: { slug } });
}

export async function getAllAchievementsAdmin() {
  return prisma.achievement.findMany({ orderBy: { createdAt: "desc" } });
}

/** Slugs prerenderowane przy buildzie — patrz generateStaticParams w /osiagniecia/[slug]. */
export async function getAchievementSlugs() {
  const items = await prisma.achievement.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return items.map((i) => i.slug);
}
