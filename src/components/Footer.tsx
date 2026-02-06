import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-deep-950 text-deep-200">
      {/* Grain */}
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-[1240px] px-5 py-16 sm:px-8 md:py-20">
        {/* Top — brand + tagline */}
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-deep-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2 13c2-2.5 4-3.5 6-3.5s4 1 6 3.5 4 3.5 6 3.5 4-1 6-3.5"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 8c2-2.5 4-3.5 6-3.5s4 1 6 3.5 4 3.5 6 3.5 4-1 6-3.5"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="leading-tight">
                <span className="block text-[17px] font-bold text-white">
                  UKS Fala
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-deep-400">
                  Nieporęt
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[15px] leading-[1.7] text-deep-300/60">
              Uczniowski Klub Sportowy Fala Nieporęt. Szkoła pływania i sekcja
              sportowa dla dzieci i młodzieży.
            </p>
          </div>

          {/* Social icons */}
          <div className="flex gap-3">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid gap-10 border-t border-deep-800/50 pt-12 sm:grid-cols-3">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-400">
              Nawigacja
            </h4>
            <ul className="mt-5 space-y-3">
              {[
                { href: "#o-nas", label: "O nas" },
                { href: "#grupy", label: "Grupy szkoleniowe" },
                { href: "#trenerzy", label: "Trenerzy" },
                { href: "#kontakt", label: "Kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-deep-300/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-400">
              Oferta
            </h4>
            <ul className="mt-5 space-y-3">
              <li><span className="text-[14px] text-deep-300/60">Szkoła pływania</span></li>
              <li><span className="text-[14px] text-deep-300/60">Sekcja sportowa</span></li>
              <li><span className="text-[14px] text-deep-300/60">Obozy i półkolonie</span></li>
              <li><span className="text-[14px] text-deep-300/60">Zajęcia indywidualne</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-deep-400">
              Kontakt
            </h4>
            <ul className="mt-5 space-y-3">
              <li>
                <a href="tel:+48530077078" className="text-[14px] text-deep-300/60 transition-colors hover:text-white">
                  530 077 078
                </a>
              </li>
              <li>
                <a href="mailto:biuro@uksfala.com.pl" className="text-[14px] text-deep-300/60 transition-colors hover:text-white">
                  biuro@uksfala.com.pl
                </a>
              </li>
              <li>
                <p className="text-[14px] text-deep-300/60">
                  ul. Koncertowa 4<br />
                  05-126 Stanisławów Pierwszy
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-deep-800/50 pt-8 sm:flex-row">
          <p className="text-[12px] text-deep-400/60">
            &copy; {new Date().getFullYear()} UKS Fala Nieporęt. Wszelkie prawa zastrzeżone.
          </p>
          <p className="text-[12px] text-deep-400/40">
            Polityka prywatności
          </p>
        </div>
      </div>
    </footer>
  );
}
