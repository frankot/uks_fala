export const dynamic = "force-dynamic";

import Link from "next/link";
import HeroStrip from "@/components/HeroStrip";
import { getCoachesPublic } from "@/lib/queries/coaches";
import CoachCard from "@/components/CoachCard";

export const metadata = {
  title: "Trenerzy — UKS Fala",
  description: "Kadra trenerska UKS Fala Nieporet.",
};

export default async function TrenerzyPage() {
  const coaches = await getCoachesPublic();

  return (
    <section>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Kadra"
        tagColor="coral"
        title="Nasi trenerzy"
        subtitle="UKS Fala"
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        {coaches.length === 0 ? (
          <p className="text-center text-sand-500 py-12">
            Brak trenerów do wyświetlenia.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                className="border border-sand-200 shadow-sm"
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-deep-200 px-6 py-3 text-[13px] font-bold text-deep-700 transition-all hover:bg-deep-700 hover:text-white hover:border-deep-700"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Powrót do strony głównej
          </Link>
        </div>
      </div>
    </section>
  );
}
