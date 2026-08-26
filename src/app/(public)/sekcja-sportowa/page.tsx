import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroStrip from "@/components/HeroStrip";
import ContactLink from "@/components/ContactLink";

export const metadata: Metadata = {
  title: "Sekcja sportowa — UKS Fala Nieporęt",
  description:
    "Sekcja sportowa UKS Fala Nieporęt — popularyzacja pływania, wszechstronny rozwój i przygotowanie do sportu wyczynowego. Nabór do nowych grup w sezonie 2025/2026.",
};

const pillars = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 7c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
        <path d="M2 17c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
      </svg>
    ),
    title: "Popularyzacja pływania",
    description:
      "Chcemy, by jak najwięcej dzieci pokochało wodę. Uczymy pływać dobrze, świadomie i bezpiecznie — to fundament, na którym budujemy wszystko inne.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 20.66l7.65-7.65.77-.78a5.4 5.4 0 0 0 0-7.65z" />
      </svg>
    ),
    title: "Sprawność i zdrowy styl życia",
    description:
      "Stawiamy na wszechstronny rozwój fizyczny i aktywne spędzanie czasu wolnego. Ruch ma być nawykiem na całe życie, nie obowiązkiem na jeden sezon.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    title: "Droga do sportu wyczynowego",
    description:
      "Przygotowujemy zawodników do startów i systematycznej pracy treningowej — krok po kroku, w tempie dopasowanym do wieku i możliwości dziecka.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 15s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Charakter i fair play",
    description:
      "Treningi, zawody i obozy kształtują coś więcej niż technikę — wytrwałość, szacunek do rywala i radość ze sportu, którą dzieci zabierają ze sobą na lata.",
  },
];

export default function SekcjaSportowaPage() {
  return (
    <>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Sekcja sportowa"
        tagColor="pool"
        title="Od pierwszych metrów"
        subtitle="do pierwszych medali"
        description="Popularyzujemy pływanie, podnosimy sprawność fizyczną i przygotowujemy młodych zawodników do sportu wyczynowego."
      />

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid items-center gap-16 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7 md:pr-8">
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Wszechstronny rozwój
                <span className="block text-deep-500">
                  i&nbsp;pasja do&nbsp;<span className="text-pool-500">ruchu</span>
                </span>
              </h2>

              <div className="mt-6 space-y-5">
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Naszym celem jest{" "}
                  <strong className="text-deep-500">
                    popularyzacja pływania
                  </strong>
                  , podnoszenie sprawności fizycznej i&nbsp;przygotowanie
                  do&nbsp;sportu wyczynowego. Stawiamy na&nbsp;wszechstronny
                  rozwój, aktywne spędzanie czasu wolnego i&nbsp;budowanie pasji
                  do&nbsp;ruchu.
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Nasi trenerzy — byli zawodnicy i&nbsp;pasjonaci pływania —
                  dzielą się doświadczeniem i&nbsp;inspirują do&nbsp;osiągania
                  coraz wyższych celów.
                </p>
              </div>

              <Link
                href="/trenerzy"
                className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-deep-500 transition-colors hover:text-deep-700"
              >
                Poznaj naszych trenerów
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
              </Link>
            </div>

            {/* Image */}
            <div className="relative md:col-span-5">
              <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-deep-50">
                <Image
                  src="/fala-about.jpg"
                  alt="Trening sekcji sportowej UKS Fala"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-deep-800 p-5 shadow-xl shadow-deep-900/20 md:-left-12">
                <p className="font-editorial text-3xl font-bold text-white">
                  Fair<span className="text-pool-400"> play</span>
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-deep-200">
                  w&nbsp;wodzie i&nbsp;poza nią
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misja / filary */}
      <section className="relative overflow-hidden bg-deep-900 py-20 md:py-28">
        <div className="grain absolute inset-0" />
        <div className="absolute top-0 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-pool-500/8 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-16 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-pool-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                Nasza misja
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              Odkrywamy talenty
              <span className="block text-deep-300">
                i&nbsp;mądrze prowadzimy kariery
              </span>
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-deep-200/60">
              Chcemy, aby dzieci przeżywały radość ze&nbsp;sportu, kształtowały
              charakter na&nbsp;treningach, zawodach i&nbsp;obozach oraz
              wyrastały w&nbsp;duchu fair play i&nbsp;zdrowego stylu życia.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl border border-white/6 bg-white/3 p-8 backdrop-blur-sm transition-all hover:bg-white/6"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pool-500/10 text-pool-400 transition-colors group-hover:bg-pool-500/20">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-deep-200/60">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nabór */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Nabór otwarty
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Nowe grupy w&nbsp;sezonie
                <span className="block text-deep-500">2025/2026</span>
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-sand-600">
                Prowadzimy nabór do&nbsp;<strong className="text-sand-800">nowych grup</strong>{" "}
                nauki i&nbsp;doskonalenia pływania. Zapraszamy dzieci, które
                chcą zacząć swoją przygodę z&nbsp;pływaniem — oraz te, które
                pływają już pewnie i&nbsp;szukają miejsca na&nbsp;kolejny krok.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Nauka pływania — pierwsze kroki w wodzie",
                  "Doskonalenie pływania — technika wszystkich stylów",
                  "Grupy prowadzone przez byłych zawodników",
                  "Treningi, zawody i obozy sportowe",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-500">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-[15px] font-medium text-sand-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zapisy card */}
            <div className="md:col-span-5">
              <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
                <span className="inline-block rounded-full bg-coral-50 px-3 py-1 text-[12px] font-bold uppercase tracking-[0.12em] text-coral-500">
                  Sezon 2025/2026
                </span>
                <h3 className="font-editorial mt-4 text-2xl font-bold leading-snug text-sand-950">
                  Zapisz dziecko do&nbsp;sekcji
                </h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-sand-500">
                  Napisz do&nbsp;nas — dobierzemy grupę odpowiednią
                  do&nbsp;wieku i&nbsp;umiejętności Twojego dziecka.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <ContactLink className="inline-flex h-13 items-center justify-center rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral-500/30">
                    Zapisz dziecko
                  </ContactLink>
                  <Link
                    href="/grafik"
                    className="inline-flex h-13 items-center justify-center rounded-full border border-sand-200 px-8 text-[15px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
                  >
                    Zobacz grafik zajęć
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-deep-900 p-10 text-center sm:p-16">
            <div className="grain absolute inset-0 rounded-4xl" />
            <div className="absolute -top-20 -right-20 h-[30vh] w-[30vh] rounded-full bg-coral-500/15 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-[25vh] w-[25vh] rounded-full bg-pool-500/10 blur-[80px]" />

            <div className="relative z-10">
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                Sport zaczyna się od&nbsp;radości
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-deep-200/60">
                Zobacz, co osiągnęli nasi zawodnicy — i&nbsp;dołącz
                do&nbsp;sekcji sportowej UKS Fala.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/osiagniecia"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral-500/30 sm:h-14"
                >
                  Nasze osiągnięcia
                </Link>
                <ContactLink className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-8 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 hover:text-white sm:h-14">
                  Skontaktuj się
                </ContactLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
