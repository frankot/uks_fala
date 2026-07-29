"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function ImageUploader({ value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd() {
    setError("");
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > MAX_SIZE) {
        setError(
          `Plik jest za duży (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksymalny rozmiar to 5 MB.`,
        );
        return;
      }

      setUploading(true);
      try {
        const url = await uploadImage(file, folder);
        onChange([...value, url]);
      } catch {
        setError("Wystąpił błąd podczas przesyłania. Spróbuj ponownie.");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
        Zdjecia
      </label>
      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((url, i) => (
          <div
            key={i}
            className="group relative h-20 w-20 overflow-hidden rounded-xl border border-sand-200"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(i)}
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
          disabled={uploading}
          className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-sand-300 text-sand-400 transition-colors hover:border-deep-400 hover:text-deep-500 disabled:opacity-50"
        >
          {uploading ? (
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
      {error && (
        <p className="mt-2 text-[13px] text-coral-600">{error}</p>
      )}
    </div>
  );
}
