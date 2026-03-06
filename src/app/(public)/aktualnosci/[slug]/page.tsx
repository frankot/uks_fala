export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/queries/news";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);
  if (!item) return { title: "Nie znaleziono — UKS Fala" };
  return {
    title: `${item.title} — UKS Fala`,
    description: item.description,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item || !item.published) notFound();

  const paragraphs: string[] = item.content.split(/\n\n+/).filter(Boolean);

  return (
    <article className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        {/* Back */}
        <Link
          href="/aktualnosci"
          className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-sand-500 transition-colors hover:text-deep-700"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Wszystkie aktualnosci
        </Link>

        {/* Date */}
        <span className="text-[13px] font-medium text-sand-400">
          {new Date(item.publishedAt).toLocaleDateString("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>

        {/* Title */}
        <h1 className="mt-3 font-editorial text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
          {item.title}
        </h1>

        {/* Lead */}
        <p className="mt-6 text-[18px] leading-[1.75] text-sand-600 font-medium">
          {item.description}
        </p>

        {/* Images */}
        {item.images.length > 0 && (
          <div className={`mt-8 ${item.images.length === 1 ? "" : "grid gap-3 sm:grid-cols-2"}`}>
            {item.images.map((url: string, i: number) => (
              <img
                key={i}
                src={url}
                alt={`${item.title} — zdjecie ${i + 1}`}
                className="w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8 space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-[16px] leading-[1.8] text-sand-700">
              {p}
            </p>
          ))}
        </div>

        {/* Back bottom */}
        <div className="mt-12 border-t border-sand-200 pt-8">
          <Link
            href="/aktualnosci"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-sand-500 transition-colors hover:text-deep-700"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Wróc do aktualnosci
          </Link>
        </div>
      </div>
    </article>
  );
}
