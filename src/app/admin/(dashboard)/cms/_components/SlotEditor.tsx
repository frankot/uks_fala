"use client";

import { Fragment } from "react";

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];
const TIME_SLOTS = [
  "15:30", "15:45",
  "16:00", "16:15", "16:30", "16:45",
  "17:00", "17:15", "17:30", "17:45",
  "18:00", "18:15", "18:30", "18:45",
  "19:00", "19:15", "19:30",
];

interface Slot {
  day: number;
  hour: string;   // keep "hour" for compat with GroupForm/DB — it's the start time
  track: number;  // 1 or 2
}

type OccupiedSlot = {
  groupName: string;
  day: number;
  hour: string;
  track: number;
  durationMinutes: number;
};

interface Props {
  value: Slot[];
  onChange: (slots: Slot[]) => void;
  occupiedSlots?: OccupiedSlot[];
  lessonDuration: number; // minutes (30, 45, 60)
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function SlotEditor({ value, onChange, occupiedSlots = [], lessonDuration }: Props) {
  const cellSpan = lessonDuration / 15; // 2, 3, or 4 rows

  /** Check if a cell is the top of an OWN slot (start of a lesson block). */
  function isOwnSlotStart(day: number, hour: string, track: number): boolean {
    return value.some((s) => s.day === day && s.hour === hour && s.track === track);
  }

  /** Check if a cell is covered (any row of the spanned block) by an OWN slot. */
  function isOwnSlotCell(day: number, hour: string, track: number): boolean {
    return value.some((s) => {
      if (s.day !== day || s.track !== track) return false;
      const start = timeToMinutes(s.hour);
      const end = start + lessonDuration;
      const cellTime = timeToMinutes(hour);
      return cellTime >= start && cellTime < end;
    });
  }

  /** Get occupied info for a cell (other group's lesson). */
  function getOccupied(day: number, hour: string, track: number): string | undefined {
    for (const o of occupiedSlots) {
      if (o.day !== day || o.track !== track) continue;
      const start = timeToMinutes(o.hour);
      const end = start + o.durationMinutes;
      const cellTime = timeToMinutes(hour);
      if (cellTime >= start && cellTime < end) {
        return o.groupName;
      }
    }
    return undefined;
  }

  /** Add a slot at day, hour (start), track. Removes any existing slot at that (day, track, hour). */
  function toggle(day: number, startHour: string, track: number) {
    if (isOwnSlotCell(day, startHour, track)) {
      // Remove the slot that covers this cell
      const startMin = timeToMinutes(startHour);
      onChange(
        value.filter((s) => {
          if (s.day !== day || s.track !== track) return true;
          const sStart = timeToMinutes(s.hour);
          const sEnd = sStart + lessonDuration;
          return !(startMin >= sStart && startMin < sEnd);
        })
      );
    } else {
      // Add new slot
      onChange([...value, { day, hour: startHour, track }]);
    }
  }

  const slotCount = value.length;

  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
        Terminy treningów
      </p>
      <div className="overflow-x-auto rounded-xl border border-sand-200">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead>
            {/* Header row 1: day names spanning 2 cols each */}
            <tr className="border-b border-sand-200 bg-sand-50">
              <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400 w-14">
                Godz.
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  colSpan={2}
                  className="px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600 border-x border-sand-200"
                >
                  {day}
                </th>
              ))}
            </tr>
            {/* Header row 2: Tor 1 / Tor 2 */}
            <tr className="border-b border-sand-200 bg-sand-50">
              <th className="px-3 py-1" />
              {DAYS.map((day) => (
                <Fragment key={day}>
                  <th className="px-1 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-sand-400">
                    T1
                  </th>
                  <th className="px-1 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-sand-400">
                    T2
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour) => {
              // Determine whether this row should be hidden because it's covered by rowSpan
              const hiddenByOwn = DAYS.some((_, dayIdx) =>
                [1, 2].some((track) => {
                  if (!isOwnSlotCell(dayIdx, hour, track)) return false;
                  // Is this the start row?
                  const isStart = value.some(
                    (s) => s.day === dayIdx && s.hour === hour && s.track === track
                  );
                  return !isStart && !getOccupied(dayIdx, hour, track);
                })
              );
              // We always render rows; rowSpan hides the extra cells
              return (
                <tr key={hour} className="border-b border-sand-100">
                  <td className="px-3 py-1 text-[12px] font-medium text-sand-500">
                    {hour}
                  </td>
                  {DAYS.map((_, dayIdx) =>
                    [1, 2].map((track) => {
                      const occupiedName = getOccupied(dayIdx, hour, track);
                      const isOwn = isOwnSlotCell(dayIdx, hour, track);
                      const isStart = isOwnSlotStart(
                        dayIdx,
                        hour,
                        track as 1 | 2
                      );

                      // If this cell is covered by a rowspan from above, skip rendering
                      if (isOwn && !isStart) {
                        return null;
                      }

                      if (occupiedName) {
                        // Check if this is the start of the occupied block
                        const isOccStart = occupiedSlots.some(
                          (o) =>
                            o.day === dayIdx &&
                            o.hour === hour &&
                            o.track === track &&
                            o.groupName === occupiedName
                        );
                        if (!isOccStart) return null;
                        const occSpan =
                          (occupiedSlots.find(
                            (o) =>
                              o.day === dayIdx &&
                              o.hour === hour &&
                              o.track === track &&
                              o.groupName === occupiedName
                          )?.durationMinutes ?? 45) / 15;
                        return (
                          <td
                            key={`${dayIdx}-${track}`}
                            rowSpan={occSpan}
                            className="px-0.5 py-0.5 text-center align-stretch"
                          >
                            <div className="flex h-full items-center justify-center rounded-md bg-deep-700/15 cursor-not-allowed mx-0.5 min-h-[28px]">
                              <span className="truncate px-1 text-[10px] font-bold text-deep-600 select-none">
                                {occupiedName}
                              </span>
                            </div>
                          </td>
                        );
                      }

                      if (isOwn && isStart) {
                        return (
                          <td
                            key={`${dayIdx}-${track}`}
                            rowSpan={cellSpan}
                            className="px-0.5 py-0.5 text-center align-stretch"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                toggle(dayIdx, hour, track as 1 | 2)
                              }
                              className="flex h-full w-full items-center justify-center rounded-md bg-coral-500 shadow-sm mx-0.5 min-h-[28px] hover:bg-coral-600 transition-colors"
                              title={`Usuń termin (Tor ${track})`}
                            >
                              <span className="text-[10px] font-bold text-white">
                                T{track}
                              </span>
                            </button>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={`${dayIdx}-${track}`}
                          className="px-0.5 py-1 text-center"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              toggle(dayIdx, hour, track as 1 | 2)
                            }
                            className="mx-0.5 h-[28px] w-full rounded-md bg-sand-100 hover:bg-sand-200 transition-colors"
                          />
                        </td>
                      );
                    })
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sand-400">
        <span>
          Kliknij komórkę aby dodać/usunąć termin. Zaznaczono: {slotCount}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-coral-500" />
          Terminy grupy (kliknij aby usunąć)
        </span>
        {occupiedSlots.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-deep-700/15" />
            Zajęte przez inne grupy
          </span>
        )}
      </div>
    </div>
  );
}
