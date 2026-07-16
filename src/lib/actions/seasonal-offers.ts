"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { deleteImage } from "@/lib/upload";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SeasonalOfferType } from "@/lib/queries/seasonal-offers";

const SeasonalOfferSchema = z.object({
  type: z.enum(["OBOZ", "POLKOLONIA"]),
  title: z.string().min(1).max(200),
  summary: z.string().min(1).max(700),
  locationName: z.string().min(1).max(200),
  locationAddress: z.string().max(300).optional().nullable(),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
  ageRange: z.string().max(120).optional().nullable(),
  price: z.string().max(120).optional().nullable(),
  priceNote: z.string().max(300).optional().nullable(),
  accommodation: z.string().optional().nullable(),
  meals: z.string().optional().nullable(),
  transport: z.string().optional().nullable(),
  program: z.string().min(1),
  included: z.string().optional().nullable(),
  signupInfo: z.string().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type SeasonalOfferFormData = z.infer<typeof SeasonalOfferSchema>;

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function normalizeData(data: SeasonalOfferFormData) {
  return {
    ...data,
    title: data.title.trim(),
    summary: data.summary.trim(),
    locationName: data.locationName.trim(),
    locationAddress: normalizeOptionalText(data.locationAddress),
    ageRange: normalizeOptionalText(data.ageRange),
    price: normalizeOptionalText(data.price),
    priceNote: normalizeOptionalText(data.priceNote),
    accommodation: normalizeOptionalText(data.accommodation),
    meals: normalizeOptionalText(data.meals),
    transport: normalizeOptionalText(data.transport),
    program: data.program.trim(),
    included: normalizeOptionalText(data.included),
    signupInfo: normalizeOptionalText(data.signupInfo),
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
  };
}

function revalidate(type: SeasonalOfferType, slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin/cms");
  const basePath = type === "OBOZ" ? "/obozy" : "/polkolonie";
  revalidatePath(basePath);
  if (slug) revalidatePath(`${basePath}/${slug}`);
}

export async function createSeasonalOffer(data: SeasonalOfferFormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = normalizeData(SeasonalOfferSchema.parse(data));
  const created = await prisma.seasonalOffer.create({
    data: {
      ...parsed,
      slug: slugify(parsed.title),
    },
  });

  revalidate(parsed.type, created.slug);
}

export async function updateSeasonalOffer(
  id: string,
  data: SeasonalOfferFormData,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = normalizeData(SeasonalOfferSchema.parse(data));
  const existing = await prisma.seasonalOffer.findUnique({
    where: { id },
    select: { title: true, slug: true, images: true, type: true },
  });

  if (existing) {
    const removed = existing.images.filter((url) => !parsed.images.includes(url));
    await Promise.allSettled(removed.map(deleteImage));
  }

  const nextSlug = existing && existing.title !== parsed.title
    ? slugify(parsed.title)
    : existing?.slug;

  const updated = await prisma.seasonalOffer.update({
    where: { id },
    data: {
      ...parsed,
      ...(nextSlug ? { slug: nextSlug } : {}),
    },
  });

  if (existing) revalidate(existing.type, existing.slug);
  revalidate(updated.type, updated.slug);
}

export async function deleteSeasonalOffer(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const item = await prisma.seasonalOffer.findUnique({
    where: { id },
    select: { images: true, type: true, slug: true },
  });

  await prisma.seasonalOffer.delete({ where: { id } });

  if (item) {
    await Promise.allSettled(item.images.map(deleteImage));
    revalidate(item.type, item.slug);
  } else {
    revalidate("OBOZ");
    revalidate("POLKOLONIA");
  }
}
