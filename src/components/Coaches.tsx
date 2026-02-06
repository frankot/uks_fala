const coaches = [
  {
    name: "Bartosz Krawczak",
    role: "Trener główny / Prezes klubu",
    bio: "Wieloletni trener pływania z uprawnieniami instruktorskimi. Założyciel UKS Fala, odpowiada za strategię szkoleniową i rozwój sekcji sportowej.",
    initial: "BK",
    color: "from-deep-700 to-deep-900",
  },
  {
    name: "Trener / Trenerka",
    role: "Instruktor — grupy początkujące",
    bio: "Certyfikowany instruktor z doświadczeniem w prowadzeniu grup dziecięcych. Specjalizacja: nauka podstaw i oswajanie z wodą.",
    initial: "T1",
    color: "from-deep-600 to-deep-800",
  },
  {
    name: "Trener / Trenerka",
    role: "Instruktor — grupy zaawansowane",
    bio: "Doświadczony szkoleniowiec pracujący z grupami zaawansowanymi. Przygotowuje młodych pływaków do startów w zawodach.",
    initial: "T2",
    color: "from-deep-500 to-deep-700",
  },
];

export default function Coaches() {
  return (
    <section id="trenerzy" className="relative overflow-hidden bg-sand-100 py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        {/* Header — split layout */}
        <div className="mb-16 grid md:grid-cols-2 md:items-end md:gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Kadra
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Trenerzy, którym
              <span className="block text-deep-500">zaufasz</span>
            </h2>
          </div>
          <p className="mt-5 text-[17px] leading-[1.75] text-sand-600 md:mt-0 md:text-right">
            Nasz zespół to wykwalifikowani instruktorzy z&nbsp;pasją do pracy
            z&nbsp;dziećmi i&nbsp;młodzieżą.
          </p>
        </div>

        {/* Coach cards — horizontal on desktop */}
        <div className="grid gap-5 md:grid-cols-3">
          {coaches.map((coach, i) => (
            <article
              key={i}
              className="group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-xl hover:shadow-deep-900/6"
            >
              {/* Photo placeholder — large initial instead of generic icon */}
              <div className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${coach.color}`}>
                {/* Replace with real coach photo */}
                <span className="font-editorial text-6xl font-bold text-white/20 select-none">
                  {coach.initial}
                </span>
                {/* Decorative wave */}
                <svg
                  className="absolute bottom-0 left-0 w-full text-white"
                  viewBox="0 0 400 30"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,15 C100,30 200,0 300,15 C350,22 380,25 400,20 L400,30 L0,30 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <div className="p-7">
                <h3 className="text-lg font-bold text-sand-950">
                  {coach.name}
                </h3>
                <p className="mt-1 text-[13px] font-semibold text-deep-500">
                  {coach.role}
                </p>
                <p className="mt-4 text-[15px] leading-[1.7] text-sand-500">
                  {coach.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
