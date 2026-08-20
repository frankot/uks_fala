"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { TRAINING_GROUPS_TAG } from "@/lib/queries/training-groups";
import {
  DAYS_SHORT,
  GRID_END,
  GRID_START,
  LESSON_DURATIONS,
  fitsInGrid,
  rangesOverlap,
  timeToMinutes,
} from "@/lib/schedule-grid";

const SlotSchema = z.object({
  day: z.number().int().min(0).max(5),
  hour: z.string().regex(/^\d{2}:\d{2}$/),
  track: z.number().int().min(1).max(2).default(1),
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
  level: z.string().max(40).optional().default(""),
  lessonDuration: z
    .union([z.literal(LESSON_DURATIONS[0]), z.literal(LESSON_DURATIONS[1])])
    .default(45),
  description: z.string().max(300).optional().default(""),
  slots: z.array(SlotSchema).min(1, "Dodaj przynajmniej jeden termin"),
  prices: z.array(PriceSchema).min(1, "Dodaj przynajmniej jedną cenę"),
});

export type GroupFormData = z.infer<typeof GroupSchema>;

/**
 * Rejects anything the grafik grid cannot render: slots outside the pool window,
 * two of this group's own slots on one track, or a clash with another active group.
 */
async function assertScheduleIsValid(
  parsed: GroupFormData,
  excludeGroupId?: string,
) {
  for (const s of parsed.slots) {
    if (!fitsInGrid(s.hour, parsed.lessonDuration)) {
      throw new Error(
        `Termin ${DAYS_SHORT[s.day]} ${s.hour} (${parsed.lessonDuration} min) nie mieści się w oknie ${GRID_START}–${GRID_END}.`,
      );
    }
  }

  for (let i = 0; i < parsed.slots.length; i++) {
    for (let j = i + 1; j < parsed.slots.length; j++) {
      const a = parsed.slots[i];
      const b = parsed.slots[j];
      if (a.day !== b.day || a.track !== b.track) continue;
      const aStart = timeToMinutes(a.hour);
      const bStart = timeToMinutes(b.hour);
      if (
        rangesOverlap(
          aStart,
          aStart + parsed.lessonDuration,
          bStart,
          bStart + parsed.lessonDuration,
        )
      ) {
        throw new Error(
          `Konflikt: dwa terminy tej grupy na torze ${a.track} w ${DAYS_SHORT[a.day]} nakładają się (${a.hour} i ${b.hour}).`,
        );
      }
    }
  }

  const others = await prisma.group.findMany({
    where: {
      active: true,
      ...(excludeGroupId ? { id: { not: excludeGroupId } } : {}),
    },
    select: { name: true, lessonDuration: true, slots: true },
  });

  for (const slot of parsed.slots) {
    const start = timeToMinutes(slot.hour);
    const end = start + parsed.lessonDuration;
    for (const other of others) {
      for (const o of other.slots) {
        if (o.day !== slot.day || o.track !== slot.track) continue;
        const oStart = timeToMinutes(o.hour);
        if (!rangesOverlap(start, end, oStart, oStart + other.lessonDuration)) {
          continue;
        }
        throw new Error(
          `Konflikt: ${DAYS_SHORT[slot.day]} ${slot.hour} na torze ${slot.track} koliduje z grupą ${other.name} (${o.hour}, ${other.lessonDuration} min).`,
        );
      }
    }
  }
}

function revalidate() {
  revalidatePath("/grafik");
  revalidatePath("/admin/cms");
  // The home-page group cards are cached for an hour — publish edits right away.
  updateTag(TRAINING_GROUPS_TAG);
}

export async function createGroup(data: GroupFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = GroupSchema.parse(data);

  await assertScheduleIsValid(parsed);

  await prisma.group.create({
    data: {
      name: parsed.name,
      number: parsed.number,
      ageRange: parsed.ageRange,
      colorPreset: parsed.colorPreset,
      sortOrder: parsed.sortOrder,
      lessonDuration: parsed.lessonDuration,
      level: parsed.level || null,
      description: parsed.description || null,
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

  await assertScheduleIsValid(parsed, id);

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
        lessonDuration: parsed.lessonDuration,
        level: parsed.level || null,
        description: parsed.description || null,
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
