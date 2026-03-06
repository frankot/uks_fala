"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CMS_CHILDREN = [
  { label: "Grafik", tab: "grafik" },
  { label: "Aktualnosci", tab: "aktualnosci" },
  { label: "Osiagniecia", tab: "osiagniecia" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCmsActive = pathname.startsWith("/admin/cms");
  const [cmsOpen, setCmsOpen] = useState(isCmsActive);
  const currentTab = searchParams.get("tab") || "grafik";

  useEffect(() => {
    if (isCmsActive) setCmsOpen(true);
  }, [isCmsActive]);

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-sand-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-sand-200 px-6">
        <div className="h-8 w-8 rounded-lg bg-deep-700 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white">UF</span>
        </div>
        <div>
          <p className="text-[13px] font-bold text-sand-900">UKS Fala</p>
          <p className="text-[11px] text-sand-500">Panel admina</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {/* CMS collapsible */}
        <button
          onClick={() => setCmsOpen(!cmsOpen)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
            isCmsActive
              ? "bg-deep-50 text-deep-700"
              : "text-sand-600 hover:bg-sand-50 hover:text-sand-900"
          }`}
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          CMS
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform ${cmsOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {cmsOpen && (
          <div className="space-y-0.5">
            {CMS_CHILDREN.map((child) => {
              const active = isCmsActive && currentTab === child.tab;
              return (
                <Link
                  key={child.tab}
                  href={`/admin/cms?tab=${child.tab}`}
                  className={`flex items-center rounded-lg pl-10 pr-3 py-2 text-[13px] font-medium transition-colors ${
                    active
                      ? "text-deep-700 bg-deep-50/60"
                      : "text-sand-500 hover:bg-sand-50 hover:text-sand-700"
                  }`}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
}
