"use client";

import { useState } from "react";
import { deleteCoach } from "@/lib/actions/coaches";
import CoachForm from "./CoachForm";
import DeleteDialog from "./DeleteDialog";
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
  coaches: CoachItem[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TrenerzyTab({ coaches }: Props) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<CoachItem | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<CoachItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditItem(undefined);
    setFormOpen(true);
  }

  function openEdit(item: CoachItem) {
    setEditItem(item);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCoach(deleteTarget.id);
      router.refresh();
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-[14px] text-sand-600">
          {coaches.length === 0
            ? "Brak trenerów."
            : `${coaches.length} trenerów`}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-deep-700 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Dodaj trenera
        </button>
      </div>

      {coaches.length > 0 && (
        <div className="space-y-3">
          {coaches.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 shadow-sm"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-deep-100">
                  <span className="text-[14px] font-bold text-deep-600">
                    {getInitials(item.name)}
                  </span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-bold text-sand-900 truncate">
                    {item.name}
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
                </div>
                <div className="mt-1 flex gap-3 text-[12px] text-sand-500">
                  <span>{item.role}</span>
                  <span>kolejność: {item.sortOrder}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:bg-sand-50 hover:text-sand-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:bg-coral-50 hover:text-coral-600 hover:border-coral-200"
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
        <CoachForm
          item={editItem}
          onClose={() => {
            setFormOpen(false);
            setEditItem(undefined);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          itemName={deleteTarget.name}
          itemType="trenera"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
