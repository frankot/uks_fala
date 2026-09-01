// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroStrip from "@/components/HeroStrip";
import {
  getCoachBySlug,
  getCoachesPublicWithSlugs,
} from "@/lib/queries/coaches";

export async function generateStaticParams() {
  const coaches = await getCoachesPublicWithSlugs();
  return coaches.map((coach) => ({ slug: coach.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);
  if (!coach) return { title: "Nie znaleziono — UKS Fala" };
  return {
    title: `${coach.name} — UKS Fala`,
    description: coach.role,
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);

  if (!coach) notFound();

  return (
    <div>
      <HeroStrip
        backHref="/trenerzy"
        backLabel="Wszyscy trenerzy"
        tag="Kadra"
        tagColor="coral"
        title={coach.name}
        description={coach.role}
      />
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12">
        {/* Card */}
        <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
          {/* Photo */}
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-deep-700 to-deep-900 sm:h-96">
            {coach.imageUrl ? (
              <Image
                src={coach.imageUrl}
                alt={coach.name}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover object-top"
                priority
              />
            ) : (
              <span className="font-editorial text-7xl font-bold text-white/20 select-none">
                {getInitials(coach.name)}
              </span>
            )}
          </div>

          {/* Name + role */}
          <div className="mt-6">
            <h1 className="font-editorial text-[1.75rem] font-bold leading-tight tracking-[-0.01em] text-sand-950">
              {coach.name}
            </h1>
            <p className="mt-1.5 text-[13px] font-semibold text-deep-500">
              {coach.role}
            </p>
          </div>

          {/* Bio */}
          {coach.bio && (
            <div className="mt-6 space-y-3 border-t border-sand-100 pt-6">
              {coach.bio
                .split(/\n\n+/)
                .filter(Boolean)
                .map((p, i) => (
                  <p
                    key={i}
                    className="whitespace-pre-line text-[15px] leading-[1.75] text-sand-700"
                  >
                    {p}
                  </p>
                ))}
            </div>
          )}
        </div>

        {/* Back bottom */}
        <div className="mt-8 text-center">
          <Link
            href="/trenerzy"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-sand-500 transition-colors hover:text-deep-700"
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
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Wróć do trenerów
          </Link>
        </div>
      </div>
    </div>
  );
}
