"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import HeroStrip from "@/components/HeroStrip";
import type { ScheduleData } from "@/lib/queries/schedule";
import { DAYS, DAYS_SHORT, DAY_INDICES, placeBlocks } from "@/lib/schedule-grid";
import ScheduleGrid, { type GridSlot } from "./ScheduleGrid";

interface Props {
  data: ScheduleData;
}

/** "zajęcia" is plurale tantum: 2–4 (but not 12–14) take "zajęcia", the rest "zajęć". */
function pluralZajecia(count: number): string {
  const last = count % 10;
  const lastTwo = count % 100;
  if (count === 1) return "zajęcia";
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return "zajęcia";
  return "zajęć";
}

export default function SchedulePage({ data }: Props) {
  const {
    groups: GROUPS,
    schedule: SCHEDULE,
    prices: PRICES,
    groupColors: GROUP_COLORS,
  } = data;

  // Build group‑duration lookup
  const groupDurationMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const g of GROUPS) m.set(g.name, g.duration);
    return m;
  }, [GROUPS]);

  function getDayIndicesForGroup(group: string): number[] {
    return [
      ...new Set(SCHEDULE.filter((s) => s.group === group).map((s) => s.day)),
    ].sort((a, b) => a - b);
  }

  const searchParams = useSearchParams();
  const paramGroup = searchParams.get("group") ?? "";
  const VALID_GROUP_NAMES = Object.keys(PRICES);
  const initialGroup = VALID_GROUP_NAMES.includes(paramGroup)
    ? paramGroup
    : (GROUPS[0]?.name ?? "Krewetki");

  const [selectedGroup, setSelectedGroup] = useState(initialGroup);
  const [selectedDays, setSelectedDays] = useState<Set<number>>(() => {
    const days = getDayIndicesForGroup(initialGroup);
    return new Set(days.length > 0 ? [days[0]] : []);
  });
  // Mobile: selected day tab
  const [mobileDayIdx, setMobileDayIdx] = useState(0);

  function selectGroup(groupName: string) {
    setSelectedGroup(groupName);
    const days = getDayIndicesForGroup(groupName);
    setSelectedDays(new Set(days.length > 0 ? [days[0]] : []));
  }

  function toggleDay(dayIdx: number) {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayIdx)) next.delete(dayIdx);
      else if (next.size >= 3) return prev;
      else next.add(dayIdx);
      return next;
    });
  }

  const groupDayIndices = getDayIndicesForGroup(selectedGroup);
  const perLessonPrice = (PRICES[selectedGroup] ?? {})[
    selectedDays.size as 1 | 2 | 3
  ];
  const colors = GROUP_COLORS[selectedGroup];
  const activeGroup = GROUPS.find((g) => g.name === selectedGroup)!;

  // Semester price calculation
  const dayCounts = data.semesterDayCount;
  const totalLessons = dayCounts
    ? [...selectedDays].reduce((sum, d) => sum + (dayCounts[d] ?? 0), 0)
    : 0;
  const totalPrice =
    perLessonPrice && dayCounts && totalLessons > 0
      ? perLessonPrice * totalLessons
      : null;

  const zeroCountDays = dayCounts
    ? [...selectedDays].filter((d) => dayCounts[d] === 0)
    : [];

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setStatus("sending");
    const days = [...selectedDays]
      .sort((a, b) => a - b)
      .map((d) => DAYS[d])
      .join(", ");
    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, group: selectedGroup, days }),
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

  // ── Lesson blocks placed on the shared 15-min axis ──
  const blocks = useMemo(
    () =>
      placeBlocks<GridSlot>(
        SCHEDULE.map((s) => ({ ...s, hour: s.startTime })),
        (s) => groupDurationMap.get(s.group) ?? 45,
      ),
    [SCHEDULE, groupDurationMap],
  );

  function handleBlockSelect(slot: GridSlot) {
    if (slot.group === selectedGroup) {
      toggleDay(slot.day);
    } else {
      selectGroup(slot.group);
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Harmonogram"
        title="Plan zajęć"
        subtitle="UKS Fala"
        description="Zajęcia odbywają się 6 dni w tygodniu — bez sobót. Dwa tory basenowe pozwalają na równoległe treningi różnych grup."
      />

      {/* Main content */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        {/* ===== GROUP SELECTOR + DAYS + PRICE ===== */}
        <div className="mb-10 rounded-2xl border border-sand-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">
            {/* Step 1: Pick a group — scrollable pill strip */}
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
              Wybierz grupę
            </p>
            <div className="-mx-1 px-1 pb-1 overflow-x-auto scrollbar-none">
              <div className="flex gap-2 min-w-0">
                {GROUPS.map((g) => {
                  const isActive = g.name === selectedGroup;
                  const c = GROUP_COLORS[g.name];
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => selectGroup(g.name)}
                      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-left transition-all ${
                        isActive
                          ? `${c.bg} ${c.text} shadow-md ring-1 ring-current/20`
                          : "bg-sand-50 text-sand-700 ring-1 ring-sand-200 hover:bg-sand-100 hover:ring-sand-300"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                          isActive
                            ? "bg-white/20"
                            : `${c.bg} ${c.text}`
                        }`}
                      >
                        {g.num}
                      </span>
                      <span className="text-[13px] font-bold whitespace-nowrap">
                        {g.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Selected group detail */}
            <p className="mt-2 text-[12px] text-sand-500">
              {activeGroup.age} · {activeGroup.duration} min
            </p>

            {/* Day pills + Price */}
            <div className="mt-5 pt-5 border-t border-sand-200">
              <div className="flex flex-col lg:flex-row lg:items-start gap-5 lg:gap-8">
                {/* Days */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                    Dni treningów
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {groupDayIndices.map((dayIdx) => {
                      const isSelected = selectedDays.has(dayIdx);
                      const maxReached =
                        selectedDays.size >= 3 && !isSelected;
                      return (
                        <button
                          key={dayIdx}
                          type="button"
                          onClick={() => toggleDay(dayIdx)}
                          disabled={maxReached}
                          className={`rounded-full px-4 py-2 text-[13px] font-bold leading-none transition-all ${
                            isSelected
                              ? "bg-coral-500 text-white shadow-sm shadow-coral-500/20 ring-1 ring-coral-400"
                              : maxReached
                                ? "bg-sand-50 text-sand-300 cursor-not-allowed ring-1 ring-sand-200"
                                : "bg-sand-100 text-sand-700 ring-1 ring-sand-200 hover:bg-sand-200 hover:text-sand-900"
                          }`}
                        >
                          {DAYS[dayIdx]}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDays.size >= 3 && (
                    <p className="mt-2 text-[12px] font-medium text-sand-500">
                      Maksymalnie 3 dni treningów w tygodniu.
                    </p>
                  )}
                  {selectedDays.size === 0 && (
                    <p className="mt-2 text-[12px] text-sand-400">
                      Wybierz 1–3 dni powyżej
                    </p>
                  )}

                  {/* Rezerwuj button — subtle */}
                  <button
                    type="button"
                    disabled={selectedDays.size === 0}
                    onClick={() => {
                      document.getElementById("rezerwacja")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`mt-3 ml-2 text-[14px] font-semibold underline-offset-2 transition-all ${
                      selectedDays.size > 0
                        ? "text-coral-600 hover:text-coral-700 underline decoration-coral-300 hover:decoration-coral-500"
                        : "text-sand-300 cursor-not-allowed no-underline"
                    }`}
                  >
                    Rezerwuj ↓
                  </button>
                </div>

                {/* Group description */}
                {activeGroup.description && (
                  <div className="flex-1 min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500">
                        O grupie
                      </p>
                      {activeGroup.level && (
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.bg} ${colors.text}`}
                        >
                          {activeGroup.level}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-sand-600 leading-relaxed">
                      {activeGroup.description}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="lg:text-right shrink-0 lg:min-w-[200px]">
                  <div className="rounded-xl bg-deep-50 border border-deep-100 px-5 py-4">
                    {totalPrice != null ? (
                      <>
                        <p className="font-editorial text-[2rem] font-bold leading-none text-deep-800">
                          {totalLessons} {pluralZajecia(totalLessons)}
                        </p>
                        <p className="mt-1.5 text-[1.125rem] font-semibold leading-none text-deep-500">
                          {totalPrice}{" "}
                          <span className="text-[0.875rem] text-deep-400">
                            zł
                          </span>
                        </p>
                      </>
                    ) : selectedDays.size === 0 ? (
                      <p className="text-[14px] font-medium text-sand-500">
                        Wybierz dni, aby zobaczyć cenę
                      </p>
                    ) : (
                      <p className="text-[14px] font-medium text-sand-500">
                        Zapytaj o cenę
                      </p>
                    )}
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-deep-400">
                      Cena za semestr{data.semesterLabel ? ` ${data.semesterLabel}` : ""}
                    </p>
                    {zeroCountDays.length > 0 && (
                      <p className="mt-1.5 text-[12px] font-medium text-amber-600">
                        ⚠️{" "}
                        {zeroCountDays
                          .map((d) => DAYS_SHORT[d])
                          .join(", ")}
                        : 0 zajęć w semestrze
                      </p>
                    )}
                    <p className="mt-2 text-[11px] text-sand-400">
                      Ceny orientacyjne, mogą ulec zmianie.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SCHEDULE TABLE ===== */}
        {/* Desktop: all six days side by side */}
        <div className="hidden lg:block">
          <ScheduleGrid
            days={DAY_INDICES}
            blocks={blocks}
            groupColors={GROUP_COLORS}
            selectedGroup={selectedGroup}
            selectedDays={selectedDays}
            onSelect={handleBlockSelect}
            minWidth={900}
          />
        </div>

        {/* Mobile: day tabs */}
        <div className="lg:hidden">
          {/* Day tabs */}
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
            {DAYS.map((day, idx) => {
              const hasLessons = getDayIndicesForGroup(selectedGroup).includes(idx);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setMobileDayIdx(idx)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-[13px] font-bold transition-all ${
                    mobileDayIdx === idx
                      ? "bg-deep-700 text-white shadow-sm"
                      : hasLessons
                        ? "bg-sand-100 text-sand-700 hover:bg-sand-200"
                        : "bg-sand-50 text-sand-400"
                  }`}
                >
                  {DAYS_SHORT[idx]}
                </button>
              );
            })}
          </div>
          <ScheduleGrid
            days={[mobileDayIdx]}
            blocks={blocks}
            groupColors={GROUP_COLORS}
            selectedGroup={selectedGroup}
            selectedDays={selectedDays}
            onSelect={handleBlockSelect}
            showDayHeader={false}
            gutterWidth={48}
          />
        </div>

        {/* Legend */}
        <p className="mt-3 text-[12px] text-sand-400">
          * Harmonogram orientacyjny — może ulec zmianie. Kliknij grupę aby
          ją wybrać; kliknij zaznaczoną grupę, aby odhaczyć dany dzień.
        </p>

        <p className="mt-1 flex items-center gap-3 text-[11px] text-sand-400">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-deep-50 border border-deep-200" /> Tor 1
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-coral-50 border border-coral-200" /> Tor 2
          </span>
        </p>

        {/* ===== RESERVATION FORM ===== */}
        <div id="rezerwacja" className="mt-12 rounded-2xl border border-sand-200 bg-white p-8 shadow-sm scroll-mt-24">
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
            Możesz dołączyć do nas przez cały rok.
          </p>

          {/* Pre-filled summary */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${colors.bg} ${colors.text}`}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span className="text-[13px] font-bold">{selectedGroup}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-100 px-4 py-2 text-coral-600">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-[13px] font-bold">
                {selectedDays.size > 0
                  ? [...selectedDays]
                      .sort((a, b) => a - b)
                      .map((d) => DAYS[d])
                      .join(", ")
                  : "Wybierz dni"}
              </span>
              {totalPrice != null && (
                <>
                  <span className="text-[13px] text-coral-400">·</span>
                  <span className="text-[13px] font-bold">
                    {totalPrice} zł/semestr
                  </span>
                </>
              )}
            </div>
          </div>

          <div aria-live="polite">
            {status === "ok" ? (
              <div className="mt-8 rounded-xl bg-pool-100 p-6 text-center">
                <svg
                  className="mx-auto mb-3 text-deep-600"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="font-editorial text-xl font-bold text-deep-800">
                  Wysłano!
                </p>
                <p className="mt-1 text-[15px] text-deep-600">
                  Odpiszemy najszybciej jak to możliwe.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="res-name"
                      className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
                    >
                      Imię i nazwisko *
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                      placeholder="Anna Kowalska"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="res-email"
                      className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
                    >
                      E-mail *
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                      placeholder="anna@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="res-phone"
                    className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
                  >
                    Telefon{" "}
                    <span className="text-sand-400 normal-case font-normal">
                      (opcjonalnie)
                    </span>
                  </label>
                  <input
                    id="res-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                    placeholder="+48 500 000 000"
                  />
                </div>
                <div>
                  <label
                    htmlFor="res-message"
                    className="block text-[12px] font-bold uppercase tracking-wider text-sand-500"
                  >
                    Dodatkowe informacje{" "}
                    <span className="text-sand-400 normal-case font-normal">
                      (opcjonalnie)
                    </span>
                  </label>
                  <textarea
                    id="res-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="mt-2 block w-full resize-none rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3 text-[15px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                    placeholder="Wiek dziecka, pytania, preferowane dni..."
                  />
                </div>

                {status === "error" && (
                  <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
                    Coś poszło nie tak. Spróbuj ponownie lub napisz
                    bezpośrednio na biuro@uksfala.com.pl
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-coral-500 text-[15px] font-bold text-white transition-all hover:bg-coral-600 hover:shadow-lg hover:shadow-coral-500/20 disabled:opacity-60"
                >
                  {status === "sending"
                    ? "Wysyłanie…"
                    : "Wyślij zgłoszenie"}
                  {status !== "sending" && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
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
  );
}
