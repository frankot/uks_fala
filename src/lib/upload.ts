"use server";

import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Both exports are server actions reachable from the client bundle, which makes
 * them public HTTP endpoints — without the session check below, anyone could
 * fill the Cloudinary account or permanently destroy the club's media.
 */
async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
}

/**
 * `folder` arrives from the client, so it is matched against the folders the CMS
 * actually uses rather than passed through to Cloudinary as given.
 */
const ALLOWED_FOLDERS = [
  "uks-fala",
  "uks-fala/news",
  "uks-fala/achievements",
  "uks-fala/coaches",
  "uks-fala/obozy",
  "uks-fala/polkolonie",
] as const;

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function deleteImage(url: string): Promise<void> {
  await requireSession();

  const parts = url.split("/upload/");
  if (parts.length !== 2) return;

  const rest = parts[1].replace(/^v\d+\//, "");
  const publicId = rest.replace(/\.[^.]+$/, "");

  await cloudinary.uploader.destroy(publicId);
}

export async function uploadImage(
  file: File,
  folder?: string,
): Promise<string> {
  await requireSession();

  if (file.size > MAX_SIZE) {
    throw new Error("Plik przekracza maksymalny rozmiar 5 MB.");
  }

  // `accept="image/*"` on the input is a hint to the file picker, not a control.
  if (!file.type.startsWith("image/")) {
    throw new Error("Dozwolone są wyłącznie pliki graficzne.");
  }

  const target = folder ?? "uks-fala";
  if (!ALLOWED_FOLDERS.includes(target as (typeof ALLOWED_FOLDERS)[number])) {
    throw new Error("Nieprawidłowy katalog docelowy.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: target,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else if (!result)
              reject(new Error("Cloudinary returned no result"));
            else resolve(result as { secure_url: string });
          },
        )
        .end(buffer);
    },
  );

  return result.secure_url;
}
