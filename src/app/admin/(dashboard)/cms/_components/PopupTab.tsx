"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertPopup } from "@/lib/actions/popup";

interface Props {
  popup: {
    active: boolean;
    title: string;
    content: string;
    delaySeconds: number;
  } | null;
}

export default function PopupTab({ popup }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(popup?.active ?? false);
  const [title, setTitle] = useState(popup?.title ?? "");
  const [content, setContent] = useState(popup?.content ?? "");
  const [delaySeconds, setDelaySeconds] = useState(popup?.delaySeconds ?? 3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      await upsertPopup({ active, title, content, delaySeconds });
      router.refresh();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-[1.1rem] font-bold text-sand-900">
          Wyskakujące okno
        </h2>
        <p className="mt-1 text-[13px] text-sand-500">
          Komunikat pokazywany odwiedzającym stronę główną po ustawionym czasie.
          Po zamknięciu nie pojawia się ponownie w tej samej sesji.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-sand-200 bg-white p-6"
      >
        <label className="flex items-start gap-3 rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-3.5 cursor-pointer transition-colors hover:border-sand-300">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-deep-700"
          />
          <span>
            <span className="block text-[14px] font-bold text-sand-900">
              Aktywne
            </span>
            <span className="block text-[12px] text-sand-500">
              Gdy odznaczone, okno nie wyświetla się nikomu.
            </span>
          </span>
        </label>

        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
            Tytuł
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="np. Zapisy na sezon 2026/2027"
            maxLength={120}
            className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
            Treść
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={7}
            maxLength={2000}
            placeholder="Treść komunikatu. Pusta linia rozdziela akapity."
            className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] leading-relaxed text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-sand-400">
            {content.length}/2000 znaków
          </p>
        </div>

        <div>
          <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
            Opóźnienie
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={60}
              value={delaySeconds}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                setDelaySeconds(
                  isNaN(num) ? 0 : Math.min(60, Math.max(0, num)),
                );
              }}
              className="w-[90px] rounded-xl border-2 border-sand-200 bg-sand-50 px-3 py-2 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
            <span className="text-[13px] text-sand-500">
              sekund od wejścia na stronę główną
            </span>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          {saved && !saving && (
            <span className="text-[13px] font-semibold text-emerald-600">
              Zapisano
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-deep-700 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800 disabled:opacity-60"
          >
            {saving ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-sand-400">
          Podgląd
        </p>
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
          <div className="mx-auto max-w-lg overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="h-1.5 w-full bg-gradient-to-r from-deep-700 via-deep-400 to-pool-400" />
            <div className="px-7 pb-7 pt-8">
              <h3 className="text-[1.5rem] font-bold leading-tight text-deep-900">
                {title || "Tytuł komunikatu"}
              </h3>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-sand-700">
                {content || "Treść komunikatu pojawi się w tym miejscu."}
              </p>
              <div className="mt-7 flex justify-end">
                <span className="rounded-xl bg-deep-700 px-6 py-3 text-[14px] font-bold text-white">
                  Rozumiem
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
