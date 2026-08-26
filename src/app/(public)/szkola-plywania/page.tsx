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

export default function SzkolaPlywaniaPage() {
  return (
    <>
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Szkoła pływania"
        tagColor="pool"
        title="Pływanie to"
        subtitle="nasza pasja"
        description="Rekreacyjne zajęcia na każdym poziomie — od pierwszego kontaktu z wodą, przez technikę wszystkich stylów, po profesjonalne treningi. W grupach i indywidualnie."
      />

      {/* Informacje ogólne */}
      <section className="py-20 md:py-28">
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

      {/* Płatności i nieobecności */}
      <section className="overflow-hidden bg-sand-100 py-20 md:py-28">
        <div className="mx-auto max-w-310 px-5 sm:px-8">
          <div className="mb-14 max-w-xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                Organizacja
              </span>
            </div>
            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Płatności
              <span className="block text-deep-500">
                i&nbsp;odrabianie zajęć
              </span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Płatności */}
            <div className="self-start rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-50 text-deep-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl font-bold text-sand-950">
                Płatności
              </h3>
              <p className="mt-4 text-[15px] leading-[1.8] text-sand-600">
                Płatności za szkolenie dokonuje się za&nbsp;cały semestr zajęć
                z&nbsp;góry. Na&nbsp;prośbę rodzica płatność może zostać
                rozłożona na&nbsp;raty — pierwsza rata jest płatna wraz
                z&nbsp;zapisem.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-coral-50 px-5 py-4">
                <span className="font-editorial text-2xl font-bold text-coral-500">
                  10%
                </span>
                <span className="text-[14px] font-semibold text-coral-600">
                  zniżki dla młodszego rodzeństwa
                </span>
              </div>
            </div>

            {/* Nieobecności */}
            <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-deep-50 text-deep-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="m9 16 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-editorial text-xl font-bold text-sand-950">
                Nieobecności
              </h3>
              <ul className="mt-4 space-y-3">
                {[
                  "Nieobecności można odrabiać, jeśli zostały zgłoszone e-mailem.",
                  "Wszystkie zajęcia można odrobić na podstawie zaświadczenia lekarskiego.",
                  "W innych przypadkach uczestnik może odrobić 1 tydzień nieobecności w miesiącu.",
                  "Zajęcia odpracowujemy w innych godzinach pracy szkółki, po wcześniejszej konsultacji.",
                  "Nie przewidujemy zwrotu kosztów za nieobecności — czas na odrobienie mija z końcem trwania umowy.",
                ].map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pool-400" />
                    <span className="text-[15px] leading-[1.7] text-sand-600">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl bg-sand-50 px-5 py-4 text-[14px] leading-[1.7] text-sand-600">
                Nieobecności należy zgłosić w&nbsp;aplikacji, do&nbsp;której link
                rodzice otrzymują po&nbsp;zapisie dziecka na&nbsp;zajęcia.
              </p>
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
