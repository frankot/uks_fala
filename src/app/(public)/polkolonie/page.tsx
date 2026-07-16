export const dynamic = "force-dynamic";

import HeroStrip from "@/components/HeroStrip";
import SeasonalOfferCard from "@/components/SeasonalOfferCard";
import { getPublishedSeasonalOffers } from "@/lib/queries/seasonal-offers";

export const metadata = {
  title: "Półkolonie — UKS Fala",
  description: "Aktualne półkolonie pływackie UKS Fala Nieporęt.",
};

export default async function PolkoloniePage() {
  const offers = await getPublishedSeasonalOffers("POLKOLONIA");

  return (
    <section>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Półkolonie"
        tagColor="coral"
        title="Półkolonie pływackie"
        subtitle="UKS Fala"
        description="Aktywne dni z pływaniem, zabawą i opieką trenerów — bez wyjazdu z domu."
      />
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:py-16">
        {offers.length === 0 ? (
          <div className="rounded-[1.75rem] border border-sand-200 bg-white p-10 text-center shadow-sm">
            <h2 className="font-editorial text-2xl font-bold text-sand-950">
              Aktualne półkolonie pojawią się wkrótce
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-sand-500">
              Gdy uruchomimy nowy turnus, znajdziesz tutaj pełny program,
              terminy i informacje o zapisach.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <SeasonalOfferCard
                key={offer.id}
                offer={offer}
                basePath="/polkolonie"
                accent="coral"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
