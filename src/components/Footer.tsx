import Image from "next/image";
import Link from "next/link";
import ContactLink from "./ContactLink";

const NAV_LINKS = [
  { href: "/o-nas", label: "O nas" },
  { href: "/grafik", label: "Grupy szkoleniowe" },
  { href: "/trenerzy", label: "Trenerzy" },
  { href: "/aktualnosci", label: "Aktualności" },
];

const OFFER_LINKS = [
  { href: "/szkola-plywania", label: "Szkoła pływania" },
  { href: "/sekcja-sportowa", label: "Sekcja sportowa" },
  { href: "/obozy", label: "Obozy" },
  { href: "/polkolonie", label: "Półkolonie" },
];

const linkClass =
  "text-[14px] text-deep-300/60 transition-colors hover:text-white";

const headingClass =
  "text-[11px] font-bold uppercase tracking-[0.2em] text-deep-400";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-deep-950 text-deep-200">
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-16 sm:px-8 md:py-20">
        {/* Row 1 — brand + contact */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <Link
              href="/"
              className="flex w-fit items-center gap-2.5"
              aria-label="UKS Fala Nieporęt"
            >
              <Image
                src="/logo-blue/fala-logo-only-transparent.png"
                alt=""
                width={43}
                height={50}
                className="h-16 w-auto"
              />
              <Image
                src="/logo-blue/fala-company-name-transparent.png"
                alt="UKS Fala Nieporęt"
                width={106}
                height={40}
                className="h-11 w-auto drop-shadow-[0_1px_4px_rgba(255,255,255,0.12)]"
              />
            </Link>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.7] text-deep-300/60">
              Uczniowski Klub Sportowy Fala Nieporęt. Szkoła pływania i sekcja
              sportowa dla dzieci i młodzieży.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            <div>
              <h4 className={headingClass}>Kontakt</h4>
              <div className="mt-5 space-y-2.5">
                <a href="tel:+48530077078" className={`block ${linkClass}`}>
                  +48 530 077 078
                </a>
                <a
                  href="mailto:biuro@uksfala.com.pl"
                  className={`block ${linkClass}`}
                >
                  biuro@uksfala.com.pl
                </a>
              </div>
              <p className="mt-5 text-[12px] leading-[1.7] text-deep-400/60">
                NIP 536 19 22 255
                <br />
                REGON 363628020
              </p>
            </div>

            <div>
              <h4 className={headingClass}>Adres</h4>
              <p className="mt-5 text-[14px] leading-[1.7] text-deep-300/60">
                Stanisławów Pierwszy
                <br />
                ul. Koncertowa 4
                <br />
                05-126 Nieporęt
              </p>
            </div>
          </div>
        </div>

        {/* Row 2 — navigation + offer + social */}
        <div className="mt-10 grid gap-10 border-t border-deep-800/50 pt-9 sm:grid-cols-2 md:grid-cols-4 md:gap-16">
          <div>
            <h4 className={headingClass}>Nawigacja</h4>
            <ul className="mt-5 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <ContactLink className={linkClass}>Kontakt</ContactLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={headingClass}>Oferta</h4>
            <ul className="mt-5 space-y-2.5">
              {OFFER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-[14px] text-deep-300/60">
                  Zajęcia indywidualne
                </span>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 md:col-start-4 md:col-span-1">
            <h4 className={headingClass}>Obserwuj</h4>
            <div className="mt-5 flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-deep-800/50 text-deep-300 transition-all hover:bg-deep-700 hover:text-white"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-deep-800/50 text-deep-300 transition-all hover:bg-deep-700 hover:text-white"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-deep-800/50 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-deep-400/60">
            &copy; {new Date().getFullYear()} UKS Fala Nieporęt. Wszelkie prawa
            zastrzeżone.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[12px] text-deep-400/40">Polityka prywatności</p>
            <p className="text-[12px] text-deep-400/40">Created by STRUS.DEV</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
