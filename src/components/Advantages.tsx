const advantages = [
  {
    num: "01",
    accent: "bg-coral-500/15 text-coral-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Doświadczona Kadra Instruktorów",
    description:
      "Nasza wykwalifikowana kadra instruktorów to pasjonaci pływania z wieloletnim doświadczeniem. Każdy z naszych instruktorów posiada certyfikaty potwierdzające ich umiejętności i wiedzę, a przede wszystkim potrafią stworzyć przyjazną i motywującą atmosferę na basenie.",
  },
  {
    num: "02",
    accent: "bg-pool-500/15 text-pool-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Bezpieczne środowisko, w którym dzieci czują się pewnie",
    description:
      "Kameralne grupy, doświadczeni trenerzy i pełna opieka od wejścia na basen aż do końca zajęć. Treningi odbywają się na nowoczesnym obiekcie Aquapark „Fala” w Stanisławowie Pierwszym, dzięki czemu rodzice mają pewność, że ich dzieci uczą się w komfortowych i bezpiecznych warunkach.",
  },
  {
    num: "03",
    accent: "bg-pool-500/15 text-pool-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Przemyślany rozwój — krok po kroku",
    description:
      "Każde dziecko trafia do grupy dopasowanej do wieku i umiejętności, dzięki czemu rozwija się we własnym tempie i z radością zdobywa kolejne poziomy. Od pierwszego kontaktu z wodą aż po trening sportowy i starty w zawodach — tworzymy jasną i motywującą drogę rozwoju dla każdego młodego pływaka.",
  },
  {
    num: "04",
    accent: "bg-coral-500/15 text-coral-500",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Indywidualne Podejście",
    description:
      "Rozumiemy, że każda osoba jest inna i ma swoje tempo nauki. Dlatego dostosowujemy nasze zajęcia do Twoich potrzeb i umiejętności. Niezależnie od tego, czy dopiero zaczynasz swoją przygodę z pływaniem, czy chcesz doskonalić swoje techniki, mamy dla Ciebie odpowiednie zajęcia.",
  },
];

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

        {/* One centered column — the descriptions differ in length, which the old
            bento grid exposed as ragged, half-empty boxes. Hovering a card lifts it
            slightly; the other cards are left untouched. Gated to pointer-fine so
            touch devices never get a stuck hover state, and the cards keep the
            default cursor — they are not clickable. */}
        <div className="mx-auto max-w-4xl space-y-3">
          {advantages.map((advantage) => (
            <div
              key={advantage.num}
              className="relative flex gap-5 overflow-hidden rounded-3xl border border-white/6 bg-white/3 p-6 backdrop-blur-sm transition-all duration-300 ease-out pointer-fine:hover:scale-[1.02] pointer-fine:hover:border-white/15 pointer-fine:hover:bg-white/8 sm:gap-8 sm:p-8"
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${advantage.accent}`}
              >
                {advantage.icon}
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold leading-snug text-white">
                  {advantage.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-deep-200/60">
                  {advantage.description}
                </p>
              </div>
              <span className="font-editorial pointer-events-none absolute -right-4 -bottom-4 text-[120px] font-bold leading-none text-white/2 select-none">
                {advantage.num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
