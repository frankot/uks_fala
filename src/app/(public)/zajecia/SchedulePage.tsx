"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useMemo } from "react";
import HeroStrip from "@/components/HeroStrip";
import type { ScheduleData, ScheduleSlot } from "@/lib/queries/schedule";

const DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Niedziela",
];

const DAYS_SHORT = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];

const TIME_SLOTS = [
  "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
  "19:00", "19:15", "19:30",
];

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Tight‑style lesson block pill. */
function LessonBlock({
  slot,
  colors,
  isHighlighted,
  isFaded,
  onClick,
  durationMin,
  "aria-label": ariaLabel,
}: {
  slot: ScheduleSlot;
  colors: { bg: string; text: string; ring: string };
  isHighlighted: boolean;
  isFaded: boolean;
  onClick: () => void;
  durationMin: number;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel ?? slot.group}
      className={`flex h-full w-full flex-col items-center justify-center rounded-lg px-1.5 py-1 text-center transition-all ${
        isHighlighted
          ? `${colors.bg} ${colors.text} ring-2 ${colors.ring} shadow-sm scale-105`
          : isFaded
            ? `${colors.bg} ${colors.text} opacity-50 hover:opacity-75`
            : `${colors.bg} ${colors.text} opacity-40 hover:opacity-70`
      }`}
    >
      <span className="text-[11px] font-bold leading-tight">
        {slot.group}
      </span>
      <span className="mt-0.5 text-[9px] opacity-75 font-medium leading-none">
        {durationMin} min · T{slot.track}
      </span>
    </button>
  );
}

interface Props {
  data: ScheduleData;
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

  function getDuration(groupName: string): number {
    return groupDurationMap.get(groupName) ?? 45;
  }

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

  const summary =
    perLessonPrice && dayCounts && totalLessons > 0
      ? `${totalLessons} zajęć × ${perLessonPrice} zł`
      : null;

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

  async function handleSubmit(e: React.FormEvent) {
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

  // ── Helper: what's in a day/track/time cell? ──
  type CellInfo =
    | { type: "start"; slot: ScheduleSlot; durationMin: number }
    | { type: "covered" }
    | { type: "empty" };

  function getCellInfo(
    dayIdx: number,
    track: 1 | 2,
    timeSlot: string,
  ): CellInfo {
    for (const s of SCHEDULE) {
      if (s.day !== dayIdx || s.track !== track) continue;
      const start = timeToMinutes(s.startTime);
      const end = start + getDuration(s.group);
      const cell = timeToMinutes(timeSlot);
      if (cell === start) {
        return { type: "start", slot: s, durationMin: getDuration(s.group) };
      }
      if (cell > start && cell < end) {
        return { type: "covered" };
      }
    }
    return { type: "empty" };
  }

  // ── Mobile: schedule for a single day ──
  function renderMobileDay(dayIdx: number) {
    return (
      <div>
        <div className="grid grid-cols-[60px_1fr_1fr] gap-1">
          {/* Header */}
          <div />
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-deep-600 bg-deep-50 rounded-t-md py-1.5">
            Tor 1
          </div>
          <div className="text-center text-[10px] font-bold uppercase tracking-wider text-coral-600 bg-coral-50 rounded-t-md py-1.5">
            Tor 2
          </div>

          {TIME_SLOTS.map((hour, rowIdx) => {
            const t1 = getCellInfo(dayIdx, 1, hour);
            const t2 = getCellInfo(dayIdx, 2, hour);

            // Hide rows covered by rowspan
            if (t1.type === "covered" && t2.type === "covered") return null;
            if (t1.type === "covered" && t2.type === "empty") return null;
            if (t1.type === "empty" && t2.type === "covered") return null;

            return (
              <React.Fragment key={hour}>
                <div
                  className={`flex items-center justify-end pr-2 text-[11px] font-bold ${
                    rowIdx % 2 === 0 ? "text-sand-500" : "text-sand-400"
                  }`}
                >
                  {hour}
                </div>

                {/* Tor 1 */}
                {t1.type === "covered" ? null : t1.type === "start" ? (
                  <div
                    className="p-0.5"
                    style={{ gridRow: `span ${t1.durationMin / 15}` }}
                  >
                    <LessonBlock
                      slot={t1.slot}
                      colors={GROUP_COLORS[t1.slot.group]}
                      isHighlighted={
                        t1.slot.group === selectedGroup &&
                        selectedDays.has(dayIdx)
                      }
                      isFaded={t1.slot.group === selectedGroup}
                      onClick={() => {
                        if (t1.slot.group === selectedGroup) {
                          toggleDay(dayIdx);
                        } else {
                          selectGroup(t1.slot.group);
                        }
                      }}
                      durationMin={t1.durationMin}
                    />
                  </div>
                ) : (
                  <div className="min-h-[36px]" />
                )}

                {/* Tor 2 */}
                {t2.type === "covered" ? null : t2.type === "start" ? (
                  <div
                    className="p-0.5"
                    style={{ gridRow: `span ${t2.durationMin / 15}` }}
                  >
                    <LessonBlock
                      slot={t2.slot}
                      colors={GROUP_COLORS[t2.slot.group]}
                      isHighlighted={
                        t2.slot.group === selectedGroup &&
                        selectedDays.has(dayIdx)
                      }
                      isFaded={t2.slot.group === selectedGroup}
                      onClick={() => {
                        if (t2.slot.group === selectedGroup) {
                          toggleDay(dayIdx);
                        } else {
                          selectGroup(t2.slot.group);
                        }
                      }}
                      durationMin={t2.durationMin}
                    />
                  </div>
                ) : (
                  <div className="min-h-[36px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Desktop: full swim‑lane table ──
  function renderDesktopTable() {
    return (
      <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] border-collapse text-sm">
          <thead>
            {/* Header row 1: day names spanning 2 cols each */}
            <tr className="border-b border-sand-200">
              <th className="sticky left-0 z-10 bg-sand-50 pl-2 pr-0 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400 w-[40px] border-r border-sand-200">
                Godzina
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  colSpan={2}
                  className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600 border-x border-sand-100"
                >
                  {day}
                </th>
              ))}
            </tr>
            {/* Header row 2: Tor 1 / Tor 2 */}
            <tr className="border-b border-sand-100">
              <th className="sticky left-0 z-10 bg-sand-50" />
              {DAYS.map((day) => (
                <React.Fragment key={day}>
                  <th className="px-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-deep-600 bg-deep-50/50">
                    Tor 1
                  </th>
                  <th className="px-1 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-coral-600 bg-coral-50/50">
                    Tor 2
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour, rowIdx) => {
              // Pre‑compute cell info for this row
              const cells = DAYS.map((_, dayIdx) =>
                ([1, 2] as const).map((track) =>
                  getCellInfo(dayIdx, track, hour),
                ),
              );

              return (
                <tr
                  key={hour}
                  className={`border-b border-sand-100 ${rowIdx % 2 === 0 ? "bg-white" : "bg-sand-50/50"}`}
                >
                  <td className="sticky left-0 z-10 bg-inherit pl-2 pr-0 py-1.5 text-[12px] font-bold text-sand-500 border-r border-sand-100">
                    {hour}
                  </td>
                  {cells.map((dayCells, dayIdx) =>
                    dayCells.map((cell, trackIdx) => {
                      const track = (trackIdx + 1) as 1 | 2;

                      if (cell.type === "covered") return null;
                      if (cell.type === "empty") {
                        return (
                          <td
                            key={`${dayIdx}-${track}`}
                            className="p-0.5 min-h-[32px]"
                          />
                        );
                      }

                      // cell.type === "start"
                      const { slot, durationMin } = cell;
                      const rowSpan = durationMin / 15;
                      const isSelectedGroup =
                        slot.group === selectedGroup;
                      const isDaySelected = selectedDays.has(dayIdx);
                      const isHighlighted =
                        isSelectedGroup && isDaySelected;

                      return (
                        <td
                          key={`${dayIdx}-${track}`}
                          rowSpan={rowSpan}
                          className="p-0.5"
                        >
                          <div className="h-full">
                            <LessonBlock
                              slot={slot}
                              colors={GROUP_COLORS[slot.group]}
                              isHighlighted={isHighlighted}
                              isFaded={isSelectedGroup}
                              onClick={() => {
                                if (slot.group === selectedGroup) {
                                  toggleDay(dayIdx);
                                } else {
                                  selectGroup(slot.group);
                                }
                              }}
                              durationMin={durationMin}
                              aria-label={`${slot.group} — ${DAYS[slot.day]}, Tor ${slot.track}`}
                            />
                          </div>
                        </td>
                      );
                    }),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                      O grupie
                    </p>
                    <p className="text-[13px] text-sand-600 leading-relaxed">
                      {activeGroup.description}
                    </p>
                  </div>
                )}

                {/* Price */}
                <div className="lg:text-right shrink-0 lg:min-w-[200px]">
                  <div className="rounded-xl bg-deep-50 border border-deep-100 px-5 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-deep-400 mb-1">
                      Cena za semestr{data.semesterLabel ? ` ${data.semesterLabel}` : ""}
                    </p>
                    {totalPrice != null ? (
                      <>
                        <p className="font-editorial text-[2rem] font-bold leading-none text-deep-800">
                          {totalPrice}{" "}
                          <span className="text-[1rem] font-semibold text-deep-400">
                            zł
                          </span>
                        </p>
                        {summary && (
                          <p className="mt-1 text-[13px] text-sand-500">
                            {summary}
                          </p>
                        )}
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
        {/* Desktop: full table */}
        <div className="hidden lg:block">{renderDesktopTable()}</div>

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
          {renderMobileDay(mobileDayIdx)}
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
            Wypełnij formularz — odpiszemy w ciągu 24h w dni robocze.
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
