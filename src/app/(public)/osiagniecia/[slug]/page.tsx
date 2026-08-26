// Serwowane z cache; edycje w CMS publikują się od razu przez revalidatePath
// w src/lib/actions/*. Godzina to tylko siatka bezpieczeństwa.
export const revalidate = 3600;

import Link from "next/link";
import { notFound } from "next/navigation";
import HeroStrip from "@/components/HeroStrip";
import CmsImage from "@/components/CmsImage";
import { GALLERY_WIDTHS } from "@/lib/cloudinary-image";
import {
  getAchievementBySlug,
  getAchievementSlugs,
} from "@/lib/queries/achievements";

export async function generateStaticParams() {
  return (await getAchievementSlugs()).map((slug) => ({ slug }));
}

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
    <div>
      <HeroStrip
        backHref="/osiagniecia"
        backLabel="Wszystkie osiągnięcia"
        tag="Osiągnięcia"
        tagColor="coral"
        title={item.title}
        description={item.description}
      />
      <div className="mx-auto max-w-2xl px-5 sm:px-8 py-12">
        {/* Card */}
        <div className="rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
          {/* Images */}
          {item.images.length > 0 && (
            <div
              className={`mt-6 ${item.images.length === 1 ? "" : "grid gap-3 sm:grid-cols-2"}`}
            >
              {item.images.map((url, i) => (
                <CmsImage
                  key={i}
                  src={url}
                  alt={`${item.title} — zdjecie ${i + 1}`}
                  sizes={
                    item.images.length === 1
                      ? "(min-width: 672px) 608px, 100vw"
                      : "(min-width: 640px) 304px, 100vw"
                  }
                  widths={GALLERY_WIDTHS}
                  priority={i === 0}
                  className="w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          {/* Content */}
          {item.content && (
            <div className="mt-6 space-y-3 border-t border-sand-100 pt-6">
              {item.content
                .split(/\n\n+/)
                .filter(Boolean)
                .map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.75] text-sand-700"
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
            href="/osiagniecia"
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
            Wróc do osiagniec
          </Link>
        </div>
      </div>
    </div>
  );
}
