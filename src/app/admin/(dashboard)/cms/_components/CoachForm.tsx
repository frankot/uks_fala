"use client";

import { useState } from "react";
import {
  createCoach,
  updateCoach,
  type CoachFormData,
} from "@/lib/actions/coaches";
import ImageUploader from "./ImageUploader";
import { usePendingImages } from "@/lib/use-pending-images";
import { useRouter } from "next/navigation";

interface CoachItem {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string | null;
  colorPreset: string;
  sortOrder: number;
  published: boolean;
}

interface Props {
  item?: CoachItem;
  onClose: () => void;
}

export default function CoachForm({ item, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!item;

  const [name, setName] = useState(item?.name ?? "");
  const [role, setRole] = useState(item?.role ?? "");
  const [bio, setBio] = useState(item?.bio ?? "");
  const images = usePendingImages(
    item?.imageUrl ? [item.imageUrl] : [],
    "uks-fala/coaches",
  );
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);
  const [published, setPublished] = useState(item?.published ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      // Files are sent now, not when they were picked — abandoning the form
      // must not leave orphaned assets in Cloudinary.
      const uploadedImages = await images.uploadPending();

      const data: CoachFormData = {
        name,
        role,
        bio,
        imageUrl: uploadedImages[0] ?? "",
        sortOrder,
        published,
      };

      if (isEdit) {
        await updateCoach(item.id, data);
      } else {
        await createCoach(data);
      }
      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8">
      <div className="mx-4 w-full max-w-2xl rounded-2xl border border-sand-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h3 className="text-[1.1rem] font-bold text-sand-900">
            {isEdit ? "Edytuj trenera" : "Dodaj trenera"}
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
              Imię i nazwisko *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="np. Bartosz Krawczak"
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Rola / stanowisko *
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="np. Trener główny / Prezes klubu"
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Opis *
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Krótki opis trenera, doświadczenie, specjalizacja..."
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none resize-none"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ImageUploader images={images} />

            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-2">
                Kolejność
              </label>
              <input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                className="block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
              <p className="mt-1 text-[12px] text-sand-400">
                Niższa liczba = wyższa pozycja
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published-coach"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5 rounded border-sand-300 text-deep-600 focus:ring-deep-500"
            />
            <label htmlFor="published-coach" className="text-[14px] font-semibold text-sand-700 cursor-pointer">
              Opublikowany
            </label>
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
