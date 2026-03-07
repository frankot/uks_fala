import { prisma } from "@/lib/prisma";

const FALLBACK_ACHIEVEMENTS = [
  {
    id: "fallback-achievement-1",
    title: "Zloto na 100 m stylem dowolnym",
    slug: "zloto-na-100-m-stylem-dowolnym",
    description:
      "Pierwsze miejsce podczas zawodow okregowych i nowy rekord zyciowy naszego zawodnika.",
    content:
      "Finalowy bieg zakonczylismy czasem 1:01.84, co dalo pewne zwyciestwo. Start byl kontrolowany od pierwszych metrow, a ostatnia nawrotka wykonana bardzo czysto technicznie.",
    images: [
      "https://images.unsplash.com/photo-1591593232755-30f372ac0431?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-03-01"),
    createdAt: new Date("2026-03-01"),
    updatedAt: new Date("2026-03-01"),
  },
  {
    id: "fallback-achievement-2",
    title: "Srebro w sztafecie 4x50 m",
    slug: "srebro-w-sztafecie-4x50-m",
    description:
      "Zespol UKS Fala poprawil rekord klubowy i zajal 2. miejsce w klasyfikacji generalnej.",
    content:
      "Sztafeta poplynela rowno na wszystkich zmianach i zakonczylismy rywalizacje z czasem lepszym o 2.4 sekundy od poprzedniego rekordu klubu.",
    images: [
      "https://images.unsplash.com/photo-1591593232755-30f372ac0431?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-02-23"),
    createdAt: new Date("2026-02-23"),
    updatedAt: new Date("2026-02-23"),
  },
  {
    id: "fallback-achievement-3",
    title: "Braz na 50 m grzbietem",
    slug: "braz-na-50-m-grzbietem",
    description:
      "Podium po bardzo dobrym finiszu i rownym tempie na calym dystansie.",
    content:
      "Nasz zawodnik utrzymal tempo od startu i wyprzedzil rywala na ostatnich metrach. To kolejny medal w tym sezonie i potwierdzenie stabilnej formy.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2026-02-11"),
    createdAt: new Date("2026-02-11"),
    updatedAt: new Date("2026-02-11"),
  },
  {
    id: "fallback-achievement-4",
    title: "Rekord zyciowy na 200 m zmiennym",
    slug: "rekord-zyciowy-na-200-m-zmiennym",
    description:
      "Poprawa o ponad 3 sekundy i awans do finalu A podczas mityngu w Ozarowie.",
    content:
      "Start kontrolny zakonczony bardzo dobrym czasem 2:29.17. Szczegolnie udana byla trzecia czesc dystansu, ktora ustawila mocny finisz.",
    images: [
      "https://images.unsplash.com/photo-1591593232755-30f372ac0431?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-01-30"),
    createdAt: new Date("2026-01-30"),
    updatedAt: new Date("2026-01-30"),
  },
  {
    id: "fallback-achievement-5",
    title: "Podwojne podium mlodzikow",
    slug: "podwojne-podium-mlodzikow",
    description:
      "Drugie i trzecie miejsce na 100 m klasykiem w jednej kategorii wiekowej.",
    content:
      "Dwoch naszych zawodnikow zameldowalo sie na podium po bardzo rownych wyscigach. Obaj poprawili rekordy zyciowe i uzyskali minima na kolejne zawody.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2026-01-21"),
    createdAt: new Date("2026-01-21"),
    updatedAt: new Date("2026-01-21"),
  },
  {
    id: "fallback-achievement-6",
    title: "Najlepszy klub dnia w kategorii 11-12",
    slug: "najlepszy-klub-dnia-w-kategorii-11-12",
    description:
      "Wysoka punktacja indywidualna i zespolowa dala nam 1. miejsce w klasyfikacji dnia.",
    content:
      "Po podliczeniu wynikow UKS Fala zajal pierwsze miejsce wsrod klubow w kategorii 11-12 lat. Kluczowe okazaly sie regularne miejsca w pierwszej osemce.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2026-01-09"),
    createdAt: new Date("2026-01-09"),
    updatedAt: new Date("2026-01-09"),
  },
  {
    id: "fallback-achievement-7",
    title: "Kwalifikacja do finalu wojewodzkiego",
    slug: "kwalifikacja-do-finalu-wojewodzkiego",
    description: "Trzech zawodnikow z minima czasowymi na final wojewodzki.",
    content:
      "Po serii startow kontrolnych potwierdzilismy trzy kwalifikacje do finalu. Wyniki byly zgodne z zalozeniami treningowymi na ten etap sezonu.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-12-18"),
    createdAt: new Date("2025-12-18"),
    updatedAt: new Date("2025-12-18"),
  },
  {
    id: "fallback-achievement-8",
    title: "Zloto i braz na zawodach mikolajkowych",
    slug: "zloto-i-braz-na-zawodach-mikolajkowych",
    description:
      "Dwa medale i cztery rekordy zyciowe podczas grudniowego startu kontrolnego.",
    content:
      "Nasi zawodnicy bardzo dobrze zaprezentowali sie na zawodach mikolajkowych. Oprocz medali ciesza nas rowniez poprawione czasy na kazdym dystansie.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-12-07"),
    createdAt: new Date("2025-12-07"),
    updatedAt: new Date("2025-12-07"),
  },
  {
    id: "fallback-achievement-9",
    title: "Najlepszy czas sezonu na 50 m motylkiem",
    slug: "najlepszy-czas-sezonu-na-50-m-motylkiem",
    description:
      "Wyrazna poprawa techniki i nowy najlepszy wynik klubowy w tym sezonie.",
    content:
      "Wynik 31.22 na 50 m motylkiem to obecnie najlepszy czas sezonu w klubie. Start byl szybki i bardzo dobrze utrzymany do samego finiszu.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-11-20"),
    createdAt: new Date("2025-11-20"),
    updatedAt: new Date("2025-11-20"),
  },
  {
    id: "fallback-achievement-10",
    title: "Komplet minim na zawody regionalne",
    slug: "komplet-minim-na-zawody-regionalne",
    description:
      "Cala grupa startowa wypelnila minima i bedzie reprezentowac klub na zawodach regionalnych.",
    content:
      "W ostatnim sprawdzianie wszyscy zawodnicy z grupy startowej uzyskali wymagane minima czasowe. To bardzo dobry sygnal przed najwazniejszym startem semestru.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-11-05"),
    createdAt: new Date("2025-11-05"),
    updatedAt: new Date("2025-11-05"),
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

  if (total === 0) {
    const fallbackItems = FALLBACK_ACHIEVEMENTS.slice(
      (page - 1) * perPage,
      page * perPage,
    );
    const fallbackTotal = FALLBACK_ACHIEVEMENTS.length;

    return {
      items: fallbackItems,
      total: fallbackTotal,
      totalPages: Math.ceil(fallbackTotal / perPage),
    };
  }

  return { items, total, totalPages: Math.ceil(total / perPage) };
}

export async function getAchievementBySlug(slug: string) {
  const item = await prisma.achievement.findUnique({ where: { slug } });
  if (item) return item;
  return (
    FALLBACK_ACHIEVEMENTS.find((fallback) => fallback.slug === slug) ?? null
  );
}

export async function getAllAchievementsAdmin() {
  return prisma.achievement.findMany({ orderBy: { createdAt: "desc" } });
}
