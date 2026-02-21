"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
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
  const paramGroup = searchParams.get("group") ?? "";
  const VALID_GROUP_NAMES = Object.keys(PRICES);
  const initialGroup = VALID_GROUP_NAMES.includes(paramGroup) ? paramGroup : "Krewetki";

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
                        aria-pressed={isActive}
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

              <div aria-live="polite">
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
    </div>
  );
}
