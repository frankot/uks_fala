import "dotenv/config";
import { defineConfig } from "prisma/config";

// Load .env.local if it exists (Next.js convention)
import { config } from "dotenv";
config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations must NOT go through Neon's PgBouncer pooler: `prisma migrate`
    // takes a session-level advisory lock, and transaction-mode pooling routes
    // the follow-up statements to a different backend, so the lock is never seen
    // and the command dies with P1002. DIRECT_URL is the same database on the
    // unpooled endpoint (hostname without `-pooler`). The app itself keeps using
    // the pooled DATABASE_URL — see src/lib/prisma.ts.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
