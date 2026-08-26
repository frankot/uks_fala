"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const PopupSchema = z.object({
  active: z.boolean().default(false),
  title: z.string().max(120).default(""),
  content: z.string().max(2000).default(""),
  delaySeconds: z.number().int().min(0).max(60).default(3),
});

export type PopupFormData = z.infer<typeof PopupSchema>;

export async function upsertPopup(data: PopupFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = PopupSchema.parse(data);

  await prisma.popup.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed },
    update: parsed,
  });

  revalidatePath("/");
  revalidatePath("/admin/cms");
}
