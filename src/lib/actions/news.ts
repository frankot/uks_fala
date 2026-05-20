"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const NewsSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
  images: z.array(z.string().url()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().default(() => new Date()),
});

export type NewsFormData = z.infer<typeof NewsSchema>;

function revalidate() {
  revalidatePath("/");
  revalidatePath("/aktualnosci");
  revalidatePath("/admin/cms");
}

export async function createNews(data: NewsFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = NewsSchema.parse(data);

  await prisma.news.create({
    data: {
      ...parsed,
      slug: slugify(parsed.title),
    },
  });

  revalidate();
}

export async function updateNews(id: string, data: NewsFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = NewsSchema.parse(data);

  const existing = await prisma.news.findUnique({
    where: { id },
    select: { images: true },
  });

  if (existing) {
    const removed = existing.images.filter((url) => !parsed.images.includes(url));
    await Promise.allSettled(removed.map(deleteImage));
  }

  await prisma.news.update({
    where: { id },
    data: parsed,
  });

  revalidate();
}

export async function deleteNews(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const item = await prisma.news.findUnique({
    where: { id },
    select: { images: true },
  });

  await prisma.news.delete({ where: { id } });

  if (item) {
    await Promise.allSettled(item.images.map(deleteImage));
  }

  revalidate();
}
