export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import SeasonalOfferDetail from "@/components/SeasonalOfferDetail";
import { getSeasonalOfferBySlug } from "@/lib/queries/seasonal-offers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getSeasonalOfferBySlug("POLKOLONIA", slug);
  if (!offer) return { title: "Nie znaleziono — UKS Fala" };
  return {
    title: `${offer.title} — UKS Fala`,
    description: offer.summary,
  };
}

export default async function PolkoloniaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offer = await getSeasonalOfferBySlug("POLKOLONIA", slug);

  if (!offer) notFound();

  return (
    <SeasonalOfferDetail
      offer={offer}
      backHref="/polkolonie"
      backLabel="Wszystkie półkolonie"
      tag="Półkolonia"
      accent="coral"
    />
  );
}
