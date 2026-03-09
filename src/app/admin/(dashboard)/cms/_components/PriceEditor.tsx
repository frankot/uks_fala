"use client";

interface PriceEntry {
  frequency: number;
  price: number;
}

interface Props {
  value: PriceEntry[];
  onChange: (prices: PriceEntry[]) => void;
  maxFrequency?: number;
}

function getLabel(freq: number): string {
  return `${freq}× / tydzień`;
}

export default function PriceEditor({ value, onChange, maxFrequency = 0 }: Props) {
  function getPrice(freq: number): string {
    const entry = value.find((p) => p.frequency === freq);
    return entry ? String(entry.price) : "";
  }

  function setPrice(freq: number, raw: string) {
    const num = parseInt(raw, 10);
    const without = value.filter((p) => p.frequency !== freq);
    if (!raw || isNaN(num) || num <= 0) {
      onChange(without);
    } else {
      onChange([...without, { frequency: freq, price: num }]);
    }
  }

  return (
    <div>
      <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
        Cennik (zł / miesiąc)
      </p>
      {maxFrequency === 0 && (
        <p className="text-[13px] text-sand-400 italic">Najpierw wybierz terminy treningów.</p>
      )}
      <div className="space-y-3">
        {Array.from({ length: maxFrequency }, (_, i) => i + 1).map((freq) => (
          <div key={freq} className="flex items-center gap-3">
            <label className="w-[120px] shrink-0 text-[13px] font-medium text-sand-700">
              {getLabel(freq)}
            </label>
            <input
              type="number"
              min="0"
              value={getPrice(freq)}
              onChange={(e) => setPrice(freq, e.target.value)}
              placeholder="—"
              className="w-[120px] rounded-xl border-2 border-sand-200 bg-sand-50 px-3 py-2 text-[14px] text-sand-900 placeholder:text-sand-300 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
            <span className="text-[13px] text-sand-400">zł</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-sand-400">
        Zostaw puste jeśli dana częstotliwość nie jest dostępna.
      </p>
    </div>
  );
}
