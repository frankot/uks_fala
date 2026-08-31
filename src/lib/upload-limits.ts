/**
 * Upload limits shared by the client picker and the server action.
 *
 * Kept in their own module because `src/lib/upload.ts` is a `"use server"` file
 * and may only export async functions — a constant declared there could not be
 * imported by `ImageUploader`. Two copies of the number would drift, and the
 * mismatch is invisible until a real upload fails.
 *
 * 2 MB sits well under Vercel's hard 4.5 MB function request-body cap, which no
 * application config can raise: a file over that is rejected at the platform
 * edge with an opaque 413 before any of our code runs.
 */
export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** Human-readable form of the same limit, for UI copy and error messages. */
export const MAX_UPLOAD_LABEL = "2 MB";

export const ACCEPTED_FORMATS_LABEL = "JPG, PNG, WebP";

export function formatMegabytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
