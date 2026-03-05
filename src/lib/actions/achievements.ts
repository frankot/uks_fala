"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AchievementSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  content: z.string().min(1),
  images: z.array(z.string().url()).default([]),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().default(() => new Date()),
});

export type AchievementFormData = z.infer<typeof AchievementSchema>;

function revalidate() {
  revalidatePath("/");
  revalidatePath("/osiagniecia");
  revalidatePath("/admin/cms");
}

export async function createAchievement(data: AchievementFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = AchievementSchema.parse(data);

  await prisma.achievement.create({
    data: {
      ...parsed,
      slug: slugify(parsed.title),
    },
  });

  revalidate();
}

export async function updateAchievement(id: string, data: AchievementFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = AchievementSchema.parse(data);

  await prisma.achievement.update({
    where: { id },
    data: parsed,
  });

  revalidate();
}

export async function deleteAchievement(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.achievement.delete({ where: { id } });

  revalidate();
}
