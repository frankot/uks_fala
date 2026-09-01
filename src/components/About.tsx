import Image from "next/image";
import Link from "next/link";

/**
 * The club's two tracks. Descriptions are lifted from each page's own hero copy
 * so the card and the page it opens do not describe the same thing differently.
 */
const PATHS = [
  {
    num: "01",
    href: "/szkola-plywania",
    title: "Szkoła pływania",
    description:
      "Od pierwszego kontaktu z wodą, przez technikę wszystkich stylów, po zajęcia indywidualne. Rekreacyjnie, na każdym poziomie.",
    cta: "Poznaj szkołę pływania",
    accent: "bg-pool-500/12 text-pool-500",
    link: "text-pool-500",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 7c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
        <path d="M2 17c.6.5 1.2 1 2.5 1s1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1 1.2 1 2.5 1 1.9-.5 2.5-1 1.2-1 2.5-1 1.9.5 2.5 1" />
      </svg>
    ),
  },
  {
    num: "02",
    href: "/sekcja-sportowa",
    title: "Sekcja sportowa",
    description:
      "Dla dzieci, które pływają już swobodnie i chcą zacząć regularny trening sportowy oraz starty w zawodach.",
    cta: "Poznaj sekcję sportową",
    accent: "bg-coral-500/12 text-coral-500",
    link: "text-coral-600",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="o-nas" className="relative pt-24 pb-14 md:pt-10 md:pb-20">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="grid items-center gap-16 md:grid-cols-12 md:gap-12">
          {/* Left — text (takes more space, asymmetric) */}
          <div className="md:col-span-7 md:pr-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-coral-400" />
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                O klubie
              </span>
            </div>

            <h2 className="font-editorial text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.08] tracking-[-0.02em] text-sand-950">
              Pływanie, które daje dzieciom
              <span className="block text-deep-500">
                coś{" "}
                <span className="text-pool-500">więcej</span>
                {" "} <br />niż umiejętności
                <span className="text-pool-400">.</span>
              </span>
            </h2>

            <div className="mt-8 space-y-5">
              <p className="text-[17px] leading-[1.75] text-sand-600">
       W UKS Fala Nieporęt od ponad 10 lat pomagamy dzieciom oswoić wodę, rozwijać pewność siebie i odkrywać sportową pasję - od pierwszych zajęć po sekcję zawodniczą i starty w zawodach.
              </p>
              <p className="text-[17px] leading-[1.75] text-sand-600">
   Tworzymy miejsce, w którym liczy się nie tylko technika, ale też atmosfera, relacje i radość z treningów. Profesjonalni trenerzy, nowoczesny program i podejście dopasowane do każdego dziecka sprawiają, że nasi zawodnicy rosną nie tylko jako pływacy, ale też jako młodzi ludzie.
Bezpiecznie. Mądrze. Z pasją. <br />Tak buduje się miłość do sportu na lata.
              </p>
            </div>

            <Link
              href="/o-nas"
              className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-deep-500 transition-colors hover:text-deep-700"
            >
              Dowiedz się więcej o klubie
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

            {/* Credential strip */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full bg-deep-50 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-deep-500">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-deep-800">
                  Polski Związek Pływacki
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-full bg-sand-100 px-4 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sand-800">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] font-semibold text-sand-800">
                  Licencjonowany klub
                </span>
              </div>
            </div>
          </div>

          {/* Right — image composition */}
          <div className="relative md:col-span-5">
            {/* Main image placeholder */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-deep-50">
              <Image
                src="/about1.webp"
                alt="Dzieci na zajęciach pływania"
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover"
              />
            </div>

            {/* Overlapping accent card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-deep-800 p-5 shadow-xl shadow-deep-900/20 md:-left-12">
              <p className="font-editorial text-3xl font-bold text-white">
                10<span className="text-pool-400">+</span>
              </p>
              <p className="mt-0.5 text-[13px] font-medium text-deep-200">
                lat z&nbsp;młodymi pływakami
              </p>
            </div>
          </div>
        </div>

        {/* Dwie ścieżki — same eyebrow + card idiom as the rest of the page */}
        <div className="mt-20 md:mt-28">
          <div className="mb-10 flex items-center gap-3">
            <div className="h-px w-10 bg-pool-400" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-500">
              Dwie ścieżki
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {PATHS.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-sand-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-deep-900/8 sm:p-10"
              >
                {/* Ghost numeral, as on the Advantages cards. */}
                <span
                  aria-hidden="true"
                  className="font-editorial pointer-events-none absolute -right-4 -bottom-6 text-[120px] font-bold leading-none text-sand-950/[0.035] select-none"
                >
                  {path.num}
                </span>

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${path.accent}`}
                >
                  {path.icon}
                </div>

                <h3 className="font-editorial relative z-10 mt-6 text-[1.6rem] font-bold leading-[1.15] tracking-[-0.02em] text-sand-950">
                  {path.title}
                </h3>
                <p className="relative z-10 mt-3 max-w-sm text-[15px] leading-[1.7] text-sand-500">
                  {path.description}
                </p>

                <span
                  className={`relative z-10 mt-7 inline-flex items-center gap-2 text-[14px] font-bold ${path.link}`}
                >
                  {path.cta}
                  <svg
                    width="15"
                    height="15"
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
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
