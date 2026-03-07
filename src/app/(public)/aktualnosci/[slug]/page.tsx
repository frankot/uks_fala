export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import HeroStrip from "@/components/HeroStrip";
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
    <article>
      <HeroStrip
        backHref="/aktualnosci"
        backLabel="Wszystkie aktualności"
        tag="Aktualności"
        title={item.title}
        description={item.description}
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">

        {/* Images */}
        {item.images.length > 0 && (
          <div
            className={`mt-8 ${item.images.length === 1 ? "" : "grid gap-3 sm:grid-cols-2"}`}
          >
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
            Wróc do aktualnosci
          </Link>
        </div>
      </div>
    </article>
  );
}
