import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD env vars must be set");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { hashedPassword },
    create: {
      email,
      hashedPassword,
      name: "Administrator",
      role: "ADMIN",
    },
  });

  console.log(`Admin user seeded: ${email}`);

  const coaches = [
    {
      name: "Bartosz Krawczak",
      role: "Trener główny / Prezes klubu",
      bio: "Wieloletni trener pływania z uprawnieniami instruktorskimi. Założyciel UKS Fala, odpowiada za strategię szkoleniową i rozwój sekcji sportowej.",
      sortOrder: 0,
      published: true,
    },
    {
      name: "Anna Kowalska",
      role: "Instruktor — grupy początkujące",
      bio: "Certyfikowany instruktor z doświadczeniem w prowadzeniu grup dziecięcych. Specjalizacja: nauka podstaw i oswajanie z wodą.",
      sortOrder: 1,
      published: true,
    },
    {
      name: "Piotr Nowak",
      role: "Instruktor — grupy zaawansowane",
      bio: "Doświadczony szkoleniowiec pracujący z grupami zaawansowanymi. Przygotowuje młodych pływaków do startów w zawodach.",
      sortOrder: 2,
      published: true,
    },
    {
      name: "Marta Wiśniewska",
      role: "Instruktor — zajęcia korekcyjne",
      bio: "Specjalista od pływania korekcyjnego i terapii w wodzie. Prowadzi indywidualne zajęcia doskonalące technikę i pomagające w rehabilitacji.",
      sortOrder: 3,
      published: true,
    },
  ];

  // Clear existing coaches and re-seed
  await prisma.coach.deleteMany();
  for (const coach of coaches) {
    await prisma.coach.create({ data: coach });
  }

  console.log(`Seeded ${coaches.length} coaches`);

  // ── Groups, slots, prices, semester ──
  // Clear existing
  await prisma.trainingSlot.deleteMany();
  await prisma.groupPrice.deleteMany();
  await prisma.group.deleteMany();

  const groups = [
    { name: "Krewetki",       number: "01", ageRange: "3–5 lat",   colorPreset: "pool",     sortOrder: 0, lessonDuration: 30 },
    { name: "Neonki",         number: "02", ageRange: "4–6 lat",   colorPreset: "pool",     sortOrder: 1, lessonDuration: 30 },
    { name: "Koniki Morskie", number: "03", ageRange: "5–7 lat",   colorPreset: "deep",     sortOrder: 2, lessonDuration: 45 },
    { name: "Płotki",         number: "04", ageRange: "6–8 lat",   colorPreset: "deep",     sortOrder: 3, lessonDuration: 45 },
    { name: "Okonki",         number: "05", ageRange: "7–9 lat",   colorPreset: "coral",    sortOrder: 4, lessonDuration: 45 },
    { name: "Delfiny",        number: "06", ageRange: "8–10 lat",  colorPreset: "coral",    sortOrder: 5, lessonDuration: 45 },
    { name: "Barrakudy",      number: "07", ageRange: "9–12 lat",  colorPreset: "coral",    sortOrder: 6, lessonDuration: 45 },
    { name: "Rekiny",         number: "08", ageRange: "11–15 lat", colorPreset: "deepDark", sortOrder: 7, lessonDuration: 60 },
  ];

  const createdGroups: Record<string, string> = {};
  for (const g of groups) {
    const created = await prisma.group.create({ data: g });
    createdGroups[g.name] = created.id;
  }

  // Slots — two tracks, with careful non‑overlapping timing
  const slots: Array<{ group: string; day: number; hour: string; track: number }> = [
    // Krewetki (30 min) — Tor 1, Mon+Wed 16:00
    { group: "Krewetki", day: 0, hour: "16:00", track: 1 },
    { group: "Krewetki", day: 2, hour: "16:00", track: 1 },

    // Neonki (30 min) — Tor 2, Mon+Wed 16:00 (same time, different track → OK)
    { group: "Neonki", day: 0, hour: "16:00", track: 2 },
    { group: "Neonki", day: 2, hour: "16:00", track: 2 },

    // Koniki Morskie (45 min) — Tor 1, Mon+Wed 16:30, Sun 15:30
    { group: "Koniki Morskie", day: 0, hour: "16:30", track: 1 },
    { group: "Koniki Morskie", day: 2, hour: "16:30", track: 1 },
    { group: "Koniki Morskie", day: 5, hour: "15:30", track: 1 },

    // Płotki (45 min) — Tor 2, Mon+Wed 16:30, Sun 16:00
    { group: "Płotki", day: 0, hour: "16:30", track: 2 },
    { group: "Płotki", day: 2, hour: "16:30", track: 2 },
    { group: "Płotki", day: 5, hour: "16:00", track: 2 },

    // Okonki (45 min) — Tor 1, Mon+Wed 17:15, Fri 16:30
    { group: "Okonki", day: 0, hour: "17:15", track: 1 },
    { group: "Okonki", day: 2, hour: "17:15", track: 1 },
    { group: "Okonki", day: 4, hour: "16:30", track: 1 },

    // Delfiny (45 min) — Tor 1, Mon+Wed 18:00, Fri 17:15, Tor 2 Tue+Thu 18:00
    { group: "Delfiny", day: 0, hour: "18:00", track: 1 },
    { group: "Delfiny", day: 2, hour: "18:00", track: 1 },
    { group: "Delfiny", day: 4, hour: "17:15", track: 1 },
    { group: "Delfiny", day: 1, hour: "18:00", track: 2 },
    { group: "Delfiny", day: 3, hour: "18:00", track: 2 },

    // Barrakudy (45 min) — Tor 2, Tue+Thu 16:30, Fri 17:15, Sun 16:45
    { group: "Barrakudy", day: 1, hour: "16:30", track: 2 },
    { group: "Barrakudy", day: 3, hour: "16:30", track: 2 },
    { group: "Barrakudy", day: 4, hour: "17:15", track: 2 },
    { group: "Barrakudy", day: 5, hour: "16:45", track: 2 },

    // Rekiny (60 min) — Tor 1, Tue+Thu 17:15, Fri 18:00, Sun 17:30
    { group: "Rekiny", day: 1, hour: "17:15", track: 1 },
    { group: "Rekiny", day: 3, hour: "17:15", track: 1 },
    { group: "Rekiny", day: 4, hour: "18:00", track: 1 },
    { group: "Rekiny", day: 5, hour: "17:30", track: 1 },
  ];

  for (const s of slots) {
    await prisma.trainingSlot.create({
      data: { groupId: createdGroups[s.group], day: s.day, hour: s.hour, track: s.track },
    });
  }

  // Prices
  const prices: Array<{ group: string; frequency: number; price: number }> = [
    { group: "Krewetki", frequency: 1, price: 173 },
    { group: "Krewetki", frequency: 2, price: 290 },
    { group: "Neonki", frequency: 1, price: 173 },
    { group: "Neonki", frequency: 2, price: 290 },
    { group: "Koniki Morskie", frequency: 1, price: 220 },
    { group: "Koniki Morskie", frequency: 2, price: 310 },
    { group: "Płotki", frequency: 1, price: 220 },
    { group: "Płotki", frequency: 2, price: 310 },
    { group: "Okonki", frequency: 2, price: 310 },
    { group: "Okonki", frequency: 3, price: 360 },
    { group: "Delfiny", frequency: 2, price: 310 },
    { group: "Delfiny", frequency: 3, price: 360 },
    { group: "Barrakudy", frequency: 2, price: 350 },
    { group: "Barrakudy", frequency: 3, price: 408 },
    { group: "Rekiny", frequency: 3, price: 408 },
  ];

  for (const p of prices) {
    await prisma.groupPrice.create({
      data: { groupId: createdGroups[p.group], frequency: p.frequency, price: p.price },
    });
  }

  // Semester day count
  await prisma.semesterDayCount.upsert({
    where: { id: "default" },
    update: {
      label: "2026/2027",
      mon: 17, tue: 17, wed: 18, thu: 17, fri: 17, sun: 16,
    },
    create: {
      id: "default",
      label: "2026/2027",
      mon: 17, tue: 17, wed: 18, thu: 17, fri: 17, sun: 16,
    },
  });

  console.log(`Seeded ${groups.length} groups with ${slots.length} slots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
