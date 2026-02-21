# /zajecia Schedule & Reservation Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/zajecia` page with a weekly training schedule table, group highlighting, per-frequency pricing, and a Resend-powered reservation form; update TrainingGroups.tsx button to link there.

**Architecture:** Four parts — (1) button change in TrainingGroups.tsx, (2) a server-wrapper `zajecia/page.tsx`, (3) a large `"use client"` SchedulePage.tsx holding all interactivity (group selector, frequency toggle, schedule table, reservation form), and (4) a `/api/send` Route Handler that calls Resend. Selected group is passed via URL search param `?group=<name>`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript, Resend SDK (`resend` npm package).

---

### Task 1: Install Resend & add env placeholder

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.local`

**Step 1: Install Resend SDK**

```bash
npm install resend
```

Expected: `resend` added to `node_modules` and `package.json` dependencies.

**Step 2: Create `.env.local` with placeholder key**

Create file `/Users/franciszek/Documents/dev/next/uks_fala/.env.local`:

```env
RESEND_API_KEY=re_REPLACE_WITH_YOUR_KEY
```

**Step 3: Verify build still passes**

```bash
npm run build
```

Expected: Build succeeds (or only pre-existing warnings).

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install resend SDK"
```

Note: Do NOT commit `.env.local` — it's already in `.gitignore`.

---

### Task 2: Create the Resend API Route

**Files:**
- Create: `src/app/api/send/route.ts`

**Step 1: Create the file with this exact content**

```ts
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, phone, group, frequency, message } = await req.json();

  if (!name || !email || !group || !frequency) {
    return NextResponse.json({ error: "Brakujące pola" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Formularz UKS Fala <formularz@uksfala.com.pl>",
    to: ["biuro@uksfala.com.pl"],
    subject: `Rezerwacja miejsca — ${group}`,
    html: `
      <h2>Nowe zgłoszenie rezerwacji</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px">
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Imię i nazwisko</td><td style="padding:8px;background:#faf9f7">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">E-mail</td><td style="padding:8px;background:#faf9f7">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Telefon</td><td style="padding:8px;background:#faf9f7">${phone || "—"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wybrana grupa</td><td style="padding:8px;background:#faf9f7">${group}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Treningi / tydzień</td><td style="padding:8px;background:#faf9f7">${frequency}×</td></tr>
        <tr><td style="padding:8px;font-weight:bold;background:#f5f3f0">Wiadomość</td><td style="padding:8px;background:#faf9f7">${message || "—"}</td></tr>
      </table>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Błąd wysyłki" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

**Step 2: Verify TypeScript compiles**

```bash
npm run build
```

Expected: No new TypeScript errors.

**Step 3: Commit**

```bash
git add src/app/api/send/route.ts
git commit -m "feat: add /api/send route handler via Resend"
```

---

### Task 3: Create shared schedule + pricing data

**Files:**
- Create: `src/lib/schedule.ts`

This file is imported by both SchedulePage and (later) potentially by a static schedule component. Keeping data separate from UI is clean.

**Step 1: Create `src/lib/schedule.ts`**

```ts
export type Slot = {
  group: string;
  day: number; // 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat
  hour: string; // "HH:MM"
};

export const DAYS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

export const TIME_SLOTS = [
  "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

// Placeholder schedule — edit times/days freely
export const SCHEDULE: Slot[] = [
  // Krewetki (01) — Mon, Wed 16:00
  { group: "Krewetki", day: 0, hour: "16:00" },
  { group: "Krewetki", day: 2, hour: "16:00" },

  // Neonki (02) — Tue, Thu 16:00
  { group: "Neonki", day: 1, hour: "16:00" },
  { group: "Neonki", day: 3, hour: "16:00" },

  // Koniki Morskie (03) — Mon, Wed 16:30, Sat 09:00 → mapped to 15:30 placeholder
  { group: "Koniki Morskie", day: 0, hour: "16:30" },
  { group: "Koniki Morskie", day: 2, hour: "16:30" },
  { group: "Koniki Morskie", day: 5, hour: "15:30" },

  // Płotki (04) — Tue, Thu 16:30, Sat 16:00
  { group: "Płotki", day: 1, hour: "16:30" },
  { group: "Płotki", day: 3, hour: "16:30" },
  { group: "Płotki", day: 5, hour: "16:00" },

  // Okonki (05) — Mon, Wed 17:00, Fri 16:30
  { group: "Okonki", day: 0, hour: "17:00" },
  { group: "Okonki", day: 2, hour: "17:00" },
  { group: "Okonki", day: 4, hour: "16:30" },

  // Delfiny (06) — Tue, Thu 17:00, Fri 17:00
  { group: "Delfiny", day: 1, hour: "17:00" },
  { group: "Delfiny", day: 3, hour: "17:00" },
  { group: "Delfiny", day: 4, hour: "17:00" },

  // Barrakudy (07) — Mon, Wed 17:30, Fri 17:30, Sat 16:30
  { group: "Barrakudy", day: 0, hour: "17:30" },
  { group: "Barrakudy", day: 2, hour: "17:30" },
  { group: "Barrakudy", day: 4, hour: "17:30" },
  { group: "Barrakudy", day: 5, hour: "16:30" },

  // Rekiny (08) — Mon–Fri 18:00, Sat 18:00
  { group: "Rekiny", day: 0, hour: "18:00" },
  { group: "Rekiny", day: 1, hour: "18:00" },
  { group: "Rekiny", day: 2, hour: "18:00" },
  { group: "Rekiny", day: 3, hour: "18:00" },
  { group: "Rekiny", day: 4, hour: "18:00" },
  { group: "Rekiny", day: 5, hour: "18:00" },
];

// Prices in PLN per month. Only list valid frequencies per group.
export const PRICES: Record<string, Partial<Record<1 | 2 | 3, number>>> = {
  "Krewetki":       { 1: 173, 2: 290 },
  "Neonki":         { 1: 173, 2: 290 },
  "Koniki Morskie": { 1: 220, 2: 310 },
  "Płotki":         { 1: 220, 2: 310 },
  "Okonki":         { 2: 310, 3: 360 },
  "Delfiny":        { 2: 310, 3: 360 },
  "Barrakudy":      { 2: 350, 3: 408 },
  "Rekiny":         { 3: 408 },
};

// Group color accents (matching TrainingGroups.tsx badge colors)
export const GROUP_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "Krewetki":       { bg: "bg-pool-100",   text: "text-deep-600",  ring: "ring-pool-300" },
  "Neonki":         { bg: "bg-pool-100",   text: "text-deep-600",  ring: "ring-pool-300" },
  "Koniki Morskie": { bg: "bg-deep-100",   text: "text-deep-700",  ring: "ring-deep-300" },
  "Płotki":         { bg: "bg-deep-100",   text: "text-deep-700",  ring: "ring-deep-300" },
  "Okonki":         { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Delfiny":        { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Barrakudy":      { bg: "bg-coral-100",  text: "text-coral-600", ring: "ring-coral-300" },
  "Rekiny":         { bg: "bg-deep-800",   text: "text-white",     ring: "ring-deep-500" },
};
```

**Step 2: Verify TypeScript**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add src/lib/schedule.ts
git commit -m "feat: add schedule, pricing, and color data"
```

---

### Task 4: Create the SchedulePage client component

**Files:**
- Create: `src/app/zajecia/SchedulePage.tsx`

This is the largest task. The component handles: group selection, frequency selection, schedule table, and reservation form.

**Step 1: Create `src/app/zajecia/SchedulePage.tsx`**

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  SCHEDULE, PRICES, GROUP_COLORS, DAYS, TIME_SLOTS,
} from "@/lib/schedule";

const GROUPS = [
  { num: "01", name: "Krewetki",       age: "3–5 lat" },
  { num: "02", name: "Neonki",         age: "4–6 lat" },
  { num: "03", name: "Koniki Morskie", age: "5–7 lat" },
  { num: "04", name: "Płotki",         age: "6–8 lat" },
  { num: "05", name: "Okonki",         age: "7–9 lat" },
  { num: "06", name: "Delfiny",        age: "8–10 lat" },
  { num: "07", name: "Barrakudy",      age: "9–12 lat" },
  { num: "08", name: "Rekiny",         age: "11–15 lat" },
];

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get("group") ?? "Krewetki";

  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [frequency, setFrequency] = useState<1 | 2 | 3>(1);

  // Sync frequency to first available option when group changes
  useEffect(() => {
    const available = PRICES[selectedGroup] ?? {};
    const freqs = [1, 2, 3] as const;
    const first = freqs.find((f) => available[f] !== undefined) ?? 1;
    setFrequency(first);
  }, [selectedGroup]);

  const availableFreqs = PRICES[selectedGroup] ?? {};
  const currentPrice = availableFreqs[frequency];
  const colors = GROUP_COLORS[selectedGroup];

  // Form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, group: selectedGroup, frequency }),
      });
      if (res.ok) {
        setStatus("ok");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero strip */}
      <div className="relative overflow-hidden bg-deep-900 pt-28 pb-16">
        <div className="grain absolute inset-0" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pool-500/10 blur-[80px]" />
        <div className="absolute -bottom-10 left-20 h-40 w-40 rounded-full bg-coral-500/10 blur-[60px]" />
        <div className="relative z-10 mx-auto max-w-[1240px] px-5 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-deep-200/50 transition-colors hover:text-deep-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Strona główna
          </Link>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px w-10 bg-pool-400" />
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-pool-400">
              Harmonogram
            </span>
          </div>
          <h1 className="font-editorial mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.06] tracking-[-0.02em] text-white">
            Plan zajęć
            <span className="block text-pool-300">UKS Fala</span>
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.7] text-deep-200/60">
            Wybierz grupę i liczbę treningów, aby zobaczyć harmonogram i cenę miesięczną.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10">

          {/* ——— SIDEBAR ——— */}
          <aside className="mb-10 lg:mb-0">
            <div className="sticky top-24 space-y-8">

              {/* Group selector */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                  Wybierz grupę
                </p>
                <div className="flex flex-col gap-2">
                  {GROUPS.map((g) => {
                    const isActive = g.name === selectedGroup;
                    const c = GROUP_COLORS[g.name];
                    return (
                      <button
                        key={g.name}
                        onClick={() => setSelectedGroup(g.name)}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                          isActive
                            ? "border-deep-700 bg-deep-700 shadow-md shadow-deep-900/10"
                            : "border-sand-200 bg-white hover:border-deep-300 hover:bg-sand-50"
                        }`}
                      >
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          isActive ? "bg-white/15 text-white" : `${c.bg} ${c.text}`
                        }`}>
                          {g.num}
                        </span>
                        <div className="min-w-0">
                          <p className={`truncate text-[14px] font-bold ${isActive ? "text-white" : "text-sand-900"}`}>
                            {g.name}
                          </p>
                          <p className={`text-[12px] ${isActive ? "text-deep-200" : "text-sand-500"}`}>
                            {g.age}
                          </p>
                        </div>
                        {isActive && (
                          <svg className="ml-auto shrink-0 text-pool-300" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency selector */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                  Treningi / tydzień
                </p>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((f) => {
                    const available = availableFreqs[f] !== undefined;
                    const isActive = frequency === f;
                    return (
                      <button
                        key={f}
                        disabled={!available}
                        onClick={() => available && setFrequency(f)}
                        className={`flex-1 rounded-xl py-3 text-[15px] font-bold transition-all ${
                          isActive
                            ? "bg-coral-500 text-white shadow-md shadow-coral-500/20"
                            : available
                            ? "border-2 border-sand-200 bg-white text-sand-700 hover:border-coral-300"
                            : "border-2 border-sand-100 bg-sand-50 text-sand-300 cursor-not-allowed"
                        }`}
                      >
                        {f}×
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price display */}
              <div className="rounded-2xl bg-deep-50 border border-deep-100 px-6 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-deep-400 mb-1">
                  Cena miesięczna
                </p>
                {currentPrice ? (
                  <p className="font-editorial text-[2.5rem] font-bold leading-none text-deep-800">
                    {currentPrice}{" "}
                    <span className="text-[1.2rem] font-semibold text-deep-400">zł</span>
                  </p>
                ) : (
                  <p className="text-[15px] text-sand-500">
                    Wybierz dostępną częstotliwość
                  </p>
                )}
                <p className="mt-2 text-[12px] text-sand-500">
                  Ceny orientacyjne, mogą ulec zmianie.
                </p>
              </div>

            </div>
          </aside>

          {/* ——— SCHEDULE TABLE ——— */}
          <div>
            <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white shadow-sm">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-sand-200">
                    <th className="sticky left-0 z-10 bg-sand-50 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400 w-[80px]">
                      Godzina
                    </th>
                    {DAYS.map((day) => (
                      <th key={day} className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((hour, rowIdx) => (
                    <tr
                      key={hour}
                      className={`border-b border-sand-100 ${rowIdx % 2 === 0 ? "bg-white" : "bg-sand-50/50"}`}
                    >
                      <td className="sticky left-0 z-10 bg-inherit px-4 py-3 text-[12px] font-bold text-sand-500">
                        {hour}
                      </td>
                      {DAYS.map((_, dayIdx) => {
                        const slots = SCHEDULE.filter(
                          (s) => s.day === dayIdx && s.hour === hour
                        );
                        return (
                          <td key={dayIdx} className="px-2 py-2 text-center">
                            {slots.map((slot) => {
                              const c = GROUP_COLORS[slot.group];
                              const isHighlighted = slot.group === selectedGroup;
                              return (
                                <button
                                  key={slot.group}
                                  onClick={() => setSelectedGroup(slot.group)}
                                  className={`mx-auto block w-full rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all ${
                                    isHighlighted
                                      ? `${c.bg} ${c.text} ring-2 ${c.ring} shadow-sm scale-105`
                                      : `${c.bg} ${c.text} opacity-40 hover:opacity-70`
                                  }`}
                                >
                                  {slot.group}
                                </button>
                              );
                            })}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[12px] text-sand-400">
              * Harmonogram orientacyjny — może ulec zmianie. Kliknij grupę w tabeli, aby ją wybrać.
            </p>

            {/* ——— RESERVATION FORM ——— */}
            <div className="mt-12 rounded-2xl border border-sand-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-10 bg-coral-400" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-coral-500">
                  Rezerwacja
                </span>
              </div>
              <h2 className="font-editorial text-[1.8rem] font-bold text-sand-950 leading-tight">
                Zarezerwuj miejsce
              </h2>
              <p className="mt-2 text-[15px] text-sand-500">
                Wypełnij formularz — odpiszemy w ciągu 24h w dni robocze.
              </p>

              {/* Pre-filled summary */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${colors.bg} ${colors.text}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <span className="text-[13px] font-bold">{selectedGroup}</span>
                </div>
                {currentPrice && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-coral-100 px-4 py-2 text-coral-600">
                    <span className="text-[13px] font-bold">{frequency}× / tydzień</span>
                    <span className="text-[13px] text-coral-400">·</span>
                    <span className="text-[13px] font-bold">{currentPrice} zł/mies.</span>
                  </div>
                )}
              </div>

              {status === "ok" ? (
                <div className="mt-8 rounded-xl bg-pool-100 p-6 text-center">
                  <svg className="mx-auto mb-3 text-deep-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p className="font-editorial text-xl font-bold text-deep-800">Wysłano!</p>
                  <p className="mt-1 text-[15px] text-deep-600">Odpiszemy najszybciej jak to możliwe.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="res-name" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        Imię i nazwisko *
                      </label>
                      <input
                        id="res-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="Anna Kowalska"
                      />
                    </div>
                    <div>
                      <label htmlFor="res-email" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                        E-mail *
                      </label>
                      <input
                        id="res-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                        placeholder="anna@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="res-phone" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                      Telefon <span className="text-sand-400 normal-case font-normal">(opcjonalnie)</span>
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                      placeholder="+48 500 000 000"
                    />
                  </div>
                  <div>
                    <label htmlFor="res-message" className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                      Dodatkowe informacje <span className="text-sand-400 normal-case font-normal">(opcjonalnie)</span>
                    </label>
                    <textarea
                      id="res-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="mt-2 block w-full resize-none rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                      placeholder="Wiek dziecka, pytania, preferowane dni..."
                    />
                  </div>

                  {status === "error" && (
                    <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
                      Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na biuro@uksfala.com.pl
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-coral-500 text-[15px] font-bold text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20 disabled:opacity-60"
                  >
                    {status === "sending" ? "Wysyłanie…" : "Wyślij zgłoszenie"}
                    {status !== "sending" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript**

```bash
npm run build
```

Expected: No errors related to the new file.

**Step 3: Commit**

```bash
git add src/app/zajecia/SchedulePage.tsx
git commit -m "feat: add SchedulePage client component with table and form"
```

---

### Task 5: Create the /zajecia page server wrapper

**Files:**
- Create: `src/app/zajecia/page.tsx`

The server component wraps SchedulePage in Suspense (required because `useSearchParams()` is used inside a client component in Next.js App Router).

**Step 1: Create `src/app/zajecia/page.tsx`**

```tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SchedulePage from "./SchedulePage";

export const metadata: Metadata = {
  title: "Plan zajęć — UKS Fala Nieporęt",
  description:
    "Sprawdź harmonogram treningów wszystkich grup pływackich UKS Fala. Wybierz grupę i zarezerwuj miejsce online.",
};

export default function ZajeciaPage() {
  return (
    <>
      <Navigation />
      <main>
        <Suspense fallback={<div className="h-screen bg-sand-50" />}>
          <SchedulePage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
```

**Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. You should see `/zajecia` listed as a route.

**Step 3: Commit**

```bash
git add src/app/zajecia/page.tsx
git commit -m "feat: add /zajecia page route"
```

---

### Task 6: Update TrainingGroups.tsx button

**Files:**
- Modify: `src/components/TrainingGroups.tsx:1,153-162`

**Step 1: Add the Link import at top of the file**

In `src/components/TrainingGroups.tsx`, change line 1 from:

```tsx
import WaveDivider from "./WaveDivider";
```

to:

```tsx
import Link from "next/link";
import WaveDivider from "./WaveDivider";
```

**Step 2: Replace the `<a>` button with a `<Link>`**

Find this block (lines 153–162):

```tsx
<a
  href="#kontakt"
  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand-100 py-2.5 text-[13px] font-bold text-sand-700 transition-all group-hover:bg-deep-700 group-hover:text-white"
>
  Zapytaj o miejsce
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
</a>
```

Replace with:

```tsx
<Link
  href={`/zajecia?group=${encodeURIComponent(group.name)}`}
  className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-sand-100 py-2.5 text-[13px] font-bold text-sand-700 transition-all group-hover:bg-deep-700 group-hover:text-white"
>
  Zarezerwuj
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
</Link>
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

**Step 4: Smoke test in dev**

```bash
npm run dev
```

- Open `http://localhost:3000` — hover over a group card and check "Zarezerwuj" appears
- Click "Zarezerwuj" on e.g. Rekiny — should navigate to `http://localhost:3000/zajecia?group=Rekiny`
- On the zajecia page, "Rekiny" should be pre-selected in the sidebar
- Rekiny slots in the table should be highlighted, others muted
- Click "3×" frequency — price should show 408 zł
- Try clicking another group slot in the table — it should switch selection
- Fill form and submit — (will error if RESEND_API_KEY not set, that's expected)

**Step 5: Commit**

```bash
git add src/components/TrainingGroups.tsx
git commit -m "feat: update TrainingGroups button to link to /zajecia"
```

---

### Task 7: Final integration verification

**Step 1: Full build**

```bash
npm run build
```

Expected: Clean build, no errors, `/zajecia` appears in route list.

**Step 2: Set up Resend (when ready)**

1. Sign up at resend.com
2. Verify your sending domain (uksfala.com.pl)
3. Create an API key
4. Replace `re_REPLACE_WITH_YOUR_KEY` in `.env.local` with the real key
5. Test form submission end-to-end

**Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete /zajecia schedule and reservation page

- Weekly schedule table with 8 groups (Mon–Sat)
- Group selector sidebar with color-coded chips
- 1×/2×/3× frequency toggle with live price
- Reservation form sending via Resend API
- Deep-links from TrainingGroups via ?group= param"
```

---

## Summary of Files

| File | Action |
|------|--------|
| `src/components/TrainingGroups.tsx` | Modify — button → Link, text → "Zarezerwuj" |
| `src/lib/schedule.ts` | Create — schedule data, pricing, colors |
| `src/app/zajecia/page.tsx` | Create — server wrapper with Suspense |
| `src/app/zajecia/SchedulePage.tsx` | Create — full client component |
| `src/app/api/send/route.ts` | Create — Resend email handler |
| `.env.local` | Create — RESEND_API_KEY placeholder |
