export const dynamic = "force-dynamic";

import Link from "next/link";
import HeroStrip from "@/components/HeroStrip";
import { getCoachesPublic } from "@/lib/queries/coaches";

export const metadata = {
  title: "Trenerzy — UKS Fala",
  description: "Kadra trenerska UKS Fala Nieporet.",
};





export default async function TrenerzyPage() {
  const coaches = await getCoachesPublic();

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

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
              <div
                key={coach.id}
                className="group overflow-hidden rounded-3xl bg-white border border-sand-200 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8"
              >
                <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-deep-700 to-deep-900">
                  {coach.imageUrl ? (
                    <img
                      src={coach.imageUrl}
                      alt={coach.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-editorial text-6xl font-bold text-white/20 select-none">
                      {getInitials(coach.name)}
                    </span>
                  )}
                  <svg
                    className="absolute bottom-0 left-0 w-full text-white"
                    viewBox="0 0 400 30"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,15 C100,30 200,0 300,15 C350,22 380,25 400,20 L400,30 L0,30 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div className="p-7">
                  <h2 className="text-lg font-bold text-sand-950">
                    {coach.name}
                  </h2>
                  <p className="mt-1 text-[13px] font-semibold text-deep-500">
                    {coach.role}
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.7] text-sand-500">
                    {coach.bio}
                  </p>
                </div>
              </div>
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
