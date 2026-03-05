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
}

export default function SlotEditor({ value, onChange }: Props) {
  function isSelected(day: number, hour: string) {
    return value.some((s) => s.day === day && s.hour === hour);
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
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand-200 bg-sand-50">
              <th className="px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-sand-400 w-[70px]">
                Godz.
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="px-2 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-sand-600"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((hour) => (
              <tr key={hour} className="border-b border-sand-100">
                <td className="px-3 py-1.5 text-[12px] font-medium text-sand-500">
                  {hour}
                </td>
                {DAYS.map((_, dayIdx) => {
                  const selected = isSelected(dayIdx, hour);
                  return (
                    <td key={dayIdx} className="px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => toggle(dayIdx, hour)}
                        className={`h-7 w-full max-w-[48px] rounded-md transition-all ${
                          selected
                            ? "bg-coral-500 shadow-sm"
                            : "bg-sand-100 hover:bg-sand-200"
                        }`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[11px] text-sand-400">
        Kliknij komórkę aby dodać/usunąć termin. Zaznaczono: {value.length}
      </p>
    </div>
  );
}
