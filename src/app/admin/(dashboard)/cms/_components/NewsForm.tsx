"use client";

import { useState } from "react";
import { createNews, updateNews, type NewsFormData } from "@/lib/actions/news";
import ImageUploader from "./ImageUploader";
import { useRouter } from "next/navigation";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  published: boolean;
  publishedAt: string;
}

interface Props {
  item?: NewsItem;
  onClose: () => void;
}

function toDatetimeLocal(dateStr?: string) {
  if (!dateStr) return new Date().toISOString().slice(0, 16);
  return new Date(dateStr).toISOString().slice(0, 16);
}

export default function NewsForm({ item, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [content, setContent] = useState(item?.content ?? "");
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [published, setPublished] = useState(item?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(toDatetimeLocal(item?.publishedAt));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const data: NewsFormData = {
      title,
      description,
      content,
      images,
      published,
      publishedAt: new Date(publishedAt),
    };

    try {
      if (isEdit) {
        await updateNews(item.id, data);
      } else {
        await createNews(data);
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystapil blad");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-sand-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h3 className="text-[1.1rem] font-bold text-sand-900">
            {isEdit ? "Edytuj aktualnosc" : "Dodaj aktualnosc"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sand-400 transition-colors hover:bg-sand-100 hover:text-sand-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Tytul *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Nowy sezon treningowy"
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Opis krotki *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Krotki opis wyswietlany na kafelku"
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Tresc *
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Pelna tresc aktualnosci..."
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none resize-none"
            />
          </div>

          <ImageUploader value={images} onChange={setImages} folder="uks-fala/news" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Data publikacji
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-5 w-5 rounded border-sand-300 text-deep-600 focus:ring-deep-500"
                />
                <span className="text-[14px] font-semibold text-sand-700">
                  Opublikowany
                </span>
              </label>
            </div>
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
              {saving ? "Zapisywanie..." : isEdit ? "Zapisz zmiany" : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
