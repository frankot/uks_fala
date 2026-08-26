import Link from "next/link";
import { getCoachesPublicWithSlugs } from "@/lib/queries/coaches";
import CoachCard from "@/components/CoachCard";

export default async function Coaches() {
  const coaches = await getCoachesPublicWithSlugs(4);

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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
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
