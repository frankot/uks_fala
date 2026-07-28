"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SemesterSchema = z.object({
  label: z.string().max(30).default(""),
  mon: z.number().int().min(0),
  tue: z.number().int().min(0),
  wed: z.number().int().min(0),
  thu: z.number().int().min(0),
  fri: z.number().int().min(0),
  sun: z.number().int().min(0),
});

export type SemesterFormData = z.infer<typeof SemesterSchema>;

export async function upsertSemesterDayCount(data: SemesterFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = SemesterSchema.parse(data);

  await prisma.semesterDayCount.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed },
    update: parsed,
  });

  revalidatePath("/zajecia");
  revalidatePath("/admin/cms");
}
