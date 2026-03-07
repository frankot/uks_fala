export const dynamic = "force-dynamic";

import Link from "next/link";
import HeroStrip from "@/components/HeroStrip";
import { getAllAchievements } from "@/lib/queries/achievements";

export const metadata = {
  title: "Osiagniecia — UKS Fala",
  description: "Sukcesy i medale zawodnikow UKS Fala Nieporet.",
};

export default async function OsiagnieciaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const { items, totalPages } = await getAllAchievements(page);

  return (
    <section>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Osiągnięcia"
        tagColor="coral"
        title="Nasze sukcesy"
        subtitle="UKS Fala"
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        {items.length === 0 ? (
          <p className="text-center text-sand-500 py-12">
            Brak osiagniec do wyswietlenia.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/osiagniecia/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-sand-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8"
                >
                  {/* Trophy icon */}
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-coral-50">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-coral-500"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
                      <path d="M4 22h16" />
                      <path d="M10 22V8a4 4 0 0 0-4-4" />
                      <path d="M14 22V8a4 4 0 0 1 4-4" />
                      <path d="M8 9h8" />
                      <path d="M8 13h8" />
                    </svg>
                  </div>

                  <span className="text-[12px] font-medium text-sand-400">
                    {new Date(item.publishedAt).toLocaleDateString("pl-PL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <h2 className="mt-2 font-editorial text-[1.1rem] font-bold leading-snug text-sand-900 line-clamp-2">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-sand-500 line-clamp-3">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3">
                {page > 1 && (
                  <Link
                    href={`/osiagniecia?page=${page - 1}`}
                    className="rounded-xl border border-sand-200 px-5 py-2.5 text-[13px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
                  >
                    Poprzednia
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/osiagniecia?page=${page + 1}`}
                    className="rounded-xl border border-sand-200 px-5 py-2.5 text-[13px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
                  >
                    Nastepna
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
