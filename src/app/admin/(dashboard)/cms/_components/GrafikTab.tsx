"use client";

import { useState } from "react";
import { deleteGroup } from "@/lib/actions/groups";
import { COLOR_PRESETS, type ColorPresetKey } from "@/lib/color-presets";
import GroupForm from "./GroupForm";
import type { GroupWithRelations } from "./GroupForm";
import DeleteGroupDialog from "./DeleteGroupDialog";
import SemesterModal from "./SemesterModal";
import { useRouter } from "next/navigation";

const DAYS_SHORT = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];

interface Props {
  groups: GroupWithRelations[];
  semesterDayCount: number[] | null;
}

export default function GrafikTab({ groups, semesterDayCount }: Props) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<GroupWithRelations | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<GroupWithRelations | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [semesterOpen, setSemesterOpen] = useState(false);

  function openCreate() {
    setEditGroup(undefined);
    setFormOpen(true);
  }

  function openEdit(g: GroupWithRelations) {
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSemesterOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-sand-300 bg-white px-4 py-2.5 text-[13px] font-bold text-sand-700 transition-colors hover:bg-sand-50"
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
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Ustal dni semestru
          </button>
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
                    <span className="shrink-0 text-[12px] text-sand-400">
                      · {g.lessonDuration} min
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
          semesterDayCount={semesterDayCount}
          onClose={() => {
            setFormOpen(false);
            setEditGroup(undefined);
          }}
        />
      )}

      {semesterOpen && (
        <SemesterModal
          current={semesterDayCount}
          onClose={() => setSemesterOpen(false)}
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
