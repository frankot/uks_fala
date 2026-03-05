import { prisma } from "@/lib/prisma";

const FALLBACK_NEWS = [
  {
    id: "placeholder-1",
    title: "Rozpoczynamy nowy sezon treningowy",
    slug: "",
    description: "Zapraszamy wszystkie dzieci na nowy sezon treningowy 2025/2026. Zapisy juz trwaja — dolacz do naszego klubu!",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-09-01"),
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  {
    id: "placeholder-2",
    title: "Sukces na zawodach wojewodzkich",
    slug: "",
    description: "Nasi zawodnicy zdobyli 5 medali na Wojewodzkich Zawodach Plywackich. Gratulujemy!",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-06-15"),
    createdAt: new Date("2025-06-15"),
    updatedAt: new Date("2025-06-15"),
  },
  {
    id: "placeholder-3",
    title: "Letni oboz plywacki",
    slug: "",
    description: "Zapisy na letni oboz plywacki. Dwa tygodnie intensywnych treningow i swietnej zabawy nad woda.",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-05-20"),
    createdAt: new Date("2025-05-20"),
    updatedAt: new Date("2025-05-20"),
  },
  {
    id: "placeholder-4",
    title: "Nowe grupy dla najmlodszych",
    slug: "",
    description: "Otwieramy dodatkowe grupy dla dzieci w wieku 3-5 lat. Oswajanie z woda w przyjaznej atmosferze.",
    content: "",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-04-10"),
    createdAt: new Date("2025-04-10"),
    updatedAt: new Date("2025-04-10"),
  },
];

export async function getLatestNews(limit = 4) {
  const items = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return items.length > 0 ? items : FALLBACK_NEWS.slice(0, limit);
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
