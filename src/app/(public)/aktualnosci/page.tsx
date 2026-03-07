export const dynamic = "force-dynamic";

import Link from "next/link";
import HeroStrip from "@/components/HeroStrip";
import { getAllNews } from "@/lib/queries/news";

export const metadata = {
  title: "Aktualnosci — UKS Fala",
  description: "Najnowsze wiadomosci z klubu plywackiego UKS Fala Nieporet.",
};

export default async function AktualnosciPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10) || 1);
  const { items, totalPages } = await getAllNews(page);

  return (
    <section>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Aktualności"
        title="Wiadomości z klubu"
        subtitle="UKS Fala"
      />
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">

        {items.length === 0 ? (
          <p className="text-center text-sand-500 py-12">
            Brak aktualnosci do wyswietlenia.
          </p>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/aktualnosci/${item.slug}`}
                  className="group overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8"
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
                    <div className="aspect-[16/10] bg-gradient-to-br from-pool-100 to-deep-100 flex items-center justify-center">
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
                    <p className="mt-2 text-[14px] leading-relaxed text-sand-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-3">
                {page > 1 && (
                  <Link
                    href={`/aktualnosci?page=${page - 1}`}
                    className="rounded-xl border border-sand-200 px-5 py-2.5 text-[13px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
                  >
                    Poprzednia
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`/aktualnosci?page=${page + 1}`}
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
