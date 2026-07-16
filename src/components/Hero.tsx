import WaveDivider from "./WaveDivider";
import Image from "next/image";
import ContactLink from "./ContactLink";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-deep-900">
      {/* Grain texture */}
      <div className="grain absolute inset-0" />

      {/* Background image — blended with shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-50">
        <Image
          src="/hero1.webp"
          alt="Dzieci na zajęciach pływania UKS Fala"
          fill
          className="object-cover mix-blend-multiply"
          priority
        />
      </div>

      {/* Animated background circles — pool-light refraction */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[15%] h-[80vh] w-[80vh] rounded-full bg-deep-700/40 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] h-[60vh] w-[60vh] rounded-full bg-pool-500/10 blur-[80px]" />
        <div className="absolute top-[20%] left-[50%] h-[40vh] w-[40vh] rounded-full bg-coral-500/8 blur-[60px]" />
      </div>

      {/* Lane lines — subtle vertical grid */}
      <div className="absolute inset-0 opacity-[0.04] lane-lines" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-[1240px] flex-col justify-center px-5 pt-20 pb-24 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left — text */}
          <div className="lg:col-span-7">
            {/* Enrollment badge */}
            <div className="animate-fade-up relative mb-8 inline-flex items-center gap-2.5 rounded-full border border-pool-400/20 bg-pool-500/10 px-4 py-2 backdrop-blur-sm lg:top-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-500" />
              </span>
              <span className="text-[13px] font-semibold text-pool-300">
                Zapisy na nowy semestr otwarte
              </span>
            </div>

            {/* Headline — editorial serif, massive */}
            <h1 className="font-editorial animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <span className="block text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-white">
                Uczymy dzieci pływać
              </span>
              <span className="mt-3 block text-[clamp(1.4rem,3.2vw,2rem)] font-light leading-[1.25] tracking-[-0.01em] text-deep-200">
                <span className="text-pool-400/50">—</span> z{" "}
                <span className="font-semibold italic text-pool-300">odwagą</span>,{" "}
                <span className="font-semibold italic text-coral-300">radością</span>{" "}
                i{" "}
                <span className="font-semibold italic text-pool-300">sportową pasją</span>
                <span className="text-pool-400">.</span>
              </span>
            </h1>

            {/* Subhead — lighter, wider */}
            <p
              className="animate-fade-up mt-7 max-w-[480px] text-[17px] leading-[1.7] text-deep-200 sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
           Najwyższej jakości zajęcia pływania w Nieporęcie: od
pierwszych chwil w wodzie po sekcję sportową i starty w zawodach.
Nowoczesny program, świetni trenerzy i najmocniejsza sekcja pływacka w gminie.
            </p>

            {/* CTAs */}
            <div
              className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              style={{ animationDelay: "0.3s" }}
            >
              <ContactLink className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:bg-coral-600 hover:shadow-coral-500/30 hover:-translate-y-0.5 sm:h-14">
                Zapisz dziecko
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </ContactLink>
              <a
                href="#grupy"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-8 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 hover:text-white sm:h-14"
              >
                Sprawdź grupy
              </a>
            </div>
          </div>

          {/* Right — stats column with decorative element */}
          <div className="hidden lg:col-span-5 lg:flex lg:justify-end">
            <div className="relative">
              {/* Decorative large number */}
              <div className="font-editorial absolute -top-16 -right-8 text-[200px] font-bold leading-none text-white/[0.03] select-none">
                15
              </div>

              {/* Stats cards */}
              <div className="relative space-y-4">
                {[
                  { value: "15", label: "Lat doświadczenia", sub: "od 2010 roku" },
                  { value: "3000+", label: "Najmłodszych pływaków", sub: "przez 15 lat" },
                  { value: "1000+", label: "Zdobytych medali", sub: "na zawodach pływackich" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="animate-fade-up flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-5 backdrop-blur-sm"
                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                  >
                    <span className="font-editorial text-4xl font-bold text-pool-400">
                      {stat.value}
                    </span>
                    <div>
                      <p className="text-[15px] font-semibold text-white/90">
                        {stat.label}
                      </p>
                      <p className="text-[13px] text-white/40">{stat.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats — horizontal scroll */}
        <div
          className="animate-fade-up -mx-5 mt-14 flex gap-3 overflow-x-auto scroll-hide px-5 sm:-mx-8 sm:px-8 lg:hidden"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { value: "15", label: "Lat doświadczenia" },
            { value: "3000+", label: "Pływaków" },
            { value: "1000+", label: "Medali" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-sm"
            >
              <span className="font-editorial text-2xl font-bold text-pool-400">
                {stat.value}
              </span>
              <span className="text-[13px] font-medium text-white/60 whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Wave transition to next section */}
      <WaveDivider />
    </section>
  );
}
