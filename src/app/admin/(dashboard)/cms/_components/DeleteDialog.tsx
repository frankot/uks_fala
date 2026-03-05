"use client";

interface Props {
  itemName: string;
  itemType: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({ itemName, itemType, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-sand-200 bg-white p-6 shadow-xl">
        <h3 className="text-[1.1rem] font-bold text-sand-900">Usun {itemType}</h3>
        <p className="mt-2 text-[14px] text-sand-600">
          Czy na pewno chcesz usunac <strong>{itemName}</strong>? Tej
          operacji nie mozna cofnac.
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-xl border border-sand-200 px-4 py-2 text-[13px] font-semibold text-sand-700 transition-colors hover:bg-sand-50"
          >
            Anuluj
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-coral-500 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-coral-600"
          >
            Usun
          </button>
        </div>
      </div>
    </div>
  );
}
