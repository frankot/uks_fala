// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import { notFound } from "next/navigation";
import SeasonalOfferDetail from "@/components/SeasonalOfferDetail";
import {
  getSeasonalOfferBySlug,
  getSeasonalOfferSlugs,
} from "@/lib/queries/seasonal-offers";

export async function generateStaticParams() {
  return (await getSeasonalOfferSlugs("OBOZ")).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getSeasonalOfferBySlug("OBOZ", slug);
  if (!offer) return { title: "Nie znaleziono — UKS Fala" };
  return {
    title: `${offer.title} — UKS Fala`,
    description: offer.summary,
  };
}

export default async function ObozDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getSeasonalOfferBySlug("OBOZ", slug);

  if (!offer) notFound();

  return (
    <SeasonalOfferDetail
      offer={offer}
      backHref="/obozy"
      backLabel="Wszystkie obozy"
      tag="Obóz"
      accent="pool"
    />
  );
}
