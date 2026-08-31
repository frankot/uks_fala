import { prisma } from "@/lib/prisma";

export async function getLatestNews(limit = 4) {
  return prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAllNews(page = 1, perPage = 9) {
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.news.count({ where: { published: true } }),
  ]);

  return { items, total, totalPages: Math.ceil(total / perPage) };
}

export async function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({ where: { slug } });
}

export async function getAllNewsAdmin() {
  return prisma.news.findMany({ orderBy: { createdAt: "desc" } });
}

/** Slugs prerenderowane przy buildzie — patrz generateStaticParams w /aktualnosci/[slug]. */
export async function getNewsSlugs() {
  const items = await prisma.news.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return items.map((i) => i.slug);
}
