"use client";

import { useState } from "react";
import { deleteGroup } from "@/lib/actions/groups";
import { COLOR_PRESETS, type ColorPresetKey } from "@/lib/color-presets";
import GroupForm from "./GroupForm";
import DeleteGroupDialog from "./DeleteGroupDialog";
import { useRouter } from "next/navigation";

interface Slot {
  id: string;
  day: number;
  hour: string;
  groupId: string;
}

interface Price {
  id: string;
  frequency: number;
  price: number;
  groupId: string;
}

interface Group {
  id: string;
  name: string;
  number: string;
  ageRange: string;
  colorPreset: string;
  sortOrder: number;
  active: boolean;
  slots: Slot[];
  prices: Price[];
}

const DAYS_SHORT = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];

interface Props {
  groups: Group[];
}

export default function GrafikTab({ groups }: Props) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openCreate() {
    setEditGroup(undefined);
    setFormOpen(true);
  }

  function openEdit(g: Group) {
    setEditGroup(g);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGroup(deleteTarget.id);
      router.refresh();
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[14px] text-sand-600">
            {groups.length === 0
              ? "Brak grup. Strona publiczna wyświetla dane domyślne."
              : `${groups.length} grup`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-deep-700 px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Dodaj grupę
        </button>
      </div>

      {groups.length > 0 && (
        <div className="space-y-3">
          {groups.map((g) => {
            const c =
              COLOR_PRESETS[g.colorPreset as ColorPresetKey] ??
              COLOR_PRESETS.pool;
            const slotDays = [...new Set(g.slots.map((s) => s.day))].sort();
            const priceStr = g.prices
              .sort((a, b) => a.frequency - b.frequency)
              .map((p) => `${p.frequency}×: ${p.price} zł`)
              .join(", ");

            return (
              <div
                key={g.id}
                className="flex items-center gap-4 rounded-xl border border-sand-200 bg-white px-5 py-4 shadow-sm"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${c.bg} ${c.text}`}
                >
                  {g.number}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-bold text-sand-900 truncate">
                      {g.name}
                    </p>
                    <span className="shrink-0 text-[12px] text-sand-400">
                      {g.ageRange}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-sand-500">
                    <span>
                      {slotDays.map((d) => DAYS_SHORT[d]).join(", ")} (
                      {g.slots.length} terminów)
                    </span>
                    {priceStr && <span>{priceStr}</span>}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(g)}
                    className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:bg-sand-50 hover:text-sand-700"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(g)}
                    className="rounded-lg border border-sand-200 p-2 text-sand-500 transition-colors hover:bg-coral-50 hover:text-coral-600 hover:border-coral-200"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <GroupForm
          group={editGroup}
          allGroups={groups}
          onClose={() => {
            setFormOpen(false);
            setEditGroup(undefined);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteGroupDialog
          groupName={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
