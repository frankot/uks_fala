"use client";

import type { PendingImages } from "@/lib/use-pending-images";
import { ACCEPTED_FORMATS_LABEL } from "@/lib/upload-limits";

interface Props {
  images: PendingImages;
}

/**
 * Presentational half of the image picker — all state lives in
 * `usePendingImages`, which the parent form also needs so it can send the files
 * from its own submit handler.
 */
export default function ImageUploader({ images }: Props) {
  const { items, add, remove, busy, pendingCount, error } = images;

  function handleAdd() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) void add(file);
    };
    input.click();
  }

  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
        Zdjęcia
      </label>
      <div className="mt-2 flex flex-wrap gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative h-20 w-20 overflow-hidden rounded-xl border border-sand-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" className="h-full w-full object-cover" />
            {item.kind === "pending" && (
              <span className="absolute inset-x-0 bottom-0 bg-deep-700/85 py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
                Do wysłania
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label="Usuń zdjęcie"
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          disabled={busy}
          className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-sand-300 text-sand-400 transition-colors hover:border-deep-400 hover:text-deep-500 disabled:opacity-50"
        >
          {busy ? (
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-2 text-[12px] text-sand-400">
        {pendingCount > 0
          ? `${pendingCount} ${pendingCount === 1 ? "zdjęcie zostanie wysłane" : "zdjęcia/zdjęć zostanie wysłanych"} po zapisaniu formularza.`
          : `Zdjęcia są automatycznie zmniejszane i wysyłane dopiero przy zapisie. Formaty: ${ACCEPTED_FORMATS_LABEL}.`}
      </p>

      {error && (
        <div
          role="alert"
          className="mt-2 flex items-start gap-2.5 rounded-xl border-2 border-coral-300 bg-coral-50 px-4 py-3"
        >
          <svg
            className="mt-px shrink-0 text-coral-600"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[13px] font-semibold leading-snug text-coral-700">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
