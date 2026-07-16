"use client";

import { useState, useMemo } from "react";
import {
  createGroup,
  updateGroup,
  type GroupFormData,
} from "@/lib/actions/groups";
import { type ColorPresetKey } from "@/lib/color-presets";
import ColorPicker from "./ColorPicker";
import SlotEditor from "./SlotEditor";
import PriceEditor from "./PriceEditor";
import { useRouter } from "next/navigation";

interface Slot {
  day: number;
  hour: string;
}

interface PriceEntry {
  frequency: number;
  price: number;
}

interface GroupWithRelations {
  id: string;
  name: string;
  number: string;
  ageRange: string;
  colorPreset: string;
  sortOrder: number;
  slots: Slot[];
  prices: PriceEntry[];
}

interface Props {
  group?: GroupWithRelations;
  allGroups?: GroupWithRelations[];
  onClose: () => void;
}

export default function GroupForm({ group, allGroups, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!group;

  // Build map of occupied slots from other groups
  const occupiedSlots = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of allGroups ?? []) {
      if (isEdit && g.id === group.id) continue;
      for (const s of g.slots) {
        map.set(`${s.day}-${s.hour}`, g.name);
      }
    }
    return map;
  }, [allGroups, isEdit, group?.id]);

  const [name, setName] = useState(group?.name ?? "");
  const [number, setNumber] = useState(group?.number ?? "");
  const [ageRange, setAgeRange] = useState(group?.ageRange ?? "");
  const [colorPreset, setColorPreset] = useState(group?.colorPreset ?? "pool");
  const [sortOrder, setSortOrder] = useState(group?.sortOrder ?? 0);
  const [slots, setSlots] = useState<Slot[]>(
    group?.slots.map((s) => ({ day: s.day, hour: s.hour })) ?? [],
  );
  const [prices, setPrices] = useState<PriceEntry[]>(
    group?.prices.map((p) => ({ frequency: p.frequency, price: p.price })) ??
      [],
  );
  const uniqueDays = new Set(slots.map((s) => s.day)).size;

  function handleSlotsChange(newSlots: Slot[]) {
    const days = new Set(newSlots.map((s) => s.day)).size;
    setSlots(newSlots);
    setPrices((prev) => prev.filter((p) => p.frequency <= days));
  }

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (slots.length === 0) {
      setError("Dodaj przynajmniej jeden termin treningu.");
      return;
    }
    if (prices.length === 0) {
      setError("Dodaj przynajmniej jedną cenę.");
      return;
    }

    setSaving(true);
    const data: GroupFormData = {
      name,
      number,
      ageRange,
      colorPreset,
      sortOrder,
      slots,
      prices,
    };

    try {
      if (isEdit) {
        await updateGroup(group.id, data);
      } else {
        await createGroup(data);
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start  justify-center overflow-y-auto bg-black/40 py-8">
      <div className="mx-4 w-full max-w-4xl rounded-2xl border border-sand-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h3 className="text-[1.1rem] font-bold text-sand-900">
            {isEdit ? "Edytuj grupę" : "Dodaj grupę"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sand-400 transition-colors hover:bg-sand-100 hover:text-sand-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 ">
          {/* Basic info */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Nazwa grupy *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="np. Krewetki"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Numer *
              </label>
              <input
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="01"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Przedział wiekowy *
              </label>
              <input
                type="text"
                required
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="3–5 lat"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Kolejność sortowania
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(parseInt(e.target.value, 10) || 0)
                }
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <ColorPicker
            value={colorPreset}
            onChange={(key) => setColorPreset(key)}
          />

          <SlotEditor
            value={slots}
            onChange={handleSlotsChange}
            occupiedSlots={occupiedSlots}
          />

          <PriceEditor
            value={prices}
            onChange={setPrices}
            maxFrequency={uniqueDays}
          />

          {/* Preview */}
          {(name || slots.length > 0 || prices.length > 0) && (
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
                Podgląd
              </p>
              <div className="rounded-xl border border-sand-200 bg-sand-50 p-4 space-y-3">
                {/* Group info */}
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-sand-700">
                  {name && (
                    <span>
                      <span className="font-semibold text-sand-900">
                        {name}
                      </span>
                      {number && (
                        <span className="text-sand-400"> #{number}</span>
                      )}
                    </span>
                  )}
                  {ageRange && <span>Wiek: {ageRange}</span>}
                </div>

                {/* Slots table */}
                {slots.length > 0 &&
                  (() => {
                    const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];
                    const slotsByDay = slots.reduce<Record<number, string[]>>(
                      (acc, s) => {
                        (acc[s.day] ??= []).push(s.hour);
                        return acc;
                      },
                      {},
                    );
                    const activeDays = Object.keys(slotsByDay)
                      .map(Number)
                      .sort((a, b) => a - b);

                    return (
                      <div className="overflow-x-auto rounded-lg border border-sand-200">
                        <table className="w-full border-collapse text-[12px]">
                          <thead>
                            <tr className="border-b border-sand-200 bg-sand-100">
                              <th className="px-3 py-1.5 text-left font-bold uppercase tracking-wider text-sand-400">
                                Dzień
                              </th>
                              <th className="px-3 py-1.5 text-left font-bold uppercase tracking-wider text-sand-400">
                                Godziny
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeDays.map((dayIdx) => (
                              <tr
                                key={dayIdx}
                                className="border-b border-sand-100 last:border-0"
                              >
                                <td className="px-3 py-1.5 font-medium text-sand-700">
                                  {DAYS[dayIdx]}
                                </td>
                                <td className="px-3 py-1.5 text-sand-600">
                                  {slotsByDay[dayIdx].sort().join(", ")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}

                {/* Prices summary */}
                {prices.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {prices
                      .slice()
                      .sort((a, b) => a.frequency - b.frequency)
                      .map((p) => (
                        <span
                          key={p.frequency}
                          className="rounded-lg bg-white px-3 py-1 text-[12px] font-medium text-sand-700 border border-sand-200"
                        >
                          {p.frequency}×/tydz. — {p.price} zł
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-sand-200 px-5 py-2.5 text-[13px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-deep-700 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800 disabled:opacity-60"
            >
              {saving
                ? "Zapisywanie..."
                : isEdit
                  ? "Zapisz zmiany"
                  : "Dodaj grupę"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
