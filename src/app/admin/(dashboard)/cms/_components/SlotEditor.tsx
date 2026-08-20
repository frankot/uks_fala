"use client";

import { useMemo } from "react";
import {
  DAYS_SHORT,
  DAY_INDICES,
  GRID_END,
  ROW_COUNT,
  ROW_HEIGHT,
  TIME_SLOTS,
  TRACKS,
  fitsInGrid,
  hasConflict,
  laneColumn,
  placeBlocks,
  type PlacedBlock,
} from "@/lib/schedule-grid";

interface Slot {
  day: number;
  hour: string; // start time — named "hour" to match the DB column
  track: number; // 1 or 2
}

type OccupiedSlot = Slot & {
  groupName: string;
  durationMinutes: number;
};

interface Props {
  value: Slot[];
  onChange: (slots: Slot[]) => void;
  occupiedSlots?: OccupiedSlot[];
  lessonDuration: number; // minutes (30, 45, 60)
}

type Cell =
  | { kind: "empty"; hour: string; reason?: string }
  | { kind: "own"; block: PlacedBlock<Slot> }
  | { kind: "occupied"; block: PlacedBlock<OccupiedSlot> }
  | { kind: "clash"; block: PlacedBlock<Slot>; with: string }
  | { kind: "covered" };

export default function SlotEditor({
  value,
  onChange,
  occupiedSlots = [],
  lessonDuration,
}: Props) {
  const ownBlocks = useMemo(
    () => placeBlocks(value, () => lessonDuration),
    [value, lessonDuration],
  );

  const occupiedBlocks = useMemo(
    () => placeBlocks(occupiedSlots, (s) => s.durationMinutes),
    [occupiedSlots],
  );

  /**
   * One entry per row for every lane. Blocks claim their start row and mark the rest
   * "covered", so a lane always has exactly ROW_COUNT entries — no cell can go missing
   * and shift the columns, which is what table rowSpan used to do here.
   */
  const lanes = useMemo(() => {
    const map = new Map<string, Cell[]>();

    for (const day of DAY_INDICES) {
      for (const track of TRACKS) {
        const cells: Cell[] = Array.from({ length: ROW_COUNT }, (_, rowIdx) => {
          const hour = TIME_SLOTS[rowIdx];
          const fits = fitsInGrid(hour, lessonDuration);
          const clashes =
            hasConflict(occupiedBlocks, day, track, hour, lessonDuration) ||
            hasConflict(ownBlocks, day, track, hour, lessonDuration);
          return {
            kind: "empty",
            hour,
            reason: !fits
              ? `Zajęcia (${lessonDuration} min) nie zmieszczą się przed ${GRID_END}`
              : clashes
                ? "Kolizja z innym terminem na tym torze"
                : undefined,
          } satisfies Cell;
        });

        const place = (rowStart: number, rowSpan: number, cell: Cell) => {
          cells[rowStart] = cell;
          for (let r = rowStart + 1; r < rowStart + rowSpan; r++) {
            cells[r] = { kind: "covered" };
          }
        };

        for (const block of occupiedBlocks) {
          if (block.slot.day !== day || block.slot.track !== track) continue;
          place(block.rowStart, block.rowSpan, { kind: "occupied", block });
        }

        // Own blocks are placed last so a broken overlap surfaces as a clash
        // instead of silently dropping one of the two blocks.
        for (const block of ownBlocks) {
          if (block.slot.day !== day || block.slot.track !== track) continue;
          const collidingWith = occupiedBlocks.find(
            (o) =>
              o.slot.day === day &&
              o.slot.track === track &&
              o.startMin < block.endMin &&
              block.startMin < o.endMin,
          );
          place(
            block.rowStart,
            block.rowSpan,
            collidingWith
              ? { kind: "clash", block, with: collidingWith.slot.groupName }
              : { kind: "own", block },
          );
        }

        map.set(`${day}-${track}`, cells);
      }
    }

    return map;
  }, [ownBlocks, occupiedBlocks, lessonDuration]);

  function addSlot(day: number, hour: string, track: number) {
    onChange([...value, { day, hour, track }]);
  }

  function removeSlot(slot: Slot) {
    onChange(
      value.filter(
        (s) =>
          !(s.day === slot.day && s.hour === slot.hour && s.track === slot.track),
      ),
    );
  }

  const columns = `52px repeat(${DAY_INDICES.length * 2}, minmax(0, 1fr))`;

  return (
    <div>
      <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-sand-500">
        Terminy treningów
      </p>

      <div className="overflow-x-auto rounded-xl border border-sand-200">
        <div style={{ minWidth: 760 }}>
          {/* Header — day names, then Tor 1 / Tor 2 */}
          <div
            className="grid border-b border-sand-200 bg-sand-50"
            style={{ gridTemplateColumns: columns }}
          >
            <div className="px-2 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400">
              Godz.
            </div>
            {DAY_INDICES.map((day) => (
              <div
                key={day}
                className="border-l border-sand-200 px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600"
                style={{ gridColumn: "span 2" }}
              >
                {DAYS_SHORT[day]}
              </div>
            ))}
          </div>
          <div
            className="grid border-b border-sand-200 bg-sand-50"
            style={{ gridTemplateColumns: columns }}
          >
            <div />
            {DAY_INDICES.map((day) =>
              TRACKS.map((track) => (
                <div
                  key={`${day}-${track}`}
                  className={`py-1 text-center text-[10px] font-bold uppercase tracking-wider text-sand-400 ${
                    track === 1 ? "border-l border-sand-200" : ""
                  }`}
                >
                  T{track}
                </div>
              )),
            )}
          </div>

          {/* Body — fixed 15-minute rows */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: columns,
              gridTemplateRows: `repeat(${ROW_COUNT}, ${ROW_HEIGHT}px)`,
            }}
          >
            {TIME_SLOTS.map((hour, rowIdx) => (
              <div key={`label-${hour}`} className="contents">
                {rowIdx > 0 && (
                  <div
                    aria-hidden
                    className="border-t border-sand-100"
                    style={{ gridColumn: "1 / -1", gridRow: rowIdx + 1 }}
                  />
                )}
                <div
                  className="flex items-center justify-end pr-2 text-[11px] font-medium text-sand-500"
                  style={{ gridColumn: 1, gridRow: rowIdx + 1 }}
                >
                  {hour}
                </div>
              </div>
            ))}

            {DAY_INDICES.map((day, dayPos) =>
              TRACKS.map((track) => {
                const cells = lanes.get(`${day}-${track}`) ?? [];
                const column = laneColumn(dayPos, track);

                return cells.map((cell, rowIdx) => {
                  if (cell.kind === "covered") return null;

                  const style = {
                    gridColumn: column,
                    gridRow:
                      cell.kind === "own" || cell.kind === "clash"
                        ? `${cell.block.rowStart + 1} / span ${cell.block.rowSpan}`
                        : cell.kind === "occupied"
                          ? `${cell.block.rowStart + 1} / span ${cell.block.rowSpan}`
                          : rowIdx + 1,
                  };
                  const key = `${day}-${track}-${rowIdx}`;

                  if (cell.kind === "occupied") {
                    return (
                      <div
                        key={key}
                        style={style}
                        className="relative z-10 p-[2px]"
                        title={`${cell.block.slot.groupName} — ${cell.block.slot.hour}, ${cell.block.durationMinutes} min`}
                      >
                        <div className="flex h-full w-full cursor-not-allowed items-center justify-center rounded-md bg-deep-700/15 px-1">
                          <span className="truncate text-[10px] font-bold text-deep-600">
                            {cell.block.slot.groupName}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (cell.kind === "clash") {
                    return (
                      <button
                        key={key}
                        type="button"
                        style={style}
                        onClick={() => removeSlot(cell.block.slot)}
                        className="relative z-10 p-[2px]"
                        title={`Konflikt z grupą ${cell.with} — kliknij, aby usunąć ten termin`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-md bg-rose-500 px-1">
                          <span className="truncate text-[10px] font-bold text-white">
                            Konflikt
                          </span>
                        </div>
                      </button>
                    );
                  }

                  if (cell.kind === "own") {
                    return (
                      <button
                        key={key}
                        type="button"
                        style={style}
                        onClick={() => removeSlot(cell.block.slot)}
                        className="relative z-10 p-[2px]"
                        title={`Usuń termin — ${cell.block.slot.hour}, Tor ${track}`}
                      >
                        <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-coral-500 shadow-sm transition-colors hover:bg-coral-600">
                          <span className="text-[10px] font-bold leading-none text-white">
                            T{track}
                          </span>
                          <span className="mt-0.5 text-[9px] leading-none text-white/80">
                            {cell.block.slot.hour}
                          </span>
                        </div>
                      </button>
                    );
                  }

                  const blocked = !!cell.reason;
                  return (
                    <button
                      key={key}
                      type="button"
                      style={style}
                      disabled={blocked}
                      onClick={() => addSlot(day, cell.hour, track)}
                      title={
                        cell.reason ??
                        `Dodaj termin — ${DAYS_SHORT[day]} ${cell.hour}, Tor ${track}`
                      }
                      className="p-[2px]"
                    >
                      <div
                        className={`h-full w-full rounded-md transition-colors ${
                          blocked
                            ? "cursor-not-allowed bg-sand-50"
                            : "bg-sand-100 hover:bg-sand-200"
                        }`}
                      />
                    </button>
                  );
                });
              }),
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sand-400">
        <span>
          Kliknij wolną komórkę aby dodać termin. Zaznaczono: {value.length}
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
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-sand-50 ring-1 ring-sand-200" />
          Za mało miejsca dla {lessonDuration} min
        </span>
      </div>
    </div>
  );
}
