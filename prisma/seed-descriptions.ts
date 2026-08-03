// Seed: adds placeholder descriptions to existing groups.
// Safe to run multiple times — only updates groups that lack a description.
// Run:  npx tsx prisma/seed-descriptions.ts

import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const descriptions: Record<string, string> = {
  Krewetki:
    "Najmłodsza grupa — pierwsze kroki w wodzie. Oswajanie z basenem, nauka podstawowych ruchów przez zabawę.",
  Neonki:
    "Kontynuacja przygody z pływaniem. Doskonalenie podstaw, nauka prostych stylów pływackich.",
  "Koniki Morskie":
    "Nauka techniki kraula, skoków i nurkowania. Pierwsza grupa z dłuższymi, 45-minutowymi zajęciami.",
  Płotki:
    "Rozwój techniki pływackiej. Wprowadzenie do stylu grzbietowego, ćwiczenia wytrzymałościowe.",
  Okonki:
    "Kształtowanie prawidłowej techniki. Nauka stylu klasycznego, pierwsze elementy pływania sportowego.",
  Delfiny:
    "Zaawansowana technika wszystkich stylów. Przygotowanie do pierwszych zawodów pływackich.",
  Barrakudy:
    "Grupa dla ambitnych pływaków. Intensywny trening, starty w zawodach, budowanie kondycji.",
  Rekiny:
    "Najstarsza grupa — profesjonalny trening pływacki. Rozwój sportowy na wysokim poziomie.",
};

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const [name, description] of Object.entries(descriptions)) {
    const group = await prisma.group.findUnique({ where: { name } });
    if (!group) {
      console.log(`⚠ Skipped "${name}" — not found in DB`);
      skipped++;
      continue;
    }
    if (group.description) {
      console.log(`⏭ Skipped "${name}" — already has description`);
      skipped++;
      continue;
    }
    await prisma.group.update({
      where: { name },
      data: { description },
    });
    console.log(`✓ Updated "${name}"`);
    updated++;
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
