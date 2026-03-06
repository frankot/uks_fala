"use client";

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob"];
const TIME_SLOTS = [
  "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

interface Slot {
  day: number;
  hour: string;
}

interface Props {
  value: Slot[];
  onChange: (slots: Slot[]) => void;
  occupiedSlots?: Map<string, string>;
}

export default function SlotEditor({ value, onChange, occupiedSlots }: Props) {
  function isSelected(day: number, hour: string) {
    return value.some((s) => s.day === day && s.hour === hour);
  }

  function getOccupiedBy(day: number, hour: string): string | undefined {
    return occupiedSlots?.get(`${day}-${hour}`);
  }

  function toggle(day: number, hour: string) {
    if (isSelected(day, hour)) {
      onChange(value.filter((s) => !(s.day === day && s.hour === hour)));
    } else {
      onChange([...value, { day, hour }]);
    }
  }

  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
        Terminy treningów
      </p>
      <div className="overflow-x-auto rounded-xl border border-sand-200">
        <table className="w-full border-collapse text-sm table-fixed">
          <thead>
            <tr className="border-b border-sand-200 bg-sand-50">
              <th className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400 w-16">
                Godz.
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour) => (
              <tr key={hour} className="border-b border-sand-100">
                <td className="px-3 py-2 text-[13px] font-medium text-sand-500">
                  {hour}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const selected = isSelected(dayIdx, hour);
                  const occupiedBy = getOccupiedBy(dayIdx, hour);
                  return (
                    <td key={dayIdx} className="px-1.5 py-2 text-center">
                      {occupiedBy ? (
                        <div
                          className="flex h-8 w-full items-center justify-center rounded-md bg-deep-700/15 cursor-not-allowed"
                          title={occupiedBy}
                        >
                          <span className="truncate px-1 text-[10px] font-bold text-deep-600 select-none">
                            {occupiedBy}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggle(dayIdx, hour)}
                          className={`h-8 w-full rounded-md transition-all ${
                            selected
                              ? "bg-coral-500 shadow-sm"
                              : "bg-sand-100 hover:bg-sand-200"
                          }`}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sand-400">
        <span>Kliknij komórkę aby dodać/usunąć termin. Zaznaczono: {value.length}</span>
        {occupiedSlots && occupiedSlots.size > 0 && (
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-sm bg-deep-700/15" />
            Zajęte przez inne grupy
          </span>
        )}
      </div>
    </div>
  );
}
