import { prisma } from "@/lib/prisma";

export type SeasonalOfferType = "OBOZ" | "POLKOLONIA";

const OFFER_ORDER = [
  { featured: "desc" as const },
  { sortOrder: "asc" as const },
  { startDate: "asc" as const },
  { createdAt: "desc" as const },
];

export async function getPublishedSeasonalOffers(type: SeasonalOfferType) {
  return prisma.seasonalOffer.findMany({
    where: { type, published: true },
    orderBy: OFFER_ORDER,
  });
}

export async function getSeasonalOfferBySlug(
  type: SeasonalOfferType,
  slug: string,
) {
  return prisma.seasonalOffer.findFirst({
    where: { type, slug, published: true },
  });
}

export async function getAllSeasonalOffersAdmin(type: SeasonalOfferType) {
  return prisma.seasonalOffer.findMany({
    where: { type },
    orderBy: OFFER_ORDER,
  });
}

/** Slugs prerenderowane przy buildzie — patrz generateStaticParams w /obozy|/polkolonie. */
export async function getSeasonalOfferSlugs(type: SeasonalOfferType) {
  const items = await prisma.seasonalOffer.findMany({
    where: { type, published: true },
    select: { slug: true },
  });
  return items.map((i) => i.slug);
}
