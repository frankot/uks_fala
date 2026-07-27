"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactLink from "./ContactLink";

const navLinks = [
  { href: "/o-nas", label: "O nas" },
  { href: "/aktualnosci", label: "Aktualnosci" },
  { href: "/osiagniecia", label: "Osiagniecia" },
  { href: "/zajecia", label: "Zajęcia" },
  { href: "/trenerzy", label: "Trenerzy" },
];

const tripLinks = [
  { href: "/obozy", label: "Obozy" },
  { href: "/polkolonie", label: "Półkolonie" },
];

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tripsOpen, setTripsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const scrolled = isHome ? scrollY > 40 : true;

  const solidNav = scrolled || mobileOpen;

  return (
    <header
      className={`fixed left-3 right-3 top-2 z-50 mx-auto max-w-[1240px] rounded transition-all duration-300 sm:left-4 sm:right-4 ${
        solidNav
          ? "bg-white/90 shadow-sm shadow-deep-900/5 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between md:h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="UKS Fala Nieporęt"
          >
            <Image
              src="/logo-black/fala-symbol-transparent.png"
              alt=""
              width={43}
              height={50}
              priority
              className="h-12 w-auto transition-transform group-hover:scale-105 md:h-14"
            />
            <Image
              src="/logo-black/fala-wordmark-transparent.png"
              alt="UKS Fala Nieporęt"
              width={106}
              height={40}
              priority
              className="h-8 w-auto transition-all md:h-9"
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Nawigacja główna"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-[14px] font-medium transition-all ${
                  solidNav
                    ? "text-sand-700 hover:bg-sand-100 hover:text-deep-700"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="group relative">
              <button
                type="button"
                className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-[14px] font-medium transition-all ${
                  solidNav
                    ? "text-sand-700 hover:bg-sand-100 hover:text-deep-700"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }`}
                aria-haspopup="menu"
              >
                Wyjazdy
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:rotate-180"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full min-w-44 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white p-2 shadow-xl shadow-deep-900/10">
                  {tripLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-4 py-2.5 text-[14px] font-medium text-sand-700 transition-colors hover:bg-sand-100 hover:text-deep-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <ContactLink
              className={`rounded-full px-3 py-2 text-[14px] font-medium transition-all ${
                solidNav
                  ? "text-sand-700 hover:bg-sand-100 hover:text-deep-700"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              Kontakt
            </ContactLink>
          </nav>

          {/* Desktop right */}
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+48530077078"
              className={`text-[13px] font-semibold tracking-wide transition-colors ${
                solidNav ? "text-sand-600" : "text-white/65"
              }`}
            >
              +48 530 077 078
            </a>
            <Link
              href="/zajecia"
              className="inline-flex h-10 items-center rounded-full bg-coral-500 px-6 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20"
            >
              Zapisz dziecko
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden ${
              solidNav
                ? "text-sand-800 hover:bg-sand-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu nawigacji"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
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
          <nav
            className="border-t border-deep-900/10 pb-5 pt-3 md:hidden"
            aria-label="Nawigacja mobilna"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-sand-700 transition-colors hover:bg-sand-100 hover:text-deep-700"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-left text-[15px] font-medium text-sand-700 transition-colors hover:bg-sand-100 hover:text-deep-700"
                onClick={() => setTripsOpen((open) => !open)}
                aria-expanded={tripsOpen}
              >
                Wyjazdy
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${tripsOpen ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {tripsOpen && (
                <div className="ml-4 flex flex-col border-l border-sand-200 pl-3">
                  {tripLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-xl px-4 py-2.5 text-[14px] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-deep-700"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <ContactLink
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-sand-700 transition-colors hover:bg-sand-100 hover:text-deep-700"
                onClick={() => setMobileOpen(false)}
              >
                Kontakt
              </ContactLink>

              <div className="mt-3 flex flex-col gap-3 px-4">
                <a
                  href="tel:+48530077078"
                  className="text-sm font-medium text-sand-500"
                >
                  Tel: +48 530 077 078
                </a>
                <ContactLink
                  className="inline-flex h-11 items-center justify-center rounded-full bg-coral-500 text-[13px] font-bold uppercase tracking-wider text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Zapisz dziecko
                </ContactLink>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
