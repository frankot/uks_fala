"use client";

import { useState } from "react";
import { upsertSemesterDayCount } from "@/lib/actions/semester";
import { useRouter } from "next/navigation";

const DAY_LABELS = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Niedziela",
];

const DAY_FIELDS = ["mon", "tue", "wed", "thu", "fri", "sun"] as const;

interface Props {
  current: number[] | null; // [mon, tue, wed, thu, fri, sun] or null
  onClose: () => void;
}

export default function SemesterModal({ current, onClose }: Props) {
  const router = useRouter();
  const defaultValues = current ?? [0, 0, 0, 0, 0, 0];
  const [values, setValues] = useState<number[]>(defaultValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setDay(idx: number, raw: string) {
    const num = parseInt(raw, 10);
    setValues((prev) => {
      const next = [...prev];
      next[idx] = isNaN(num) ? 0 : Math.max(0, num);
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await upsertSemesterDayCount({
        mon: values[0],
        tue: values[1],
        wed: values[2],
        thu: values[3],
        fri: values[4],
        sun: values[5],
      });
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-sand-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h3 className="text-[1.1rem] font-bold text-sand-900">
            Liczba zajęć w semestrze
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-[13px] text-sand-500">
            Ustal, ile razy każdy dzień tygodnia wypada w obecnym semestrze. Na
            tej podstawie liczona jest całkowita cena za semestr.
          </p>

          <div className="space-y-3">
            {DAY_LABELS.map((label, idx) => (
              <div key={label} className="flex items-center gap-3">
                <label className="w-[120px] shrink-0 text-[13px] font-medium text-sand-700">
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={values[idx]}
                  onChange={(e) => setDay(idx, e.target.value)}
                  className="w-[80px] rounded-xl border-2 border-sand-200 bg-sand-50 px-3 py-2 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
                />
                <span className="text-[13px] text-sand-400">zajęć</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-deep-50 border border-deep-100 px-4 py-3">
            <p className="text-[12px] font-bold uppercase tracking-wider text-deep-400">
              Suma
            </p>
            <p className="mt-1 text-[1.5rem] font-bold text-deep-800">
              {values.reduce((a, b) => a + b, 0)}
              <span className="text-[14px] font-semibold text-deep-400 ml-1">
                zajęć
              </span>
            </p>
          </div>

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
              {saving ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
