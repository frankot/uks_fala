"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSeasonalOffer,
  updateSeasonalOffer,
  type SeasonalOfferFormData,
} from "@/lib/actions/seasonal-offers";
import type { SeasonalOfferType } from "@/lib/queries/seasonal-offers";
import ImageUploader from "./ImageUploader";
import { usePendingImages } from "@/lib/use-pending-images";

export interface SeasonalOfferItem {
  id: string;
  type: SeasonalOfferType;
  title: string;
  slug: string;
  summary: string;
  locationName: string;
  locationAddress: string | null;
  startDate: string | null;
  endDate: string | null;
  ageRange: string | null;
  price: string | null;
  priceNote: string | null;
  accommodation: string | null;
  meals: string | null;
  transport: string | null;
  program: string;
  included: string | null;
  signupInfo: string | null;
  signupUrl: string | null;
  images: string[];
  published: boolean;
  featured: boolean;
  sortOrder: number;
}

interface Props {
  type: SeasonalOfferType;
  item?: SeasonalOfferItem;
  onClose: () => void;
}

const LABELS = {
  OBOZ: {
    singular: "obóz",
    create: "Dodaj obóz",
    edit: "Edytuj obóz",
    imageFolder: "uks-fala/obozy",
    defaultSignupUrl: "/obozy",
    signupUrlPlaceholder: "np. forms.gle/abc123 (puste = /obozy)",
  },
  POLKOLONIA: {
    singular: "półkolonię",
    create: "Dodaj półkolonię",
    edit: "Edytuj półkolonię",
    imageFolder: "uks-fala/polkolonie",
    defaultSignupUrl: "/polkolonie",
    signupUrlPlaceholder: "np. forms.gle/abc123 (puste = /polkolonie)",
  },
};

function toDateInput(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

function fromDateInput(value: string) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

export default function SeasonalOfferForm({ type, item, onClose }: Props) {
  const router = useRouter();
  const labels = LABELS[type];
  const isEdit = !!item;

  const [title, setTitle] = useState(item?.title ?? "");
  const [summary, setSummary] = useState(item?.summary ?? "");
  const [locationName, setLocationName] = useState(item?.locationName ?? "");
  const [locationAddress, setLocationAddress] = useState(
    item?.locationAddress ?? "",
  );
  const [startDate, setStartDate] = useState(toDateInput(item?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(item?.endDate));
  const [ageRange, setAgeRange] = useState(item?.ageRange ?? "");
  const [price, setPrice] = useState(item?.price ?? "");
  const [priceNote, setPriceNote] = useState(item?.priceNote ?? "");
  const [accommodation, setAccommodation] = useState(
    item?.accommodation ?? "",
  );
  const [meals, setMeals] = useState(item?.meals ?? "");
  const [transport, setTransport] = useState(item?.transport ?? "");
  const [program, setProgram] = useState(item?.program ?? "");
  const [included, setIncluded] = useState(item?.included ?? "");
  const [signupInfo, setSignupInfo] = useState(item?.signupInfo ?? "");
  const [signupUrl, setSignupUrl] = useState(item?.signupUrl ?? "");
  const images = usePendingImages(item?.images ?? [], labels.imageFolder);
  const [published, setPublished] = useState(item?.published ?? false);
  const [featured, setFeatured] = useState(item?.featured ?? false);
  const [sortOrder, setSortOrder] = useState(item?.sortOrder ?? 0);
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

      const data: SeasonalOfferFormData = {
        type,
        title,
        summary,
        locationName,
        locationAddress,
        startDate: fromDateInput(startDate),
        endDate: fromDateInput(endDate),
        ageRange,
        price,
        priceNote,
        accommodation,
        meals,
        transport,
        program,
        included,
        signupInfo,
        signupUrl,
        images: uploadedImages,
        published,
        featured,
        sortOrder,
      };

      if (isEdit) {
        await updateSeasonalOffer(item.id, data);
      } else {
        await createSeasonalOffer(data);
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
      <div className="mx-4 w-full max-w-4xl rounded-2xl border border-sand-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <div>
            <h3 className="text-[1.1rem] font-bold text-sand-900">
              {isEdit ? labels.edit : labels.create}
            </h3>
            <p className="mt-1 text-[12px] text-sand-500">
              Treść pojawi się na publicznej stronie po opublikowaniu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-sand-400 transition-colors hover:bg-sand-100 hover:text-sand-600"
            aria-label="Zamknij formularz"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Tytuł *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="np. Letni obóz pływacki"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Kolejność
              </label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Krótki opis *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Zwięzły opis widoczny na kafelku i w nagłówku strony."
              className="mt-2 block w-full resize-none rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Miejsce *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="np. OSiR Nieporęt"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Adres
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="np. ul. Koncertowa 4"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Data od
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Data do
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Wiek
              </label>
              <input
                type="text"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                placeholder="np. 7–13 lat"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
                Cena
              </label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="np. 1490 zł"
                className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Dopisek do ceny
            </label>
            <input
              type="text"
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              placeholder="np. Cena obejmuje wyżywienie i opiekę trenerską."
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
              Link przycisku &bdquo;Zarezerwuj miejsce&rdquo;
            </label>
            <input
              type="text"
              value={signupUrl}
              onChange={(e) => setSignupUrl(e.target.value)}
              placeholder={labels.signupUrlPlaceholder}
              className="mt-2 block w-full rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-sand-400">
              Dowolny link, np. do formularza Google — możesz wkleić go w całości
              albo wpisać sam adres (test.pl). Linki zewnętrzne otwierają się w
              nowej karcie. Puste pole = przycisk prowadzi na stronę{" "}
              {labels.defaultSignupUrl}.
            </p>
          </div>

          <ImageUploader images={images} />

          <div className="grid gap-4 lg:grid-cols-2">
            <LongField label="Program *" value={program} onChange={setProgram} required />
            <LongField label="Co zawiera cena" value={included} onChange={setIncluded} />
            <LongField label="Zakwaterowanie" value={accommodation} onChange={setAccommodation} />
            <LongField label="Wyżywienie" value={meals} onChange={setMeals} />
            <LongField label="Transport" value={transport} onChange={setTransport} />
            <LongField label="Zapisy / informacje organizacyjne" value={signupInfo} onChange={setSignupInfo} />
          </div>

          <div className="flex flex-wrap gap-6 rounded-xl bg-sand-50 p-4">
            <label className="flex cursor-pointer items-center gap-3">
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
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-5 w-5 rounded border-sand-300 text-coral-600 focus:ring-coral-500"
              />
              <span className="text-[14px] font-semibold text-sand-700">
                Wyróżniony
              </span>
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-coral-50 px-4 py-3 text-[14px] text-coral-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-sand-100 pt-6">
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
              {saving ? "Zapisywanie..." : isEdit ? "Zapisz zmiany" : labels.create}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LongField({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[12px] font-bold uppercase tracking-wider text-sand-500">
        {label}
      </label>
      <textarea
        required={required}
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 block w-full resize-none rounded-xl border-2 border-sand-200 bg-sand-50 px-4 py-2.5 text-[14px] text-sand-900 placeholder:text-sand-400 transition-colors focus:border-deep-400 focus:bg-white focus:outline-none"
      />
    </div>
  );
}
