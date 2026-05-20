"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CoachSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  bio: z.string().min(1).max(1000),
  imageUrl: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});

export type CoachFormData = z.infer<typeof CoachSchema>;

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/cms");
}

export async function createCoach(data: CoachFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = CoachSchema.parse(data);

  await prisma.coach.create({
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidate();
}

export async function updateCoach(id: string, data: CoachFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = CoachSchema.parse(data);

  await prisma.coach.update({
    where: { id },
    data: {
      ...parsed,
      imageUrl: parsed.imageUrl || null,
    },
  });

  revalidate();
}

export async function deleteCoach(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.coach.delete({ where: { id } });

  revalidate();
}
