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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
