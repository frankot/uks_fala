"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSeasonalOffer } from "@/lib/actions/seasonal-offers";
import type { SeasonalOfferType } from "@/lib/queries/seasonal-offers";
import DeleteDialog from "./DeleteDialog";
import SeasonalOfferForm, { type SeasonalOfferItem } from "./SeasonalOfferForm";

interface Props {
  type: SeasonalOfferType;
  offers: SeasonalOfferItem[];
}

const LABELS = {
  OBOZ: {
    plural: "obozy",
    singular: "obóz",
    add: "Dodaj obóz",
    empty: "Brak obozów.",
  },
  POLKOLONIA: {
    plural: "półkolonie",
    singular: "półkolonię",
    add: "Dodaj półkolonię",
    empty: "Brak półkolonii.",
  },
};

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) return "Bez daty";
  const formatter = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (startDate && endDate) {
    return `${formatter.format(new Date(startDate))} – ${formatter.format(new Date(endDate))}`;
  }
  return formatter.format(new Date(startDate ?? endDate ?? ""));
}

export default function SeasonalOffersTab({ type, offers }: Props) {
  const router = useRouter();
  const labels = LABELS[type];
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<SeasonalOfferItem | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<SeasonalOfferItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditItem(undefined);
    setFormOpen(true);
  }

  function openEdit(item: SeasonalOfferItem) {
    setEditItem(item);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSeasonalOffer(deleteTarget.id);
      router.refresh();
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[14px] text-sand-600">
          {offers.length === 0 ? labels.empty : `${offers.length} ${labels.plural}`}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-deep-700 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {labels.add}
        </button>
      </div>

      {offers.length > 0 && (
        <div className="space-y-3">
          {offers.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 shadow-sm"
            >
              {item.images[0] ? (
                <img
                  src={item.images[0]}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pool-100 to-deep-100 text-deep-400">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 20h18" />
                    <path d="M4 20a8 8 0 0 1 16 0" />
                    <path d="M12 4v8" />
                    <path d="M8 8l4-4 4 4" />
                  </svg>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-[14px] font-bold text-sand-900">
                    {item.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      item.published
                        ? "bg-green-100 text-green-700"
                        : "bg-sand-100 text-sand-500"
                    }`}
                  >
                    {item.published ? "Opublikowany" : "Szkic"}
                  </span>
                  {item.featured && (
                    <span className="shrink-0 rounded-full bg-coral-100 px-2 py-0.5 text-[11px] font-bold text-coral-700">
                      Wyróżniony
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-sand-500">
                  <span>{formatDateRange(item.startDate, item.endDate)}</span>
                  <span>{item.locationName}</span>
                  {item.price && <span>{item.price}</span>}
                  <span>kolejność: {item.sortOrder}</span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:bg-sand-50 hover:text-sand-700"
                  aria-label={`Edytuj ${item.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:border-coral-200 hover:bg-coral-50 hover:text-coral-600"
                  aria-label={`Usuń ${item.title}`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <SeasonalOfferForm
          type={type}
          item={editItem}
          onClose={() => {
            setFormOpen(false);
            setEditItem(undefined);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          itemName={deleteTarget.title}
          itemType={labels.singular}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {deleting && (
        <p className="mt-4 text-[13px] text-sand-500">Usuwanie...</p>
      )}
    </div>
  );
}
