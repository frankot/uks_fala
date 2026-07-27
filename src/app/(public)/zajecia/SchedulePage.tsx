"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import HeroStrip from "@/components/HeroStrip";
import type { ScheduleData } from "@/lib/queries/schedule";

const DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Niedziela",
];
const TIME_SLOTS = [
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function selectGroup(groupName: string) {
    setSelectedGroup(groupName);
    const days = getDayIndicesForGroup(groupName);
    setSelectedDays(new Set(days.length > 0 ? [days[0]] : []));
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

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

  // Summary line: "51 zajęć × 45 zł"
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

  return (
    <div className="min-h-screen bg-sand-50">
      <HeroStrip
        backHref="/"
        backLabel="Strona główna"
        tag="Harmonogram"
        title="Plan zajęć"
        subtitle="UKS Fala"
        description="Zajęcia odbywają się 6 dni w tygodniu — bez sobót. Wybierz grupę i dni treningów, aby zobaczyć harmonogram i cenę miesięczną."
      />

      {/* Main content */}
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-10">
          {/* ——— SIDEBAR ——— */}
          <aside className="mb-10 lg:mb-0">
            <div className="sticky top-24 space-y-8">
              {/* Group selector — dropdown */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                  Wybierz grupę
                </p>
                <div ref={dropdownRef} className="relative">
                  {/* Trigger */}
                  <button
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className="flex w-full items-center gap-3 rounded-xl border-2 border-deep-700 bg-deep-700 px-4 py-3 text-left shadow-md shadow-deep-900/10 transition-all hover:bg-deep-600"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold bg-white/15 text-white`}
                    >
                      {activeGroup.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-bold text-white">
                        {activeGroup.name}
                      </p>
                      <p className="text-[12px] text-deep-200">
                        {activeGroup.age} · {activeGroup.duration} min
                      </p>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-deep-200 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 flex flex-col gap-1 rounded-xl border border-sand-200 bg-white p-1.5 shadow-xl shadow-deep-900/10">
                      {GROUPS.map((g) => {
                        const isActive = g.name === selectedGroup;
                        const c = GROUP_COLORS[g.name];
                        return (
                          <button
                            key={g.name}
                            onClick={() => {
                              selectGroup(g.name);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                              isActive
                                ? "bg-deep-700 shadow-sm"
                                : "hover:bg-sand-50"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                isActive
                                  ? "bg-white/15 text-white"
                                  : `${c.bg} ${c.text}`
                              }`}
                            >
                              {g.num}
                            </span>
                            <div className="min-w-0">
                              <p
                                className={`truncate text-[13px] font-bold ${isActive ? "text-white" : "text-sand-900"}`}
                              >
                                {g.name}
                              </p>
                              <p
                                className={`text-[11px] ${isActive ? "text-deep-200" : "text-sand-500"}`}
                              >
                                {g.age} · {g.duration} min
                              </p>
                            </div>
                            {isActive && (
                              <svg
                                className="ml-auto shrink-0 text-pool-300"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Day selector */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-sand-500 mb-3">
                  Dni treningów
                </p>
                <div className="flex flex-col gap-2">
                  {groupDayIndices.map((dayIdx) => {
                    const isSelected = selectedDays.has(dayIdx);
                    const maxReached = selectedDays.size >= 3 && !isSelected;
                    const disabled = maxReached;
                    return (
                      <button
                        key={dayIdx}
                        onClick={() => toggleDay(dayIdx)}
                        disabled={disabled}
                        className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition-all ${
                          isSelected
                            ? "border-coral-400 bg-coral-50"
                            : disabled
                              ? "border-sand-100 bg-sand-50/30"
                              : "border-sand-300 bg-white hover:border-sand-400 hover:bg-sand-50 hover:shadow-sm"
                        } ${disabled && !isSelected ? "cursor-not-allowed opacity-35" : ""}`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                            isSelected
                              ? "border-coral-500 bg-coral-500"
                              : disabled
                                ? "border-sand-200 bg-sand-100"
                                : "border-sand-400 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-[13px] font-semibold ${isSelected ? "text-sand-900" : disabled ? "text-sand-400" : "text-sand-800"}`}
                        >
                          {DAYS[dayIdx]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedDays.size >= 3 && (
                  <p className="mt-2 text-[12px] font-medium text-sand-600">
                    Maksymalnie 3 dni treningów w tygodniu.
                  </p>
                )}
              </div>

              {/* Price display */}
              <div className="rounded-2xl bg-deep-50 border border-deep-100 px-6 py-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-deep-400 mb-1">
                  Cena za semestr 2026/2027
                </p>
                {totalPrice != null ? (
                  <>
                    <p className="font-editorial text-[2.5rem] font-bold leading-none text-deep-800">
                      {totalPrice}{" "}
                      <span className="text-[1.2rem] font-semibold text-deep-400">
                        zł
                      </span>
                    </p>
                    {summary && (
                      <p className="mt-1 text-[13px] text-sand-500">
                        {summary}
                      </p>
                    )}
                    {zeroCountDays.length > 0 && (
                      <p className="mt-1 text-[11px] text-amber-600">
                        ⚠️{" "}
                        {zeroCountDays
                          .map((d) => DAYS[d].slice(0, 3))
                          .join(", ")}
                        : 0 zajęć w semestrze
                      </p>
                    )}
                  </>
                ) : selectedDays.size === 0 ? (
                  <p className="text-[15px] text-sand-500">
                    Wybierz dni treningów powyżej, aby zobaczyć cenę.
                  </p>
                ) : (
                  <p className="text-[15px] text-sand-500">Zapytaj o cenę</p>
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
                      <th
                        key={day}
                        className="px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600"
                      >
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
                          (s) => s.day === dayIdx && s.hour === hour,
                        );
                        return (
                          <td key={dayIdx} className="px-2 py-2 text-center">
                            {slots.map((slot) => {
                              const c = GROUP_COLORS[slot.group];
                              const isSelectedGroup =
                                slot.group === selectedGroup;
                              const isDaySelected = selectedDays.has(dayIdx);
                              const isHighlighted =
                                isSelectedGroup && isDaySelected;
                              return (
                                <button
                                  key={slot.group}
                                  onClick={() => {
                                    if (slot.group === selectedGroup) {
                                      toggleDay(dayIdx);
                                    } else {
                                      selectGroup(slot.group);
                                    }
                                  }}
                                  className={`mx-auto block w-full rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all ${
                                    isHighlighted
                                      ? `${c.bg} ${c.text} ring-2 ${c.ring} shadow-sm scale-105`
                                      : isSelectedGroup
                                        ? `${c.bg} ${c.text} opacity-50 hover:opacity-75`
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
              * Harmonogram orientacyjny — może ulec zmianie. Kliknij grupę aby
              ją wybrać; kliknij zaznaczoną grupę, aby odhaczyć dany dzień.
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
      </div>
    </div>
  );
}
