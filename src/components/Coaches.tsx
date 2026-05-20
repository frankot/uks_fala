import Link from "next/link";
import { getCoachesPublic } from "@/lib/queries/coaches";

export default async function Coaches() {
  const coaches = await getCoachesPublic(3);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <section id="trenerzy" className="relative overflow-hidden bg-sand-100 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Header — split layout */}
        <div className="mb-16 grid md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Kadra
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Trenerzy, którym
              <span className="block text-deep-500">zaufasz</span>
            </h2>
          </div>
          <p className="mt-5 text-[17px] leading-[1.75] text-sand-600 md:mt-0 md:text-right">
            Nasz zespół to wykwalifikowani instruktorzy z&nbsp;pasją do pracy
            z&nbsp;dziećmi i&nbsp;młodzieżą.
          </p>
        </div>

        {/* Coach cards — horizontal on desktop */}
        <div className="grid gap-5 md:grid-cols-3">
          {coaches.map((coach) => (
            <article
              key={coach.id}
              className="group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-xl hover:shadow-deep-900/6"
            >
              {/* Photo or initial placeholder */}
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
                {/* Decorative wave */}
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
                <h3 className="text-lg font-bold text-sand-950">
                  {coach.name}
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-deep-500">
                  {coach.role}
                </p>
                <p className="mt-4 text-[15px] leading-[1.7] text-sand-500">
                  {coach.bio}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Only show CTA if there are more coaches than shown */}
        <div className="mt-12 text-center">
          <Link
            href="/trenerzy"
            className="inline-flex items-center gap-2 rounded-full border-2 border-deep-200 px-6 py-3 text-[13px] font-bold text-deep-700 transition-all hover:bg-deep-700 hover:text-white hover:border-deep-700"
          >
            Zobacz wszystkich
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
