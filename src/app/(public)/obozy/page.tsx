// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import HeroStrip from "@/components/HeroStrip";
import SeasonalOfferCard from "@/components/SeasonalOfferCard";
import { getPublishedSeasonalOffers } from "@/lib/queries/seasonal-offers";

export const metadata = {
  title: "Obozy — UKS Fala",
  description: "Aktualne obozy pływackie UKS Fala Nieporęt.",
};

export default async function ObozyPage() {
  const offers = await getPublishedSeasonalOffers("OBOZ");

  return (
    <section>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Obozy"
        title="Obozy pływackie"
        subtitle="UKS Fala"
        description="Wyjazdy z opieką trenerską, treningiem w wodzie i programem dopasowanym do wieku oraz poziomu grup."
      />
      <div className="mx-auto max-w-[1240px] px-5 py-12 sm:px-8 lg:py-16">
        {offers.length === 0 ? (
          <div className="rounded-[1.75rem] border border-sand-200 bg-white p-10 text-center shadow-sm">
            <h2 className="font-editorial text-2xl font-bold text-sand-950">
              Aktualne obozy pojawią się wkrótce
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-sand-500">
              Pracujemy nad kolejną ofertą wyjazdową. W sprawie planowanych
              terminów możesz skontaktować się z klubem przez formularz.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {offers.map((offer) => (
              <SeasonalOfferCard
                key={offer.id}
                offer={offer}
                basePath="/obozy"
                accent="pool"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
