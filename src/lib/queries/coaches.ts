import { prisma } from "@/lib/prisma";

const FALLBACK_COACHES = [
  {
    id: "fallback-coach-1",
    name: "Bartosz Krawczak",
    role: "Trener główny / Prezes klubu",
    bio: "Wieloletni trener pływania z uprawnieniami instruktorskimi. Założyciel UKS Fala, odpowiada za strategię szkoleniową i rozwój sekcji sportowej.",
    imageUrl: null,
    sortOrder: 0,
    published: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "fallback-coach-2",
    name: "Trener / Trenerka",
    role: "Instruktor — grupy początkujące",
    bio: "Certyfikowany instruktor z doświadczeniem w prowadzeniu grup dziecięcych. Specjalizacja: nauka podstaw i oswajanie z wodą.",
    imageUrl: null,
    sortOrder: 1,
    published: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "fallback-coach-3",
    name: "Trener / Trenerka",
    role: "Instruktor — grupy zaawansowane",
    bio: "Doświadczony szkoleniowiec pracujący z grupami zaawansowanymi. Przygotowuje młodych pływaków do startów w zawodach.",
    imageUrl: null,
    sortOrder: 2,
    published: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export async function getAllCoachesAdmin() {
  const items = await prisma.coach.findMany({
    orderBy: { sortOrder: "asc" },
  });
  return items.length > 0 ? items : FALLBACK_COACHES;
}

export async function getCoachesPublic(limit?: number) {
  const items = await prisma.coach.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return items.length > 0 ? items : FALLBACK_COACHES.slice(0, limit);
}
