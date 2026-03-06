export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAchievementBySlug } from "@/lib/queries/achievements";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAchievementBySlug(slug);
  if (!item) return { title: "Nie znaleziono — UKS Fala" };
  return {
    title: `${item.title} — UKS Fala`,
    description: item.description,
  };
}

export default async function AchievementDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getAchievementBySlug(slug);

  if (!item || !item.published) notFound();

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        {/* Back */}
        <Link
          href="/osiagniecia"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-sand-500 transition-colors hover:text-deep-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Wszystkie osiagniecia
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
          {/* Trophy */}
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-50">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-coral-500">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
              <path d="M4 22h16" />
              <path d="M10 22V8a4 4 0 0 0-4-4" />
              <path d="M14 22V8a4 4 0 0 1 4-4" />
              <path d="M8 9h8" />
              <path d="M8 13h8" />
            </svg>
          </div>

          {/* Date */}
          <p className="text-center text-[13px] font-medium text-sand-400">
            {new Date(item.publishedAt).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Title */}
          <h1 className="mt-3 text-center font-editorial text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.15] tracking-[-0.02em] text-sand-950">
            {item.title}
          </h1>

          {/* Description */}
          <p className="mt-4 text-center text-[16px] leading-[1.7] text-sand-600">
            {item.description}
          </p>

          {/* Images */}
          {item.images.length > 0 && (
            <div className={`mt-6 ${item.images.length === 1 ? "" : "grid gap-3 sm:grid-cols-2"}`}>
              {item.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`${item.title} — zdjecie ${i + 1}`}
                  className="w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          {/* Content */}
          {item.content && (
            <div className="mt-6 space-y-3 border-t border-sand-100 pt-6">
              {item.content.split(/\n\n+/).filter(Boolean).map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.75] text-sand-700">
                  {p}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Back bottom */}
        <div className="mt-8 text-center">
          <Link
            href="/osiagniecia"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-sand-500 transition-colors hover:text-deep-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Wróc do osiagniec
          </Link>
        </div>
      </div>
    </div>
  );
}
