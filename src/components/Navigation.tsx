"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "#o-nas", label: "O nas" },
  { href: "/zajecia", label: "Grafik" },
  { href: "#trenerzy", label: "Trenerzy" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-2 rounded left-0 right-0 z-50 max-w-[1240px] mx-auto  transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm shadow-deep-900/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-deep-700 transition-transform group-hover:scale-105">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 13c2-2.5 4-3.5 6-3.5s4 1 6 3.5 4 3.5 6 3.5 4-1 6-3.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M2 8c2-2.5 4-3.5 6-3.5s4 1 6 3.5 4 3.5 6 3.5 4-1 6-3.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className={`block text-[17px] font-bold tracking-tight transition-colors ${scrolled ? "text-deep-900" : "text-white"}`}>
                UKS Fala
              </span>
              <span className={`block text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${scrolled ? "text-sand-500" : "text-white/50"}`}>
                Nieporęt
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Nawigacja główna">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-all ${
                  scrolled
                    ? "text-sand-700 hover:bg-sand-100 hover:text-deep-700"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+48530077078"
              className={`text-[13px] font-semibold tracking-wide transition-colors ${
                scrolled ? "text-sand-600" : "text-white/60"
              }`}
            >
              530 077 078
            </a>
            <a
              href="#kontakt"
              className="inline-flex h-10 items-center rounded-full bg-coral-500 px-6 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20"
            >
              Zapisz dziecko
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden ${
              scrolled ? "text-sand-800 hover:bg-sand-100" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu nawigacji"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="border-t border-white/10 pb-5 pt-3 md:hidden" aria-label="Nawigacja mobilna">
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-3 px-4">
                <a
                  href="tel:+48530077078"
                  className="text-sm font-medium text-white/50"
                >
                  Tel: 530 077 078
                </a>
                <a
                  href="#kontakt"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-coral-500 text-[13px] font-bold uppercase tracking-wider text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Zapisz dziecko
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
