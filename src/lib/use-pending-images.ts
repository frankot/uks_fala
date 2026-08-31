"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadImage } from "@/lib/upload";
import { MAX_SOURCE_BYTES, compressImage } from "@/lib/compress-image";
import {
  ACCEPTED_FORMATS_LABEL,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_LABEL,
  formatMegabytes,
} from "@/lib/upload-limits";

/**
 * Image state for the CMS forms, holding chosen files locally until the form is
 * actually saved.
 *
 * Uploading on file-pick meant every abandoned form left an asset in Cloudinary
 * that nothing referenced and the CMS could not show, so the account collected
 * garbage no one could find or delete. Files now wait in memory and are sent by
 * `uploadPending()`, which the form calls from its submit handler — no save, no
 * upload.
 */

export type ImageItem =
  /** Already in Cloudinary: either loaded from the record or uploaded earlier. */
  | { kind: "uploaded"; id: string; url: string }
  /** Chosen but not yet sent — `url` is a local object URL for the preview. */
  | { kind: "pending"; id: string; url: string; file: File };

let counter = 0;
const nextId = () => `img-${++counter}`;

export type PendingImages = ReturnType<typeof usePendingImages>;

export function usePendingImages(initial: string[], folder: string) {
  const [items, setItems] = useState<ImageItem[]>(() =>
    initial.map((url) => ({ kind: "uploaded" as const, id: nextId(), url })),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Object URLs are revoked on unmount; a ref keeps the cleanup out of the
  // effect's dependencies so it does not re-run on every add or remove.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(
    () => () => {
      for (const item of itemsRef.current) {
        if (item.kind === "pending") URL.revokeObjectURL(item.url);
      }
    },
    [],
  );

  const add = useCallback(async (file: File) => {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        `To nie jest plik graficzny. Dozwolone formaty: ${ACCEPTED_FORMATS_LABEL}.`,
      );
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setError(
        `To zdjęcie waży ${formatMegabytes(file.size)} i jest zbyt duże, żeby je przetworzyć. Zmniejsz je i spróbuj ponownie.`,
      );
      return;
    }

    setBusy(true);
    try {
      // Shrunk immediately rather than at save time, so an unusable file is
      // reported while the club still remembers which one they picked.
      const { file: prepared } = await compressImage(file);

      if (prepared.size > MAX_UPLOAD_BYTES) {
        setError(
          `Nie udało się zmniejszyć tego pliku poniżej ${MAX_UPLOAD_LABEL} (ma ${formatMegabytes(prepared.size)}). Zapisz go jako JPG lub PNG i spróbuj ponownie.`,
        );
        return;
      }

      setItems((prev) => [
        ...prev,
        {
          kind: "pending",
          id: nextId(),
          url: URL.createObjectURL(prepared),
          file: prepared,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      // A pending file was never sent, so dropping it needs no Cloudinary call;
      // an uploaded one is deleted by the server action once the save commits.
      if (target?.kind === "pending") URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  /**
   * Sends every pending file and returns the final URL list in display order.
   * Throws on failure so the caller aborts the save rather than writing a record
   * that points at images which were never stored.
   */
  const uploadPending = useCallback(async (): Promise<string[]> => {
    const current = itemsRef.current;
    if (!current.some((item) => item.kind === "pending")) {
      return current.map((item) => item.url);
    }

    setBusy(true);
    try {
      const urls: string[] = [];
      for (const item of current) {
        urls.push(
          item.kind === "uploaded"
            ? item.url
            : await uploadImage(item.file, folder),
        );
      }
      return urls;
    } finally {
      setBusy(false);
    }
  }, [folder]);

  const pendingCount = items.filter((item) => item.kind === "pending").length;

  return { items, add, remove, uploadPending, busy, pendingCount, error, setError };
}
