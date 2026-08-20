"use client";

import type { ScheduleSlot } from "@/lib/queries/schedule";
import {
  DAYS,
  DAYS_SHORT,
  ROW_COUNT,
  ROW_HEIGHT,
  TIME_SLOTS,
  TRACKS,
  laneColumn,
  type PlacedBlock,
} from "@/lib/schedule-grid";

type GroupColors = { bg: string; text: string; ring: string };

/** A schedule slot carrying the `hour` key the grid helpers position by. */
export type GridSlot = ScheduleSlot & { hour: string };

interface Props {
  /** Day indices to render as columns — all six on desktop, one on mobile. */
  days: number[];
  blocks: Array<PlacedBlock<GridSlot>>;
  groupColors: Record<string, GroupColors>;
  selectedGroup: string;
  selectedDays: Set<number>;
  onSelect: (slot: GridSlot) => void;
  /** Mobile leaves out the day header — the day tabs above already say which day it is. */
  showDayHeader?: boolean;
  gutterWidth?: number;
  minWidth?: number;
}

const FALLBACK_COLORS: GroupColors = {
  bg: "bg-sand-100",
  text: "text-sand-700",
  ring: "ring-sand-300",
};

export default function ScheduleGrid({
  days,
  blocks,
  groupColors,
  selectedGroup,
  selectedDays,
  onSelect,
  showDayHeader = true,
  gutterWidth = 56,
  minWidth,
}: Props) {
  const columns = `${gutterWidth}px repeat(${days.length * 2}, minmax(0, 1fr))`;

  return (
    <div className="overflow-x-auto rounded-2xl border border-sand-200 bg-white shadow-sm">
      <div style={minWidth ? { minWidth } : undefined}>
        {/* ── Header ── */}
        {showDayHeader && (
          <div
            className="grid border-b border-sand-100"
            style={{ gridTemplateColumns: columns }}
          >
            <div className="bg-sand-50" />
            {days.map((dayIdx) => (
              <div
                key={dayIdx}
                className="border-l border-sand-100 px-3 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600"
                style={{ gridColumn: "span 2" }}
              >
                {DAYS[dayIdx]}
              </div>
            ))}
          </div>
        )}

        <div
          className="grid border-b border-sand-200"
          style={{ gridTemplateColumns: columns }}
        >
          <div className="bg-sand-50" />
          {days.map((dayIdx) =>
            TRACKS.map((track) => (
              <div
                key={`${dayIdx}-${track}`}
                className={`py-1.5 text-center text-[10px] font-bold uppercase tracking-wider ${
                  track === 1
                    ? "border-l border-sand-100 bg-deep-50/60 text-deep-600"
                    : "bg-coral-50/60 text-coral-600"
                }`}
              >
                Tor {track}
              </div>
            )),
          )}
        </div>

        {/* ── Body: one fixed-height row per 15 min ── */}
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: columns,
            gridTemplateRows: `repeat(${ROW_COUNT}, ${ROW_HEIGHT}px)`,
          }}
        >
          {/* Lane tints */}
          {days.map((dayIdx, dayPos) =>
            TRACKS.map((track) => (
              <div
                key={`lane-${dayIdx}-${track}`}
                aria-hidden
                className={
                  track === 1
                    ? "border-l border-sand-100 bg-deep-50/20"
                    : "bg-coral-50/20"
                }
                style={{
                  gridColumn: laneColumn(dayPos, track),
                  gridRow: `1 / -1`,
                }}
              />
            )),
          )}

          {/* Row separators + hour labels */}
          {TIME_SLOTS.map((hour, rowIdx) => (
            <div key={`row-${hour}`} className="contents">
              {rowIdx > 0 && (
                <div
                  aria-hidden
                  className="border-t border-sand-100"
                  style={{ gridColumn: "1 / -1", gridRow: rowIdx + 1 }}
                />
              )}
              <div
                className="flex items-center justify-end pr-2 text-[11px] font-bold text-sand-500"
                style={{ gridColumn: 1, gridRow: rowIdx + 1 }}
              >
                {hour}
              </div>
            </div>
          ))}

          {/* Lesson blocks */}
          {blocks.map((block) => {
            const dayPos = days.indexOf(block.slot.day);
            if (dayPos === -1) return null;

            const colors = groupColors[block.slot.group] ?? FALLBACK_COLORS;
            const isSelectedGroup = block.slot.group === selectedGroup;
            const isHighlighted =
              isSelectedGroup && selectedDays.has(block.slot.day);

            return (
              <button
                key={`${block.slot.group}-${block.slot.day}-${block.slot.track}-${block.slot.hour}`}
                type="button"
                onClick={() => onSelect(block.slot)}
                aria-label={`${block.slot.group} — ${DAYS[block.slot.day]}, ${block.slot.startTime}, Tor ${block.slot.track}`}
                className="relative z-10 p-[3px]"
                style={{
                  gridColumn: laneColumn(dayPos, block.slot.track),
                  gridRow: `${block.rowStart + 1} / span ${block.rowSpan}`,
                }}
              >
                <span
                  className={`flex h-full w-full flex-col items-center justify-center rounded-lg px-1.5 text-center transition-all ${colors.bg} ${colors.text} ${
                    isHighlighted
                      ? `ring-2 ${colors.ring} shadow-sm`
                      : isSelectedGroup
                        ? "opacity-60 hover:opacity-85"
                        : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <span className="text-[11px] font-bold leading-tight">
                    {block.slot.group}
                  </span>
                  <span className="mt-0.5 text-[9px] font-medium leading-none opacity-75">
                    {block.slot.startTime} · {block.durationMinutes} min
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Label helper shared with the day tabs above the grid. */
export function shortDay(dayIdx: number): string {
  return DAYS_SHORT[dayIdx];
}
