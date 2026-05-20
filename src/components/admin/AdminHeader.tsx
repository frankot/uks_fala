"use client";

import { signOut } from "next-auth/react";

interface Props {
  userName?: string | null;
}

export default function AdminHeader({ userName }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-sand-200 bg-white px-6 lg:px-8">
      <div className="md:hidden flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-deep-700 flex items-center justify-center">
          <span className="text-[11px] font-bold text-white">UF</span>
        </div>
        <p className="text-[13px] font-bold text-sand-900">Admin</p>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="text-[13px] text-sand-600">{userName ?? "Admin"}</span>
        <a
          href="/admin/pomoc"
          className="rounded-lg border border-sand-200 px-3 py-1.5 text-[12px] font-semibold text-sand-500 transition-colors hover:bg-pool-50 hover:text-pool-700 hover:border-pool-300"
        >
          Pomoc
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="rounded-lg border border-sand-200 px-3 py-1.5 text-[12px] font-semibold text-sand-600 transition-colors hover:bg-sand-50 hover:text-sand-900"
        >
          Wyloguj
        </button>
      </div>
    </header>
  );
}
