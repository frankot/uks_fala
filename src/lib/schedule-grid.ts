/**
 * Single source of truth for the grafik (schedule) grid.
 *
 * Both the public plan zajęć and the CMS slot editor lay lessons out on the same
 * time axis: a fixed number of equal-height rows, one per STEP_MINUTES. Blocks are
 * positioned with CSS grid (`gridRow: start / span n`) — never with table rowSpan,
 * which lets the browser pick row heights and drifts blocks away from their hour.
 */

export const DAYS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Niedziela",
];

export const DAYS_SHORT = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];

export const DAY_INDICES = [0, 1, 2, 3, 4, 5];

export const TRACKS = [1, 2] as const;
export type Track = (typeof TRACKS)[number];

/** First bookable time and the hard end of the pool window. */
export const GRID_START = "15:30";
export const GRID_END = "21:00";
/** Granularity of the axis — every lesson start must land on a multiple of this. */
export const STEP_MINUTES = 15;
/** Height of one STEP_MINUTES row, in px. The axis is linear: 45 min is always 3×. */
export const ROW_HEIGHT = 30;
/** The only lesson lengths a group can have. */
export const LESSON_DURATIONS = [30, 45] as const;
export type LessonDuration = (typeof LESSON_DURATIONS)[number];

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export const GRID_START_MIN = timeToMinutes(GRID_START);
export const GRID_END_MIN = timeToMinutes(GRID_END);

/** Number of rows on the axis. */
export const ROW_COUNT = (GRID_END_MIN - GRID_START_MIN) / STEP_MINUTES;

/** Start time of every row — "15:30", "15:45", … , "20:45". */
export const TIME_SLOTS: string[] = Array.from({ length: ROW_COUNT }, (_, i) =>
  formatTime(GRID_START_MIN + i * STEP_MINUTES),
);

/** Row index (0-based) a time falls on, or -1 when it is outside the grid. */
export function rowIndexForTime(time: string): number {
  const min = timeToMinutes(time);
  if (min < GRID_START_MIN || min >= GRID_END_MIN) return -1;
  if ((min - GRID_START_MIN) % STEP_MINUTES !== 0) return -1;
  return (min - GRID_START_MIN) / STEP_MINUTES;
}

/** How many rows a lesson of the given length covers. */
export function spanForDuration(durationMinutes: number): number {
  return Math.max(1, Math.round(durationMinutes / STEP_MINUTES));
}

/** True when a lesson starting at `hour` fits the axis without spilling past GRID_END. */
export function fitsInGrid(hour: string, durationMinutes: number): boolean {
  const start = timeToMinutes(hour);
  if (start % STEP_MINUTES !== 0) return false;
  return start >= GRID_START_MIN && start + durationMinutes <= GRID_END_MIN;
}

export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export type SlotLike = { day: number; hour: string; track: number };

export type PlacedBlock<T extends SlotLike> = {
  slot: T;
  durationMinutes: number;
  startMin: number;
  endMin: number;
  /** 0-based row the block starts on. */
  rowStart: number;
  /** Number of rows it covers. */
  rowSpan: number;
};

/** Turn raw slots into grid-positioned blocks. Slots outside the axis are dropped. */
export function placeBlocks<T extends SlotLike>(
  slots: T[],
  durationOf: (slot: T) => number,
): Array<PlacedBlock<T>> {
  const placed: Array<PlacedBlock<T>> = [];
  for (const slot of slots) {
    const rowStart = rowIndexForTime(slot.hour);
    if (rowStart < 0) continue;
    const durationMinutes = durationOf(slot);
    const startMin = timeToMinutes(slot.hour);
    placed.push({
      slot,
      durationMinutes,
      startMin,
      endMin: startMin + durationMinutes,
      rowStart,
      rowSpan: Math.min(spanForDuration(durationMinutes), ROW_COUNT - rowStart),
    });
  }
  return placed;
}

/** True when [start, start+duration) would clash with an existing block in that lane. */
export function hasConflict<T extends SlotLike>(
  blocks: Array<PlacedBlock<T>>,
  day: number,
  track: number,
  hour: string,
  durationMinutes: number,
): boolean {
  const start = timeToMinutes(hour);
  const end = start + durationMinutes;
  return blocks.some(
    (b) =>
      b.slot.day === day &&
      b.slot.track === track &&
      rangesOverlap(start, end, b.startMin, b.endMin),
  );
}

/** Column index (1-based, grid coordinates) of a lane, given the axis gutter is column 1. */
export function laneColumn(dayPosition: number, track: number): number {
  return 2 + dayPosition * 2 + (track - 1);
}
