/**
 * Browser-side image downscaling, run before the file is handed to the upload
 * action.
 *
 * Photos straight off a phone are routinely 3–8 MB, which is both over our
 * upload cap and far larger than anything the site displays. Re-encoding in the
 * browser costs nothing (no Cloudinary transformation, no server CPU) and turns
 * a typical 5 MB photo into roughly 200–400 KB, so the club can pick any photo
 * and never meet a size error.
 *
 * Every failure path returns the original file: compression is an optimisation,
 * never a reason for an upload to fail.
 */

/** Longest edge of the stored image. Above the largest size the site renders. */
const MAX_DIMENSION = 1920;

const QUALITY = 0.82;

/** Guard against decoding something absurd into a canvas. */
export const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

/**
 * Animated GIFs would be flattened to a single frame, and SVG is vector — both
 * are passed through untouched.
 */
const SKIP_TYPES = ["image/gif", "image/svg+xml"];

export type CompressResult = {
  file: File;
  /** True when the returned file is a re-encoded copy rather than the original. */
  compressed: boolean;
  originalBytes: number;
};

export async function compressImage(file: File): Promise<CompressResult> {
  const original: CompressResult = {
    file,
    compressed: false,
    originalBytes: file.size,
  };

  if (SKIP_TYPES.includes(file.type)) return original;
  if (typeof createImageBitmap !== "function") return original;

  try {
    // `from-image` applies the EXIF orientation flag, so photos taken sideways
    // are not silently rotated by the re-encode.
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
    );
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return original;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/webp", QUALITY);
    });

    // Already-optimised files can come out larger after re-encoding — keep
    // whichever is smaller.
    if (!blob || blob.size >= file.size) return original;

    const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return {
      file: new File([blob], name, { type: "image/webp" }),
      compressed: true,
      originalBytes: file.size,
    };
  } catch {
    return original;
  }
}
