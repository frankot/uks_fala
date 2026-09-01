import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroStrip from "@/components/HeroStrip";
import ContactLink from "@/components/ContactLink";

export const metadata: Metadata = {
  title: "Sekcja sportowa — UKS Fala Nieporęt",
  description:
    "Sekcja sportowa UKS Fala Nieporęt — regularny trening pływacki dla dzieci, które potrafią już pływać. Grafik treningów, grupy i składki członkowskie na rok 2026/2027.",
};

const develop = [
  "Technika",
  "Szybkość",
  "Wytrzymałość",
  "Sprawność ogólna",
];

const teach = [
  "Systematyczność",
  "Koncentracja",
  "Praca nad własnymi wynikami",
  "Zdrowa sportowa rywalizacja",
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
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      </svg>
    ),
    title: "Wytrwałość",
    description:
      "Wyniki w pływaniu biorą się z systematycznej pracy. Uczymy dzieci wracać na basen także wtedy, gdy jest trudno.",
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
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="m4.93 4.93 2.83 2.83" />
        <path d="m16.24 16.24 2.83 2.83" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <path d="m4.93 19.07 2.83-2.83" />
        <path d="m16.24 7.76 2.83-2.83" />
      </svg>
    ),
    title: "Samodzielność",
    description:
      "Zawodnik uczy się odpowiadać za swoje przygotowanie — sprzęt, rozgrzewkę, tempo pracy i własne cele startowe.",
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Współpraca",
    description:
      "Trenujemy indywidualnie, ale zawsze w drużynie. Klub to grupa, która kibicuje sobie na treningu i przy słupku startowym.",
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
    title: "Fair play",
    description:
      "Szacunek do rywala, trenera i własnej pracy. To zasada, która obowiązuje w wodzie i poza nią.",
  },
];

type Session = {
  time: string;
  label: string;
  type: "pool" | "gym";
};

type TrainingGroup = {
  num: string;
  name: string;
  audience: string;
  level: string | null;
  coach: string;
  /** Set when the coach has a published profile under /trenerzy. */
  coachSlug: string | null;
  days: { day: string; sessions: Session[] }[];
};

const groups: TrainingGroup[] = [
  {
    num: "01",
    name: "Grupa 1",
    audience: "Licealiści",
    level: "Najbardziej zaawansowana",
    coach: "Piotr Gałka",
    coachSlug: "piotr-galka",
    days: [
      {
        day: "Poniedziałek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "15:30 – 17:00", label: "Trening pływacki", type: "pool" },
        ],
      },
      {
        day: "Wtorek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "15:30 – 17:00", label: "Trening ogólnorozwojowy — siłownia", type: "gym" },
        ],
      },
      {
        day: "Środa",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "15:30 – 17:00", label: "Trening pływacki", type: "pool" },
        ],
      },
      {
        day: "Czwartek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "15:30 – 17:00", label: "Trening ogólnorozwojowy — siłownia", type: "gym" },
        ],
      },
      {
        day: "Piątek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "15:30 – 17:00", label: "Trening pływacki", type: "pool" },
        ],
      },
    ],
  },
  {
    num: "02",
    name: "Grupa 2",
    audience: "Klasy 6–8 szkoły podstawowej",
    level: null,
    coach: "Maciej Lewandowski",
    coachSlug: "maciek-lewandowski",
    days: [
      {
        day: "Poniedziałek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "16:00 – 17:30", label: "Trening motoryczny — siłownia", type: "gym" },
        ],
      },
      {
        day: "Wtorek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" },
        ],
      },
      {
        day: "Środa",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "16:00 – 17:30", label: "Trening motoryczny — siłownia", type: "gym" },
        ],
      },
      {
        day: "Czwartek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" },
        ],
      },
      {
        day: "Piątek",
        sessions: [
          { time: "6:15 – 7:45", label: "Trening poranny na basenie", type: "pool" },
          { time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" },
        ],
      },
    ],
  },
  {
    num: "03",
    name: "Grupa 3",
    audience: "Klasy 4–5 szkoły podstawowej",
    level: null,
    coach: "Marcin Stolarski",
    coachSlug: "marcin-stolarski",
    days: [
      {
        day: "Poniedziałek",
        sessions: [{ time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" }],
      },
      {
        day: "Wtorek",
        sessions: [{ time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" }],
      },
      {
        day: "Środa",
        sessions: [{ time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" }],
      },
      {
        day: "Czwartek",
        sessions: [{ time: "16:00 – 17:30", label: "Trening pływacki", type: "pool" }],
      },
      {
        day: "Piątek",
        sessions: [
          { time: "16:00 – 17:30", label: "Trening motoryczny — siłownia", type: "gym" },
        ],
      },
    ],
  },
  {
    num: "04",
    name: "Grupa 4",
    audience: "Klasy 2–3 szkoły podstawowej",
    level: null,
    coach: "Weronika Chowaniec",
    coachSlug: null,
    days: [
      {
        day: "Poniedziałek",
        sessions: [{ time: "16:00 – 17:00", label: "Trening pływacki", type: "pool" }],
      },
      {
        day: "Czwartek",
        sessions: [{ time: "16:00 – 17:00", label: "Trening pływacki", type: "pool" }],
      },
    ],
  },
];

const afternoonFees = [
  { frequency: "2× w tygodniu", price: "290 zł" },
  { frequency: "3× w tygodniu", price: "340 zł" },
  { frequency: "4× w tygodniu", price: "380 zł" },
  { frequency: "5× w tygodniu", price: "410 zł" },
];

const morningFees = [
  { frequency: "1× w tygodniu", price: "190 zł" },
  { frequency: "2× w tygodniu", price: "330 zł" },
  { frequency: "3× w tygodniu", price: "440 zł" },
  { frequency: "4× w tygodniu", price: "520 zł" },
  { frequency: "5× w tygodniu", price: "610 zł" },
];

const feeRules = [
  "Opłaty za zajęcia dokonuje się z góry do 5 dnia każdego miesiąca.",
  "Nieobecność na treningach nie zwalnia z konieczności uiszczenia składki członkowskiej.",
  "Nieobecności na zajęciach nie podlegają odrabianiu w innym terminie.",
  "Składki są wynikową wyliczenia średniej liczby zajęć w całym roku podzieloną na 10 miesięcy — bez względu na ferie albo dni wolne, co miesiąc opłata jest taka sama.",
  "Uczestnicy zajęć mają obowiązek terminowego odbywania badań sportowych i udostępniania klubowi aktualnego orzeczenia o zdolności do uprawiania sportu.",
  "Zniżki mogą przysługiwać zawodnikom za osiągane wyniki.",
];

export default function SekcjaSportowaPage() {
  return (
    <>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Sekcja sportowa"
        tagColor="pool"
        title="Trenuj. Startuj."
        subtitle="Rozwijaj się."
        description="Dla dzieci, które potrafią już pływać i chcą rozpocząć regularny trening sportowy."
      />

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid items-center gap-16 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-7 md:pr-8">
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Od pływania
                <span className="block text-deep-500">
                  do&nbsp;sportowej{" "}
                  <span className="text-pool-500">rywalizacji</span>
                </span>
              </h2>

              <div className="mt-6 space-y-5">
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Sekcja sportowa UKS FALA to&nbsp;kolejny etap rozwoju
                  dla&nbsp;dzieci, które chcą{" "}
                  <strong className="text-deep-500">doskonalić technikę</strong>,
                  trenować systematycznie i&nbsp;reprezentować klub podczas
                  zawodów pływackich.
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Trening to&nbsp;nie tylko kolejne długości basenu. Rozwijamy
                  technikę, szybkość, wytrzymałość i&nbsp;sprawność ogólną.
                  Uczymy systematyczności, koncentracji, pracy nad&nbsp;własnymi
                  wynikami i&nbsp;zdrowej sportowej rywalizacji.
                </p>
                <p className="text-[17px] leading-[1.8] text-sand-600">
                  Nasi trenerzy — byli zawodnicy i&nbsp;pasjonaci pływania —
                  wiedzą, jak prowadzić młodych sportowców, dostrzegać ich
                  potencjał i&nbsp;stawiać przed nimi kolejne, dopasowane
                  do&nbsp;możliwości wyzwania.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ContactLink className="inline-flex h-13 items-center justify-center rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral-500/30">
                  Dołącz do sekcji sportowej
                </ContactLink>
                <a
                  href="#grupy"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-sand-200 px-8 text-[15px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
                >
                  Sprawdź grupy treningowe
                </a>
              </div>

              <Link
                href="/trenerzy"
                className="group mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-deep-500 transition-colors hover:text-deep-700"
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
                  src="/fala-about.webp"
                  alt="Trening sekcji sportowej UKS Fala"
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-cover"
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

          {/* Co rozwijamy / Czego uczymy */}
          <div className="mt-20 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-500">
                Co rozwijamy
              </span>
              <div className="mt-5 flex flex-wrap gap-2">
                {develop.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-deep-50 px-4 py-2 text-[14px] font-semibold text-deep-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm">
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Czego uczymy
              </span>
              <div className="mt-5 flex flex-wrap gap-2">
                {teach.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-coral-50 px-4 py-2 text-[14px] font-semibold text-coral-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misja */}
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
              Odkrywamy potencjał.
              <span className="block text-deep-300">
                Rozwijamy zawodników.
              </span>
            </h2>
            <div className="mt-5 space-y-4">
              <p className="text-[17px] leading-[1.75] text-deep-200/60">
                Chcemy, aby dzieci czerpały radość z&nbsp;treningu
                i&nbsp;jednocześnie uczyły się tego, co&nbsp;w&nbsp;sporcie
                najważniejsze: wytrwałości, samodzielności, współpracy
                i&nbsp;zasad fair play.
              </p>
              <p className="text-[17px] leading-[1.75] text-deep-200/60">
                Dla&nbsp;jednych sekcja będzie początkiem przygody
                z&nbsp;zawodami. Dla&nbsp;innych — pierwszym etapem drogi
                do&nbsp;sportu wyczynowego. Każdemu chcemy stworzyć warunki
                do&nbsp;rozwoju i&nbsp;osiągania własnych sportowych celów.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
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

      {/* Grafik treningów */}
      <section id="grupy" className="scroll-mt-28 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Grupy treningowe
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
                Grafik
                <span className="block text-deep-500">treningów</span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-pool-500" />
                <span className="text-[14px] font-semibold text-sand-700">
                  Trening pływacki
                </span>
              </span>
              <span className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-coral-500" />
                <span className="text-[14px] font-semibold text-sand-700">
                  Siłownia
                </span>
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {groups.map((group) => (
              <article
                key={group.num}
                className="relative overflow-hidden rounded-3xl border border-sand-200 bg-white p-7 shadow-sm sm:p-8"
              >
                <span className="font-editorial pointer-events-none absolute -top-4 right-2 text-[90px] font-bold leading-none text-sand-100 select-none">
                  {group.num}
                </span>

                <div className="relative">
                  {group.level && (
                    <span className="inline-block rounded-full bg-deep-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-deep-600">
                      {group.level}
                    </span>
                  )}
                  <h3
                    className={`text-xl font-bold text-sand-950 ${group.level ? "mt-4" : ""}`}
                  >
                    {group.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-deep-500">
                    {group.audience}
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-[13px] text-sand-500">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Trener prowadzący:{" "}
                    {group.coachSlug ? (
                      <Link
                        href={`/trenerzy/${group.coachSlug}`}
                        className="font-semibold text-sand-800 underline decoration-sand-300 underline-offset-4 transition-colors hover:text-deep-500 hover:decoration-deep-400"
                      >
                        {group.coach}
                      </Link>
                    ) : (
                      <span className="font-semibold text-sand-800">
                        {group.coach}
                      </span>
                    )}
                  </p>
                </div>

                <div className="relative mt-6 space-y-3 border-t border-sand-200 pt-5">
                  {group.days.map((entry) => (
                    <div
                      key={entry.day}
                      className="flex flex-col gap-1.5 sm:flex-row sm:gap-4"
                    >
                      <span className="shrink-0 pt-0.5 text-[12px] font-bold uppercase tracking-[0.1em] text-sand-500 sm:w-28">
                        {entry.day}
                      </span>
                      <div className="flex-1 space-y-1.5">
                        {entry.sessions.map((session) => (
                          <div
                            key={session.time + session.label}
                            className="flex items-baseline gap-2.5"
                          >
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 self-start rounded-full ${
                                session.type === "gym"
                                  ? "bg-coral-500"
                                  : "bg-pool-500"
                              }`}
                            />
                            <span className="w-27 shrink-0 text-[14px] font-bold tabular-nums text-sand-900">
                              {session.time}
                            </span>
                            <span className="text-[14px] leading-[1.6] text-sand-600">
                              {session.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Składki */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-14 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Rok 2026/2027
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Składki
              <span className="block text-deep-500">członkowskie</span>
            </h2>
            <p className="mt-5 text-[17px] leading-[1.8] text-sand-600">
              Każdy członek klubu jest zobowiązany do&nbsp;wypełnienia
              deklaracji członkowskiej oraz — niezależnie od&nbsp;liczby
              treningów — do&nbsp;wpłaty stałej składki członkowskiej.
            </p>
          </div>

          {/* Składka administracyjna */}
          <div className="flex flex-col items-start gap-5 rounded-3xl bg-deep-900 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                Składka administracyjna
              </span>
              <p className="mt-3 text-[16px] leading-[1.7] text-deep-200/70">
                Stała, płatna jednorazowo w&nbsp;styczniu — obowiązuje każdego
                członka klubu.
              </p>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <p className="font-editorial text-4xl font-bold text-white">
                300 zł
              </p>
              <p className="mt-1 text-[13px] font-semibold text-deep-200/60">
                rocznie
              </p>
            </div>
          </div>

          {/* Cennik treningów */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Treningi popołudniowe",
                accent: "pool" as const,
                fees: afternoonFees,
              },
              {
                label: "Treningi poranne",
                accent: "coral" as const,
                fees: morningFees,
              },
            ].map((table) => (
              <div
                key={table.label}
                className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      table.accent === "pool" ? "bg-pool-500" : "bg-coral-500"
                    }`}
                  />
                  <h3 className="font-editorial text-xl font-bold text-sand-950">
                    {table.label}
                  </h3>
                </div>
                <dl className="mt-6 divide-y divide-sand-200">
                  {table.fees.map((fee) => (
                    <div
                      key={fee.frequency}
                      className="flex items-center justify-between py-3.5"
                    >
                      <dt className="text-[15px] font-medium text-sand-600">
                        {fee.frequency}
                      </dt>
                      <dd className="font-editorial text-xl font-bold text-deep-700">
                        {fee.price}
                        <span className="ml-1.5 text-[13px] font-semibold text-sand-500">
                          / mies.
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          {/* Mistrzostwa Polski */}
          <div className="mt-4 flex items-start gap-4 rounded-3xl border border-coral-200 bg-coral-50 px-7 py-6 sm:px-9">
            <span className="font-editorial mt-0.5 shrink-0 text-2xl font-bold text-coral-500">
              *
            </span>
            <p className="text-[15px] leading-[1.75] text-sand-700">
              Dla&nbsp;zawodników przygotowujących się
              do&nbsp;<strong className="text-coral-600">Mistrzostw Polski</strong>{" "}
              składki za&nbsp;treningi poranne wyliczane są indywidualnie —
              prosimy o&nbsp;kontakt z&nbsp;biurem.
            </p>
          </div>

          {/* Zasady */}
          <div className="mt-4 rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
            <h3 className="font-editorial text-xl font-bold text-sand-950">
              Zasady opłat
            </h3>
            <ul className="mt-5 grid gap-3.5 md:grid-cols-2 md:gap-x-10">
              {feeRules.map((rule) => (
                <li key={rule} className="flex gap-3">
                  <div className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pool-400" />
                  <span className="text-[15px] leading-[1.7] text-sand-600">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
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
                Gotowi na&nbsp;pierwszy start?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[17px] leading-[1.7] text-deep-200/60">
                Napisz do&nbsp;nas — dobierzemy grupę treningową dopasowaną
                do&nbsp;wieku i&nbsp;umiejętności Twojego dziecka.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <ContactLink className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral-500/30 sm:h-14">
                  Dołącz do sekcji sportowej
                </ContactLink>
                <Link
                  href="/osiagniecia"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-8 text-[15px] font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/5 hover:text-white sm:h-14"
                >
                  Nasze osiągnięcia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
