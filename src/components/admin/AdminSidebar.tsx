"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CMS_LINKS = [
  { label: "Grafik", tab: "grafik", icon: "calendar" },
  { label: "Aktualnosci", tab: "aktualnosci", icon: "news" },
  { label: "Osiagniecia", tab: "osiagniecia", icon: "trophy" },
  { label: "Trenerzy", tab: "trenerzy", icon: "users" },
  { label: "Obozy", tab: "obozy", icon: "camp" },
  { label: "Półkolonie", tab: "polkolonie", icon: "sun" },
];

function TabIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "calendar":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "news":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "trophy":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
          <path d="M4 22h16" />
          <path d="M10 22V8a4 4 0 0 0-4-4" />
          <path d="M14 22V8a4 4 0 0 1 4-4" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
        </svg>
      );
    case "users":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "camp":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 20h18" />
          <path d="m6 20 6-14 6 14" />
          <path d="M9 20h6" />
          <path d="M12 6v14" />
        </svg>
      );
    case "sun":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCmsActive = pathname.startsWith("/admin/cms");
  const currentTab = searchParams.get("tab") || "grafik";

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-sand-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-sand-200 px-6">
        <div className="h-8 w-8 rounded-lg bg-deep-700 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white">UF</span>
        </div>
        <div>
          <p className="text-[13px] font-bold text-sand-900">UKS Fala</p>
          <p className="text-[11px] text-sand-500">Panel admina</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-0.5">
        <p className="px-3 pt-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-sand-400">
          CMS
        </p>
        {CMS_LINKS.map((link) => {
          const active = isCmsActive && currentTab === link.tab;
          return (
            <Link
              key={link.tab}
              href={`/admin/cms?tab=${link.tab}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                active
                  ? "bg-deep-50 text-deep-700"
                  : "text-sand-600 hover:bg-sand-50 hover:text-sand-900"
              }`}
            >
              <TabIcon icon={link.icon} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
