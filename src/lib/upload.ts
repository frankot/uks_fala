"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteImage(url: string): Promise<void> {
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
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: folder || "uks-fala",
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
