import Link from "next/link";
import { getLatestAchievements } from "@/lib/queries/achievements";

export default async function OsiagnieciaSection() {
  const achievements = await getLatestAchievements(3);

  // Nothing published yet — drop the whole block rather than render the
  // "Nasze sukcesy" heading above an empty grid.
  if (achievements.length === 0) return null;

  const isPlaceholder = achievements.length > 0 && !achievements[0].slug;

  return (
    <section className="relative bg-deep-900 py-24 md:py-20 overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-coral-400" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-400">
              Osiągnięcia
            </span>
          </div>
          <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            Nasze sukcesy
            <span className="block text-pool-300">i medale</span>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => {
            const cardContent = (
              <>
                {/* Trophy icon */}
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-coral-500/10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-coral-400"
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

                <span className="text-[12px] font-medium text-white/40">
                  {new Date(item.publishedAt).toLocaleDateString("pl-PL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <h3 className="mt-2 font-editorial text-[1.15rem] font-bold leading-snug text-white line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/50 line-clamp-3">
                  {item.description}
                </p>
              </>
            );

            return isPlaceholder ? (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/[0.1]"
              >
                {cardContent}
              </div>
            ) : (
              <Link
                key={item.id}
                href={`/osiagniecia/${item.slug}`}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:bg-white/[0.06] hover:border-white/[0.1]"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        {!isPlaceholder && (
          <div className="mt-12 text-center">
            <Link
              href="/osiagniecia"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-6 py-3 text-[13px] font-bold text-white transition-all hover:bg-white hover:text-deep-900 hover:border-white"
            >
              Zobacz wszystkie
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
        )}
      </div>
    </section>
  );
}
