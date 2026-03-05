import { prisma } from "@/lib/prisma";

const FALLBACK_ACHIEVEMENTS = [
  {
    id: "placeholder-1",
    title: "Zloto na Mistrzostwach Wojewodztwa",
    slug: "",
    description: "Nasz zawodnik zdobyl zloty medal w kategorii 10-12 lat na Mistrzostwach Wojewodztwa Mazowieckiego w plywaniu.",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-05-10"),
    createdAt: new Date("2025-05-10"),
    updatedAt: new Date("2025-05-10"),
  },
  {
    id: "placeholder-2",
    title: "5 medali na Grand Prix Mlodzikow",
    slug: "",
    description: "Reprezentanci UKS Fala przywiezli 5 medali z ogolnopolskiego Grand Prix Mlodzikow w Warszawie.",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-03-22"),
    createdAt: new Date("2025-03-22"),
    updatedAt: new Date("2025-03-22"),
  },
  {
    id: "placeholder-3",
    title: "Rekord klubowy na 100m stylem dowolnym",
    slug: "",
    description: "Nowy rekord klubowy w kategorii 11-12 lat! Wynik 1:02.34 na dystansie 100m stylem dowolnym.",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-02-14"),
    createdAt: new Date("2025-02-14"),
    updatedAt: new Date("2025-02-14"),
  },
];

export async function getLatestAchievements(limit = 3) {
  const items = await prisma.achievement.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return items.length > 0 ? items : FALLBACK_ACHIEVEMENTS.slice(0, limit);
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
