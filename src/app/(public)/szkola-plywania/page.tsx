import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import HeroStrip from "@/components/HeroStrip";
import ContactLink from "@/components/ContactLink";

export const metadata: Metadata = {
  title: "Szkoła pływania — UKS Fala Nieporęt",
  description:
    "Nauka i doskonalenie pływania dla dzieci na każdym poziomie — od podstaw po zaawansowane techniki. Zajęcia w grupach i indywidualne.",
};

const steps = [
  {
    number: "01",
    title: "Wybierz grupę według wieku",
    description:
      "W pierwszej kolejności wybierz grupę zgodną z wiekiem swojego dziecka — resztą zajmiemy się razem.",
  },
  {
    number: "02",
    title: "Zadzwonimy do Ciebie",
    description:
      "Na podstawie wywiadu i naszego doświadczenia zweryfikujemy, czy wybrana grupa jest odpowiednia.",
  },
  {
    number: "03",
    title: "Weryfikujemy na bieżąco",
    description:
      "Podczas zajęć instruktorzy oceniają umiejętności dzieci i w razie potrzeby zaproponują zmianę grupy.",
  },
];

const reasons = [
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
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Doświadczona kadra instruktorów",
    description:
      "Nasi instruktorzy to pasjonaci pływania z wieloletnim doświadczeniem. Każdy posiada certyfikaty potwierdzające umiejętności i wiedzę, a przede wszystkim potrafi stworzyć przyjazną i motywującą atmosferę na basenie.",
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
      "Każda osoba jest inna i ma swoje tempo nauki. Dostosowujemy zajęcia do potrzeb i umiejętności — niezależnie od tego, czy dziecko dopiero zaczyna przygodę z wodą, czy chce doskonalić technikę.",
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Bezpieczeństwo na pierwszym miejscu",
    description:
      "Bezpieczeństwo uczestników to nasz priorytet. Dysponujemy nowoczesnym sprzętem pływackim i stosujemy najwyższe standardy bezpieczeństwa, aby zapewnić komfort i spokój podczas nauki.",
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
        <path d="M4 20h16" />
        <path d="M4 20V10l8-6 8 6v10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
    title: "Dywersyfikacja zajęć",
    description:
      "Oprócz tradycyjnych lekcji pływania organizujemy półkolonie i obozy sportowe. Dla naszych zawodników prowadzimy też ćwiczenia ogólnorozwojowe, niezbędne do poprawy wyników w wodzie.",
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
    title: "Przyjazna atmosfera",
    description:
      "Nasza szkoła to nie tylko miejsce nauki, ale również społeczność pasjonatów pływania. Tworzymy wspierające otoczenie, w którym każdy znajdzie swoje miejsce i będzie mógł się rozwijać.",
  },
];

/**
 * Placeholder FAQ — swap the questions/answers once the client sends the real set.
 * The payment and absence entries carry over the copy from the old
 * "Płatności i nieobecności" section so nothing was lost in the change.
 */
const faq = [
  {
    question: "Od jakiego wieku dziecko może zacząć naukę pływania?",
    answer:
      "Zajęcia prowadzimy już od 3. roku życia — najmłodsi zaczynają od oswajania z wodą w kameralnych grupach. Grupę zawsze dobieramy do wieku i umiejętności dziecka.",
  },
  {
    question: "Jak wygląda płatność za zajęcia?",
    answer:
      "Płatności za szkolenie dokonuje się za cały semestr zajęć z góry. Na prośbę rodzica płatność może zostać rozłożona na raty — pierwsza rata jest płatna wraz z zapisem. Dla młodszego rodzeństwa przewidujemy 10% zniżki.",
  },
  {
    question: "Czy można odrobić nieobecność na zajęciach?",
    answer:
      "Tak, jeśli nieobecność została zgłoszona e-mailem. Wszystkie zajęcia można odrobić na podstawie zaświadczenia lekarskiego, a w pozostałych przypadkach uczestnik może odrobić jeden tydzień nieobecności w miesiącu. Zajęcia odpracowujemy w innych godzinach pracy szkółki, po wcześniejszej konsultacji.",
  },
  {
    question: "Jak zgłosić nieobecność dziecka?",
    answer:
      "Nieobecności zgłasza się w aplikacji, do której link rodzice otrzymują po zapisie dziecka na zajęcia. Nie przewidujemy zwrotu kosztów za nieobecności — czas na odrobienie mija z końcem trwania umowy.",
  },
  {
    question: "Co zabrać na pierwsze zajęcia?",
    answer:
      "Strój kąpielowy, czepek, okularki, klapki i ręcznik. Resztą sprzętu potrzebnego na zajęciach — makaronami, deskami czy płetwami — dysponuje klub.",
  },
  {
    question: "Czy rodzic może być obecny na zajęciach?",
    answer:
      "Tak, rodzice mogą obserwować zajęcia z widowni. Na płycie basenu przebywają wyłącznie instruktorzy i uczestnicy zajęć.",
  },
];

export default function SzkolaPlywaniaPage() {
  return (
    <>
      {/* Hero + photo straddling the dark hero and the section below */}
      <div className="relative z-20">
        <HeroStrip
          backHref="/"
          backLabel="Strona główna"
          tag="Szkoła pływania"
          tagColor="pool"
          title="Pływanie to"
          subtitle="nasza pasja"
          description="Rekreacyjne zajęcia na każdym poziomie — od pierwszego kontaktu z wodą, przez technikę wszystkich stylów, po profesjonalne treningi. W grupach i indywidualnie."
        />

        {/* Desktop — overlaps the hero edge, sits to the right of the copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
          <div className="mx-auto max-w-310 px-5 sm:px-8">
            <div className="flex justify-end">
              <div className="relative aspect-3/4 w-[300px] translate-y-[110px] overflow-hidden rounded-3xl bg-deep-800 shadow-2xl shadow-deep-950/50 ring-1 ring-white/10 xl:w-[350px]">
                <Image
                  src="/szkola-hero.webp"
                  alt="Dziecko nurkujące na zajęciach nauki pływania UKS Fala"
                  fill
                  loading="eager"
                  sizes="350px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet — same photo, pulled up over the hero edge */}
      <div className="relative z-20 -mt-10 px-5 sm:px-8 lg:hidden">
        <div className="mx-auto max-w-310">
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-deep-800 shadow-xl shadow-deep-950/30 sm:aspect-16/10">
            <Image
              src="/szkola-hero.webp"
              alt="Dziecko nurkujące na zajęciach nauki pływania UKS Fala"
              fill
              loading="eager"
              sizes="(min-width: 1240px) 1240px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Informacje ogólne */}
      <section className="py-20 md:py-28 lg:pt-36">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          {/* Heading + lead */}
          <div className="grid items-end gap-8 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-pool-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-500">
                  Informacje ogólne
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Naukę można poczuć
                <span className="block text-deep-500">
                  na własnej <span className="text-pool-500">skórze</span>
                </span>
              </h2>
            </div>

            <div className="md:col-span-6">
              <p className="text-[19px] leading-[1.7] text-sand-600">
                Pływanie to nasza pasja! Mimo że brzmi jak banał i&nbsp;wszyscy
                tak mówią, to u&nbsp;nas naprawdę można poczuć to
                na&nbsp;własnej skórze.
              </p>
            </div>
          </div>

          {/* Wide image */}
          <div className="relative mt-12">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-deep-50 sm:aspect-3/2 lg:aspect-16/9">
              <Image
                src="/szkola.webp"
                alt="Zajęcia szkoły pływania UKS Fala"
                fill
                sizes="(min-width: 1240px) 1240px, 100vw"
                className="object-cover"
              />
            </div>

            {/* Overlapping accent card */}
            <div className="absolute -bottom-6 left-5 rounded-2xl bg-deep-800 p-5 shadow-xl shadow-deep-900/20 sm:left-8 md:-left-6 md:p-6">
              <p className="font-editorial text-3xl font-bold text-white">
                Każdy<span className="text-pool-400"> poziom</span>
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-deep-200">
                od&nbsp;podstaw po&nbsp;treningi
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-12">
            <p className="text-[17px] leading-[1.8] text-sand-600">
              Szkoła Pływania to{" "}
              <strong className="text-deep-500">
                rekreacyjna forma zajęć na&nbsp;każdym poziomie
              </strong>{" "}
              — od&nbsp;podstaw po&nbsp;zaawansowane techniki pływackie
              i&nbsp;profesjonalne treningi. Oferujemy naukę zarówno
              w&nbsp;grupach, jak i&nbsp;w&nbsp;formie indywidualnej.
            </p>
            <p className="text-[17px] leading-[1.8] text-sand-600">
              Każdy poziom to inne cele. Dla&nbsp;początkujących najważniejsze
              jest pozbycie się lęku przed wodą, kolejne etapy
              to&nbsp;nauczenie prawidłowej techniki wszystkich naszych
              podopiecznych, aby w&nbsp;pełni i&nbsp;bezpiecznie mogli
              korzystać z&nbsp;dobroczynnych uroków wody.
            </p>
          </div>
        </div>
      </section>

      {/* Jak wybrać grupę */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-14 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Krok po kroku
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Jak wybrać grupę?
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm"
              >
                <span className="font-editorial text-3xl font-bold text-pool-300">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-bold text-sand-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-sand-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-pool-200/70 bg-pool-100/50 p-8 backdrop-blur-sm sm:p-10">
            <p className="text-[17px] leading-[1.8] text-sand-700">
              Mamy wiele grup i&nbsp;elastyczne podejście do&nbsp;dzieci — ich
              komfort oraz możliwość nauki i&nbsp;rozwoju są najważniejsze.
              W&nbsp;przypadku szybkich postępów proponujemy zmianę grupy
              i&nbsp;indywidualne rozwiązania, także w&nbsp;trakcie trwania
              semestru.
            </p>
            <Link
              href="/grafik"
              className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-deep-500 transition-colors hover:text-deep-700"
            >
              Zobacz grafik i dostępne grupy
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
        </div>
      </section>

      {/* Dlaczego warto */}
      <section className="relative overflow-hidden bg-deep-900 py-20 md:py-28">
        <div className="grain absolute inset-0" />
        <div className="absolute top-0 left-1/2 h-[50vh] w-[50vh] -translate-x-1/2 rounded-full bg-pool-500/8 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-16 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-pool-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                Dlaczego my
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-white">
              Dlaczego warto wybrać
              <span className="block text-deep-300">
                naszą Szkołę Pływania
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <div
                key={reason.title}
                className={`group relative overflow-hidden rounded-3xl border border-white/6 bg-white/3 p-8 backdrop-blur-sm transition-all hover:bg-white/6 ${
                  // odd count — center the last card in its own row
                  i === reasons.length - 1 && reasons.length % 2 === 1
                    ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)]"
                    : ""
                }`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pool-500/10 text-pool-400 transition-colors group-hover:bg-pool-500/20">
                  {reason.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{reason.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.75] text-deep-200/60">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-28">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-10 bg-coral-400" />
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                    FAQ
                  </span>
                </div>
                <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
                  Najczęstsze
                  <span className="block text-deep-500">pytania</span>
                </h2>
                <p className="mt-5 text-[17px] leading-[1.8] text-sand-600">
                  Nie znalazłeś odpowiedzi? Zadzwoń lub napisz do&nbsp;nas —
                  chętnie rozwiejemy wszystkie wątpliwości przed&nbsp;zapisem
                  dziecka.
                </p>
                <ContactLink className="mt-7 inline-flex h-13 items-center justify-center rounded-full border border-sand-300 bg-white px-8 text-[15px] font-semibold text-sand-700 transition-colors hover:bg-sand-50">
                  Zadaj pytanie
                </ContactLink>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="space-y-3">
                {faq.map((item) => (
                  <details
                    key={item.question}
                    name="faq"
                    className="group rounded-2xl border border-sand-200 bg-white px-6 py-1 shadow-sm transition-colors open:border-deep-200 sm:px-8"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-bold text-sand-950 transition-colors marker:content-none group-open:text-deep-600 hover:text-deep-500 [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sand-100 text-deep-500 transition-all group-open:rotate-45 group-open:bg-deep-50">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </summary>
                    <p className="border-t border-sand-200 py-5 text-[15px] leading-[1.8] text-sand-600">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zapisy */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Zapisy
                </span>
              </div>
              <h2 className="font-editorial text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold leading-[1.1] tracking-[-0.02em] text-sand-950">
                Zapisz dziecko
                <span className="block text-deep-500">na zajęcia</span>
              </h2>
              <p className="mt-6 text-[17px] leading-[1.8] text-sand-600">
                Zapisy przyjmujemy drogą mailową:{" "}
                <a
                  href="mailto:biuro@uksfala.com.pl"
                  className="font-semibold text-deep-500 underline decoration-deep-200 underline-offset-4 transition-colors hover:text-deep-700"
                >
                  biuro@uksfala.com.pl
                </a>{" "}
                lub przez formularz na&nbsp;stronie.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <ContactLink className="inline-flex h-13 items-center justify-center rounded-full bg-coral-500 px-8 text-[15px] font-bold text-white shadow-xl shadow-coral-500/20 transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral-500/30 sm:h-14">
                  Zapisz się online
                </ContactLink>
                <Link
                  href="/grafik"
                  className="inline-flex h-13 items-center justify-center rounded-full border border-sand-200 px-8 text-[15px] font-semibold text-sand-700 transition-colors hover:bg-sand-50 sm:h-14"
                >
                  Zobacz grafik zajęć
                </Link>
              </div>
            </div>

            {/* Dane do przelewu */}
            <div className="md:col-span-6">
              <div className="rounded-3xl bg-deep-900 p-8 sm:p-10">
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
                  Dane do przelewu
                </span>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                      Odbiorca
                    </p>
                    <p className="mt-1 text-[16px] font-bold text-white">
                      Uczniowski Klub Sportowy Fala Nieporęt
                    </p>
                    <p className="mt-1 text-[15px] leading-[1.7] text-deep-200/60">
                      Stanisławów Pierwszy, ul. Koncertowa 4
                      <br />
                      05-126 Nieporęt
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                      Numer konta
                    </p>
                    <p className="mt-1 font-mono text-[15px] leading-[1.6] font-bold tracking-wide text-white sm:text-[17px]">
                      32 1090 1014 0000 0001 4795 8889
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/8 pt-5">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                        NIP
                      </p>
                      <p className="mt-0.5 text-[15px] font-semibold text-white">
                        536 19 22 255
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-deep-300/50">
                        REGON
                      </p>
                      <p className="mt-0.5 text-[15px] font-semibold text-white">
                        363628020
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
