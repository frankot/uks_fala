import Link from "next/link";

const SUGGESTIONS = [
  { href: "/grafik", label: "Plan zajęć" },
  { href: "/szkola-plywania", label: "Szkoła pływania" },
  { href: "/aktualnosci", label: "Aktualności" },
  { href: "/trenerzy", label: "Trenerzy" },
];

/**
 * Shared body of the 404 page. Kept separate from the route files because the
 * root `not-found.tsx` sits above the (public) layout and has to bring its own
 * navigation, while the one inside the group inherits it — same UI, two frames.
 */
export default function NotFoundContent() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-sand-50 px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-lg text-center">
        <p
          aria-hidden="true"
          className="font-editorial text-[clamp(5rem,18vw,9rem)] font-bold leading-none tracking-[-0.03em] text-deep-100 select-none"
        >
          404
        </p>

        <div className="mx-auto -mt-3 mb-7 h-px w-16 bg-pool-400" />

        <h1 className="font-editorial text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-sand-950">
          Tej strony tu nie ma
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.7] text-sand-500">
          Być może adres jest nieaktualny albo strona została przeniesiona.
          Sprawdź poniższe skróty lub wróć na stronę główną.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex h-13 w-full items-center justify-center rounded-xl bg-coral-500 px-7 text-[15px] font-bold text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20 sm:w-auto"
          >
            Strona główna
          </Link>
          <Link
            href="/#kontakt"
            className="flex h-13 w-full items-center justify-center rounded-xl border-2 border-sand-200 px-7 text-[15px] font-bold text-sand-700 transition-colors hover:border-sand-300 hover:bg-sand-100 sm:w-auto"
          >
            Kontakt
          </Link>
        </div>

        <nav
          aria-label="Popularne strony"
          className="mt-10 border-t border-sand-200 pt-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-400">
            Może szukasz
          </p>
          <ul className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-full bg-white px-4 py-2 text-[13px] font-bold text-sand-700 ring-1 ring-sand-200 transition-colors hover:bg-sand-100 hover:text-deep-700 hover:ring-sand-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
