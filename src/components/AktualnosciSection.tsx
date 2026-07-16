import Link from "next/link";
import { getLatestNews } from "@/lib/queries/news";
import { getPublishedSeasonalOffers } from "@/lib/queries/seasonal-offers";

type SectionItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  date: Date | string | null;
  images: string[];
  tag: string;
  tagClassName: string;
};

function formatDate(date: Date | string | null) {
  if (!date) return "Termin wkrótce";
  return new Date(date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AktualnosciSection() {
  const [news, camps, dayCamps] = await Promise.all([
    getLatestNews(2),
    getPublishedSeasonalOffers("OBOZ"),
    getPublishedSeasonalOffers("POLKOLONIA"),
  ]);

  const items: SectionItem[] = [
    ...news.slice(0, 2).map((item) => ({
      id: `news-${item.id}`,
      title: item.title,
      description: item.description,
      href: `/aktualnosci/${item.slug}`,
      date: item.publishedAt,
      images: item.images,
      tag: "Informacje",
      tagClassName: "bg-pool-50 text-pool-600",
    })),
    ...camps.slice(0, 1).map((item) => ({
      id: `camp-${item.id}`,
      title: item.title,
      description: item.summary,
      href: `/obozy/${item.slug}`,
      date: item.startDate,
      images: item.images,
      tag: "Wyjazdy",
      tagClassName: "bg-deep-50 text-deep-600",
    })),
    ...dayCamps.slice(0, 1).map((item) => ({
      id: `day-camp-${item.id}`,
      title: item.title,
      description: item.summary,
      href: `/polkolonie/${item.slug}`,
      date: item.startDate,
      images: item.images,
      tag: "Półkolonie",
      tagClassName: "bg-coral-50 text-coral-600",
    })),
  ].slice(0, 4);

  return (
    <section className="bg-sand-50 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-10 bg-pool-400" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-500">
              Aktualnosci
            </span>
          </div>
          <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
            Co nowego
            <span className="block text-deep-500">w naszym klubie</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8"
            >
              {item.images[0] ? (
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-pool-100 to-deep-100">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-deep-300"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${item.tagClassName}`}>
                    {item.tag}
                  </span>
                  <span className="text-[12px] font-medium text-sand-400">
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="mt-3 line-clamp-2 font-editorial text-[1.1rem] font-bold leading-snug text-sand-900">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-sand-500">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-deep-500 group-hover:text-deep-700">
                  Czytaj dalej
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap justify-center gap-3 text-center">
          {[
            { href: "/aktualnosci", label: "Wszystkie aktualności" },
            { href: "/obozy", label: "Obozy" },
            { href: "/polkolonie", label: "Półkolonie" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 rounded-full border-2 border-deep-200 px-6 py-3 text-[13px] font-bold text-deep-700 transition-all hover:border-deep-700 hover:bg-deep-700 hover:text-white"
            >
              {link.label}
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
          ))}
        </div>
      </div>
    </section>
  );
}
