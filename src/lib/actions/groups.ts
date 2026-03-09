"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SlotSchema = z.object({
  day: z.number().int().min(0).max(5),
  hour: z.string().regex(/^\d{2}:\d{2}$/),
});

const PriceSchema = z.object({
  frequency: z.number().int().min(1).max(6),
  price: z.number().int().positive(),
});

const GroupSchema = z.object({
  name: z.string().min(1).max(50),
  number: z.string().min(1).max(4),
  ageRange: z.string().min(1).max(20),
  colorPreset: z.string().min(1),
  sortOrder: z.number().int().default(0),
  slots: z.array(SlotSchema).min(1, "Dodaj przynajmniej jeden termin"),
  prices: z.array(PriceSchema).min(1, "Dodaj przynajmniej jedną cenę"),
});

export type GroupFormData = z.infer<typeof GroupSchema>;

function revalidate() {
  revalidatePath("/zajecia");
  revalidatePath("/admin/cms");
}

export async function createGroup(data: GroupFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = GroupSchema.parse(data);

  await prisma.group.create({
    data: {
      name: parsed.name,
      number: parsed.number,
      ageRange: parsed.ageRange,
      colorPreset: parsed.colorPreset,
      sortOrder: parsed.sortOrder,
      slots: { create: parsed.slots },
      prices: { create: parsed.prices },
    },
  });

  revalidate();
}

export async function updateGroup(id: string, data: GroupFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = GroupSchema.parse(data);

  await prisma.$transaction([
    prisma.trainingSlot.deleteMany({ where: { groupId: id } }),
    prisma.groupPrice.deleteMany({ where: { groupId: id } }),
    prisma.group.update({
      where: { id },
      data: {
        name: parsed.name,
        number: parsed.number,
        ageRange: parsed.ageRange,
        colorPreset: parsed.colorPreset,
        sortOrder: parsed.sortOrder,
        slots: { create: parsed.slots },
        prices: { create: parsed.prices },
      },
    }),
  ]);

  revalidate();
}

export async function deleteGroup(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.group.delete({ where: { id } });

  revalidate();
}
