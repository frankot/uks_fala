import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// day: 0=Pon, 1=Wt, 2=Śr, 3=Czw, 4=Pt, 5=Niedz  ·  track: 1 lub 2 (grupa może mieć inny tor w różne dni)
// prices: cena za jedne zajęcia zależnie od częstotliwości w tygodniu (1x / 2x / 3x)
type SeedGroup = {
  name: string;
  number: string;
  ageRange: string;
  colorPreset: string;
  sortOrder: number;
  lessonDuration: number;
  level: string;
  description: string;
  prices: Record<1 | 2 | 3, number>;
  slots: Array<{ day: number; hour: string; track: number }>;
};

const GROUPS: SeedGroup[] = [
  {
    name: "Krewetki",
    number: "01",
    ageRange: "3–5 lat",
    colorPreset: "pool",
    sortOrder: 1,
    lessonDuration: 30,
    level: "Oswajanie z wodą",
    description:
      "Najmłodsza grupa — pierwsze chwile w wodzie. Oswajanie z basenem, zabawy i nauka podstawowych ruchów pod okiem instruktora.",
    prices: { 1: 200, 2: 175, 3: 155 },
    slots: [
      { day: 2, hour: "17:15", track: 2 },
      { day: 3, hour: "17:15", track: 2 },
      { day: 5, hour: "15:30", track: 2 },
    ],
  },
  {
    name: "Neonki",
    number: "02",
    ageRange: "4–6 lat",
    colorPreset: "teal",
    sortOrder: 2,
    lessonDuration: 30,
    level: "Nauka podstaw",
    description:
      "Kontynuacja przygody z pływaniem. Samodzielne poruszanie się w wodzie, nurkowanie i pierwsze elementy kraula.",
    prices: { 1: 200, 2: 175, 3: 155 },
    slots: [
      { day: 0, hour: "16:00", track: 2 },
      { day: 1, hour: "16:15", track: 1 },
      { day: 2, hour: "16:45", track: 2 },
      { day: 4, hour: "16:30", track: 2 },
      { day: 5, hour: "16:00", track: 2 },
    ],
  },
  {
    name: "Koniki Morskie",
    number: "03",
    ageRange: "5–7 lat",
    colorPreset: "deep",
    sortOrder: 3,
    lessonDuration: 45,
    level: "Pierwsze style",
    description:
      "Pierwsza grupa z 45-minutowymi zajęciami. Nauka techniki kraula na piersiach i na grzbiecie, skoki do wody.",
    prices: { 1: 220, 2: 190, 3: 170 },
    slots: [
      { day: 0, hour: "16:00", track: 1 },
      { day: 1, hour: "16:15", track: 2 },
      { day: 2, hour: "16:00", track: 1 },
      { day: 3, hour: "17:45", track: 2 },
      { day: 4, hour: "16:30", track: 1 },
      { day: 5, hour: "15:30", track: 1 },
    ],
  },
  {
    name: "Płotki",
    number: "04",
    ageRange: "6–8 lat",
    colorPreset: "emerald",
    sortOrder: 4,
    lessonDuration: 45,
    level: "Technika pływania",
    description:
      "Rozwój techniki pływackiej i wytrzymałości. Doskonalenie stylu grzbietowego oraz nauka nawrotów.",
    prices: { 1: 220, 2: 190, 3: 170 },
    slots: [
      { day: 0, hour: "16:45", track: 1 },
      { day: 1, hour: "17:00", track: 2 },
      { day: 2, hour: "17:45", track: 2 },
      { day: 3, hour: "16:00", track: 1 },
      { day: 5, hour: "16:15", track: 1 },
    ],
  },
  {
    name: "Okonki",
    number: "05",
    ageRange: "7–9 lat",
    colorPreset: "amber",
    sortOrder: 5,
    lessonDuration: 45,
    level: "Doskonalenie stylów",
    description:
      "Kształtowanie prawidłowej techniki wszystkich stylów. Nauka stylu klasycznego i pierwsze elementy treningu sportowego.",
    prices: { 1: 230, 2: 200, 3: 180 },
    slots: [
      { day: 0, hour: "16:45", track: 2 },
      { day: 1, hour: "16:45", track: 1 },
      { day: 2, hour: "16:45", track: 1 },
      { day: 3, hour: "16:45", track: 1 },
      { day: 4, hour: "17:00", track: 2 },
      { day: 5, hour: "16:30", track: 2 },
    ],
  },
  {
    name: "Delfiny",
    number: "06",
    ageRange: "8–10 lat",
    colorPreset: "coral",
    sortOrder: 6,
    lessonDuration: 45,
    level: "Zaawansowana technika",
    description:
      "Zaawansowana technika czterech stylów, praca nad startami i nawrotami. Przygotowanie do pierwszych zawodów.",
    prices: { 1: 230, 2: 200, 3: 180 },
    slots: [
      { day: 0, hour: "17:30", track: 1 },
      { day: 1, hour: "17:45", track: 2 },
      { day: 2, hour: "17:30", track: 1 },
      { day: 3, hour: "18:30", track: 2 },
      { day: 4, hour: "17:15", track: 1 },
      { day: 5, hour: "17:00", track: 1 },
    ],
  },
  {
    name: "Barrakudy",
    number: "07",
    ageRange: "9–12 lat",
    colorPreset: "violet",
    sortOrder: 7,
    lessonDuration: 45,
    level: "Przygotowanie startowe",
    description:
      "Grupa dla ambitnych pływaków. Intensywny trening objętościowy, starty w zawodach i budowanie kondycji.",
    prices: { 1: 240, 2: 210, 3: 185 },
    slots: [
      { day: 0, hour: "17:30", track: 2 },
      { day: 1, hour: "17:30", track: 1 },
      { day: 2, hour: "18:30", track: 2 },
      { day: 3, hour: "17:30", track: 1 },
      { day: 4, hour: "17:45", track: 2 },
      { day: 5, hour: "17:15", track: 2 },
    ],
  },
  {
    name: "Rekiny",
    number: "08",
    ageRange: "11–15 lat",
    colorPreset: "deepDark",
    sortOrder: 8,
    lessonDuration: 45,
    level: "Grupa wyczynowa",
    description:
      "Sekcja sportowa — 45-minutowe treningi, praca nad formą startową i regularne starty w zawodach okręgowych.",
    prices: { 1: 260, 2: 225, 3: 200 },
    slots: [
      { day: 0, hour: "18:15", track: 1 },
      { day: 1, hour: "18:30", track: 2 },
      { day: 2, hour: "18:15", track: 1 },
      { day: 3, hour: "18:15", track: 1 },
      { day: 4, hour: "18:00", track: 1 },
      { day: 5, hour: "17:45", track: 1 },
    ],
  },
];

const DAY_NAMES = ["Pon", "Wt", "Śr", "Czw", "Pt", "Niedz"];
const GRID_START = "15:30";
const GRID_END = "19:30";

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Fails fast if the seed data would not render correctly in the grafik table. */
function validateSlots() {
  const blocks = GROUPS.flatMap((g) =>
    g.slots.map((s) => ({
      group: g.name,
      day: s.day,
      track: s.track,
      start: toMinutes(s.hour),
      end: toMinutes(s.hour) + g.lessonDuration,
      hour: s.hour,
    })),
  );

  for (const b of blocks) {
    if (b.start % 15 !== 0) {
      throw new Error(`${b.group} ${DAY_NAMES[b.day]} ${b.hour}: godzina musi być wielokrotnością 15 min`);
    }
    if (b.start < toMinutes(GRID_START) || b.end > toMinutes(GRID_END)) {
      throw new Error(`${b.group} ${DAY_NAMES[b.day]} ${b.hour}: blok wychodzi poza ${GRID_START}–${GRID_END}`);
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];
      if (a.day !== b.day || a.track !== b.track) continue;
      if (a.start < b.end && b.start < a.end) {
        throw new Error(
          `Kolizja na torze ${a.track} w ${DAY_NAMES[a.day]}: ${a.group} ${a.hour} × ${b.group} ${b.hour}`,
        );
      }
    }
  }

  const capacity = 6 * 2 * (toMinutes(GRID_END) - toMinutes(GRID_START));
  const used = blocks.reduce((sum, b) => sum + (b.end - b.start), 0);
  return { count: blocks.length, fill: Math.round((used / capacity) * 100) };
}

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

  // Reszta CMS-u (trenerzy) — tylko przykładowe dane na pustą bazę,
  // istniejące treści nie są nadpisywane ani kasowane.
  const coachCount = await prisma.coach.count();
  if (coachCount === 0) {
    for (const coach of coaches) {
      await prisma.coach.create({ data: coach });
    }
    console.log(`Seeded ${coaches.length} coaches`);
  } else {
    console.log(`Skipped coaches — ${coachCount} już w bazie`);
  }

  // ── Grafik: grupy, sloty, ceny, semestr ──
  // Jedyna niszcząca część seeda — cały grafik jest kasowany i budowany od zera.
  const stats = validateSlots();

  await prisma.trainingSlot.deleteMany();
  await prisma.groupPrice.deleteMany();
  await prisma.group.deleteMany();

  for (const g of GROUPS) {
    await prisma.group.create({
      data: {
        name: g.name,
        number: g.number,
        ageRange: g.ageRange,
        colorPreset: g.colorPreset,
        sortOrder: g.sortOrder,
        lessonDuration: g.lessonDuration,
        level: g.level,
        description: g.description,
        active: true,
        slots: {
          create: g.slots.map((s) => ({ day: s.day, hour: s.hour, track: s.track })),
        },
        prices: {
          create: (Object.entries(g.prices) as Array<[string, number]>).map(
            ([frequency, price]) => ({ frequency: Number(frequency), price }),
          ),
        },
      },
    });
  }

  // Liczba zajęć w semestrze dla każdego dnia tygodnia
  const semester = {
    label: "2026/2027",
    mon: 17,
    tue: 17,
    wed: 18,
    thu: 17,
    fri: 16,
    sun: 15,
  };

  await prisma.semesterDayCount.upsert({
    where: { id: "default" },
    update: semester,
    create: { id: "default", ...semester },
  });

  console.log(
    `Seeded ${GROUPS.length} groups with ${stats.count} slots (grafik wypełniony w ~${stats.fill}%)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
