import Link from "next/link";
import WaveDivider from "./WaveDivider";
import { getTrainingGroups } from "@/lib/queries/training-groups";

export default async function TrainingGroups() {
  const groups = await getTrainingGroups();

  if (groups.length === 0) return null;

  return (
    <>
      <WaveDivider color="var(--color-sand-50)" flip />
      <section id="grupy" className="relative py-24 md:py-32">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          {/* Header */}
          <div className="mb-16 grid md:grid-cols-2 md:items-end md:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Grupy szkoleniowe
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
                Znajdź grupę
                <span className="block text-deep-500">dla swojego dziecka</span>
              </h2>
            </div>
            <p className="mt-5 text-[17px] leading-[1.75] text-sand-600 md:mt-0 md:text-right">
              {groups.length} grup dopasowanych do wieku
              i&nbsp;umiejętności — od maluchów stawiających pierwsze kroki
              w&nbsp;wodzie po młodych zawodników.
            </p>
          </div>

          {/* Groups grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((group) => (
              <article
                key={group.name}
                className={`group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8 ${group.border}`}
              >
                {/* Oversized number */}
                <span className="font-editorial absolute -top-3 -right-1 text-[80px] font-bold leading-none text-sand-100 select-none transition-colors group-hover:text-deep-50">
                  {group.num}
                </span>

                {/* Level badge */}
                {group.level && (
                  <span
                    className={`relative inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${group.accent}`}
                  >
                    {group.level}
                  </span>
                )}

                <h3 className="relative mt-5 text-xl font-bold text-sand-950">
                  {group.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-deep-500">
                  {group.age}
                </p>

                <div className="mt-5 space-y-2.5 border-t border-sand-200 pt-4">
                  {group.sessions && (
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-sand-500">Zajęcia</span>
                      <span className="text-[13px] font-semibold text-sand-800">
                        {group.sessions}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-sand-500">Czas</span>
                    <span className="text-[13px] font-semibold text-sand-800">
                      {group.duration}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/grafik?group=${encodeURIComponent(group.name)}`}
                  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand-100 py-2.5 text-[13px] font-bold text-sand-700 transition-all group-hover:bg-deep-700 group-hover:text-white"
                >
                  Zapisz dziecko
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </article>
            ))}
          </div>

          {/* Pricing strip */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-deep-50 px-8 py-6 sm:flex-row">
            <p className="text-[15px] text-sand-700">
              Od{" "}
              <span className="font-editorial text-2xl font-bold text-deep-800">
                863 zł
              </span>{" "}
              do{" "}
              <span className="font-editorial text-2xl font-bold text-deep-800">
                2 040 zł
              </span>{" "}
              <span className="text-sand-500">za semestr</span>
            </p>
            <div className="flex items-center gap-2 rounded-full bg-coral-100 px-4 py-2">
              <span className="text-[13px] font-bold text-coral-600">
                –10% zniżki na rodzeństwo
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
