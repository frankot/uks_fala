import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroStrip from "@/components/HeroStrip";
import ContactLink from "@/components/ContactLink";

export const metadata: Metadata = {
  title: "O nas — UKS Fala Nieporęt",
  description:
    "Poznaj historię, misję i wartości klubu pływackiego UKS Fala Nieporęt. Od ponad dekady uczymy dzieci i młodzież pływania.",
};

const milestones = [
  {
    year: "2012",
    title: "Założenie klubu",
    description:
      "UKS Fala Nieporęt zostaje oficjalnie zarejestrowany. Pierwsze zajęcia na basenie OSiR w Nieporęcie z grupą kilkunastu dzieci.",
  },
  {
    year: "2014",
    title: "Pierwsze starty zawodnicze",
    description:
      "Nasi pływacy po raz pierwszy startują w zawodach rangi wojewódzkiej. Zdobywamy pierwsze medale i budujemy fundament sekcji sportowej.",
  },
  {
    year: "2016",
    title: "Rozwój sekcji sportowej",
    description:
      "Rozszerzamy ofertę o grupy zaawansowane i treningi przygotowujące do zawodów. Liczba pływaków w klubie przekracza 100.",
  },
  {
    year: "2019",
    title: "Licencja PZP",
    description:
      "Uzyskujemy pełną licencję Polskiego Związku Pływackiego, co umożliwia naszym zawodnikom starty na zawodach ogólnopolskich.",
  },
  {
    year: "2022",
    title: "Dekada działalności",
    description:
      "Świętujemy 10 lat istnienia klubu. Przez ten czas nauczyliśmy pływać setki dzieci z Nieporętu i okolic.",
  },
  {
    year: "2025",
    title: "Nowy rozdział",
    description:
      "Kontynuujemy rozwój — nowe grupy, nowoczesne metody szkolenia i jeszcze większy nacisk na indywidualne podejście do każdego pływaka.",
  },
];

const values = [
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
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Bezpieczeństwo",
    description:
      "Każde zajęcia prowadzone są przez wykwalifikowanych instruktorów z uprawnieniami ratowniczymi. Bezpieczeństwo dzieci jest naszym absolutnym priorytetem.",
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Indywidualne podejście",
    description:
      "Każde dziecko rozwija się we własnym tempie. Małe grupy pozwalają trenerom poświęcić uwagę każdemu uczestnikowi.",
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
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 7 12 7s5-3 7.5-3a2.5 2.5 0 0 1 0 5H18" />
        <path d="M6 9v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9" />
        <path d="M12 7v14" />
      </svg>
    ),
    title: "Radość z postępów",
    description:
      "Sport powinien dawać radość. Celebrujemy każdy sukces — od pierwszego zanurzenia twarzy po medal na zawodach.",
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
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Wychowanie przez sport",
    description:
      "Uczymy nie tylko pływania, ale i wartości: dyscypliny, wytrwałości, szacunku do rywali i pracy zespołowej.",
  },
];

export default function ONasPage() {
  return (
    <>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="O nas"
        tagColor="pool"
        title="Klub z pasją"
        subtitle="do pływania"
        description="Od ponad dekady uczymy dzieci i młodzież pływania w Nieporęcie. Poznaj naszą historię, misję i wartości, które nas napędzają."
      />

      {/* About intro — expanded */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid items-center gap-16 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7 md:pr-8">
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                UKS Fala Nieporęt
              </h2>
              <div className="mt-6 space-y-5">
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  <strong className="text-deep-500">
                    Uczniowski Klub Sportowy Fala Nieporęt
                  </strong>{" "}
                  to klub sportowy działający przy basenie OSiR
                  w&nbsp;Nieporęcie (ul.&nbsp;Koncertowa&nbsp;4, Stanisławów
                  Pierwszy). Jesteśmy licencjonowanym klubem zrzeszonym
                  w&nbsp;Polskim Związku Pływackim, co pozwala naszym zawodnikom
                  na starty w&nbsp;oficjalnych zawodach na każdym szczeblu.
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Prowadzimy naukę pływania dla dzieci od&nbsp;4 roku życia —
                  od&nbsp;pierwszego kontaktu z&nbsp;wodą, przez doskonalenie
                  techniki wszystkich stylów pływackich, aż po przygotowanie
                  sportowe do&nbsp;startów w&nbsp;zawodach. Nasza oferta
                  obejmuje grupy początkujące, średnio zaawansowane oraz sekcję
                  sportową.
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Łączymy profesjonalne szkolenie z&nbsp;wychowaniem przez
                  sport. Dla&nbsp;nas każde dziecko jest ważne — niezależnie
                  od&nbsp;poziomu umiejętności. Dbamy o&nbsp;to, by postępy
                  przychodziły z&nbsp;radością, motywacją i&nbsp;w&nbsp;pełnym
                  bezpieczeństwie.
                </p>
              </div>

              {/* Stats strip */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-deep-50 p-5 text-center">
                  <p className="font-editorial text-3xl font-bold text-deep-700">
                    10+
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-deep-500">
                    lat doświadczenia
                  </p>
                </div>
                <div className="rounded-2xl bg-deep-50 p-5 text-center">
                  <p className="font-editorial text-3xl font-bold text-deep-700">
                    200+
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-deep-500">
                    pływaków rocznie
                  </p>
                </div>
                <div className="rounded-2xl bg-deep-50 p-5 text-center">
                  <p className="font-editorial text-3xl font-bold text-deep-700">
                    6
                  </p>
                  <p className="mt-1 text-[13px] font-medium text-deep-500">
                    grup treningowych
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative md:col-span-5">
              <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-deep-50">
                <Image
                  src="/fala-about.jpg"
                  alt="Dzieci na zajęciach pływania w UKS Fala"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-deep-800 p-5 shadow-xl shadow-deep-900/20 md:-left-12">
                <p className="font-editorial text-3xl font-bold text-white">
                  PZP<span className="text-pool-400">.</span>
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-deep-200">
                  Licencjonowany klub
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="relative overflow-hidden bg-deep-900 py-20 md:py-28">
        <div className="grain absolute inset-0" />
        <div className="absolute top-0 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-pool-500/8 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-16 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-pool-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                Misja i wartości
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              W co wierzymy
              <span className="block text-deep-300">i&nbsp;jak działamy</span>
            </h2>
            <p className="mt-5 text-[17px] leading-[1.75] text-deep-200/60">
              Naszą misją jest zapewnienie każdemu dziecku dostępu
              do&nbsp;profesjonalnej nauki pływania w&nbsp;bezpiecznym
              i&nbsp;wspierającym środowisku.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-white/6 bg-white/3 p-8 backdrop-blur-sm transition-all hover:bg-white/6"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pool-500/10 text-pool-400 transition-colors group-hover:bg-pool-500/20">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-deep-200/60">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History / Timeline */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-16 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Historia
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Nasza droga
              <span className="block text-deep-500">przez lata</span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-sand-200 md:left-1/2 md:-translate-x-px" />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div
                  key={i}
                  className={`relative grid md:grid-cols-2 md:gap-12 ${
                    i % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-6 top-1 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2">
                    <div className="h-3 w-3 rounded-full bg-deep-500 ring-4 ring-sand-50" />
                  </div>

                  {/* Content — alternating sides on desktop */}
                  <div
                    className={`pl-14 md:pl-0 ${
                      i % 2 === 0
                        ? "md:col-start-1 md:text-right md:pr-12"
                        : "md:col-start-2 md:text-left md:pl-12"
                    }`}
                    style={{ direction: "ltr" }}
                  >
                    <span className="inline-block rounded-full bg-deep-50 px-3 py-1 text-[13px] font-bold text-deep-600">
                      {milestone.year}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-sand-950">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-[1.75] text-sand-500">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where we train */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Lokalizacja
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Gdzie trenujemy
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Nasze zajęcia odbywają się na basenie{" "}
                  <strong className="text-sand-800">
                    Ośrodka Sportu i&nbsp;Rekreacji w&nbsp;Nieporęcie
                  </strong>{" "}
                  (ul.&nbsp;Koncertowa&nbsp;4, Stanisławów Pierwszy).
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Basen dysponuje 25-metrowym torem pływackim z&nbsp;podziałem
                  na tory — idealne warunki zarówno do&nbsp;nauki, jak
                  i&nbsp;treningów sportowych.
                </p>
              </div>

              {/* Facility features */}
              <div className="mt-8 space-y-3">
                {[
                  "Basen 25m — 6 torów",
                  "Brodzik do nauki dla najmłodszych",
                  "Szatnie i prysznice",
                  "Parking dla rodziców",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-deep-500">
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

            {/* Map / image placeholder */}
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-deep-50">
              <iframe
                title="Lokalizacja basenu OSiR Nieporęt"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2432.5!2d21.07!3d52.41!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDI0JzM2LjAiTiAyMcKwMDQnMTIuMCJF!5e0!3m2!1spl!2spl!4v1"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
                Dołącz do UKS Fala
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-deep-200/60">
                Zapisy na nowy semestr są otwarte. Skontaktuj się z&nbsp;nami
                i&nbsp;dobierzemy najlepszą grupę dla Twojego dziecka.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <ContactLink className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:bg-coral-600 hover:shadow-coral-500/30 hover:-translate-y-0.5 sm:h-14">
                  Zapisz dziecko
                </ContactLink>
                <Link
                  href="/grafik"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-8 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 hover:text-white sm:h-14"
                >
                  Zobacz zajęcia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
