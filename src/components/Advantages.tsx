export default function Advantages() {
  return (
    <section className="relative overflow-hidden bg-deep-900 py-24 md:py-32">
      {/* Grain */}
      <div className="grain absolute inset-0" />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-pool-500/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Header — left aligned */}
        <div className="mb-16 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-pool-400" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
              Dlaczego my
            </span>
          </div>
          <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
            Dlaczego rodzice
            <span className="block text-deep-300">
              wybierają UKS&nbsp;Fala
            </span>
          </h2>
        </div>

        {/* Bento grid — varied sizes */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 — large, spans 2 cols on lg */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.06] lg:col-span-2 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
              <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-500/15 sm:mb-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05438" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Bezpieczeństwo na pierwszym miejscu
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-deep-200/60">
                  Małe grupy, stały nadzór ratownika i przeszkolona kadra. Basen
                  w&nbsp;OSiR Nieporęt spełnia wszystkie normy bezpieczeństwa.
                  Twoje dziecko jest pod opieką od momentu wejścia na obiekt.
                </p>
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 font-editorial text-[120px] font-bold leading-none text-white/[0.02] select-none">
              01
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.06]">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pool-500/15">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">
              Doświadczeni trenerzy
            </h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-deep-200/60">
              Wykwalifikowani instruktorzy z&nbsp;uprawnieniami i&nbsp;wieloletnim
              doświadczeniem w&nbsp;pracy z&nbsp;dziećmi.
            </p>
            <div className="absolute -bottom-4 -right-4 font-editorial text-[120px] font-bold leading-none text-white/[0.02] select-none">
              02
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.06]">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pool-500/15">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">
              Indywidualne podejście
            </h3>
            <p className="mt-3 text-[15px] leading-[1.7] text-deep-200/60">
              Dopasowujemy tempo nauki do możliwości każdego dziecka.
              Grupy dobierane wiekowo i&nbsp;umiejętnościowo.
            </p>
            <div className="absolute -bottom-4 -right-4 font-editorial text-[120px] font-bold leading-none text-white/[0.02] select-none">
              03
            </div>
          </div>

          {/* Card 4 — spans 2 cols on lg */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.03] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.06] lg:col-span-2 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-8">
              <div className="mb-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-coral-500/15 sm:mb-0">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05438" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Sprawdzona metodyka i jasna ścieżka rozwoju
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-deep-200/60">
                  Progresywny system nauczania w 9 grupach wiekowych — od
                  oswajania z&nbsp;wodą po przygotowanie do zawodów sportowych.
                  Rodzice na bieżąco widzą postępy dziecka: od Krewetek po Rekiny.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 font-editorial text-[120px] font-bold leading-none text-white/[0.02] select-none">
              04
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
