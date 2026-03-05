# Admin Panel + CMS Implementation Plan — UKS Fala

## Context

The UKS Fala swimming school site currently has a hardcoded schedule (`src/lib/schedule.ts`) rendered by `SchedulePage.tsx`. There is no database, no auth, and no admin panel. The goal is to add a `/admin` panel with authentication and a CMS where an admin can manage the schedule (groups, days/hours, prices, colors). The architecture must support future expansion into e-commerce (orders, products, more CMS sections).

If the CMS database is empty, the public schedule page falls back to the current hardcoded data.

---

## Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `prisma` + `@prisma/client` | ORM + DB client |
| `next-auth@beta` | Auth.js v5 (App Router compatible) |
| `bcryptjs` + `@types/bcryptjs` | Password hashing |
| `zod` | Server action input validation |
| `tsx` | Running seed script in TS |

Database: **Neon PostgreSQL** (connection string in `DATABASE_URL`)

---

## Prisma Schema

`prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  name           String?
  role           Role     @default(ADMIN)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

enum Role {
  ADMIN
  SUPERADMIN
}

model Group {
  id          String          @id @default(cuid())
  name        String          @unique
  number      String          // "01", "02", etc.
  ageRange    String          // "3–5 lat"
  colorPreset String          // key: "pool" | "deep" | "coral" | "deepDark"
  sortOrder   Int             @default(0)
  active      Boolean         @default(true)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  slots       TrainingSlot[]
  prices      GroupPrice[]
}

model TrainingSlot {
  id      String @id @default(cuid())
  groupId String
  day     Int    // 0=Mon ... 5=Sat
  hour    String // "HH:MM"
  group   Group  @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([groupId, day, hour])
}

model GroupPrice {
  id        String @id @default(cuid())
  groupId   String
  frequency Int    // 1, 2, or 3
  price     Int    // PLN per month
  group     Group  @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([groupId, frequency])
}
```

**Price logic**: Admin enters price for max available frequency. For fewer trainings, price is proportional (handled by frontend calculation, same as current behavior).

---

## File Structure

```
src/
  app/
    layout.tsx                      # Root layout (fonts, metadata) — stays
    (public)/
      layout.tsx                    # NEW — wraps with Navigation + Footer
      page.tsx                      # MOVED from src/app/page.tsx
      zajecia/
        page.tsx                    # MOVED — now calls getScheduleData(), passes props
        SchedulePage.tsx            # MODIFIED — accepts data via props
    admin/
      layout.tsx                    # Admin shell (sidebar, header, no public nav)
      page.tsx                      # Redirects to /admin/cms
      login/
        page.tsx                    # Login form (unprotected)
      cms/
        page.tsx                    # CMS with tab bar, starts with "Grafik"
        _components/
          GrafikTab.tsx             # Group list + add button
          GroupForm.tsx             # Create/edit form (modal or full-page)
          ColorPicker.tsx           # 4-swatch preset picker
          SlotEditor.tsx            # Day×Hour checkbox grid
          PriceEditor.tsx           # Frequency+price rows
          DeleteGroupDialog.tsx     # Confirmation dialog
    api/
      auth/[...nextauth]/route.ts   # Auth.js handler
      send/route.ts                 # Existing (minor update for group validation)
  lib/
    prisma.ts                       # Prisma singleton
    auth.ts                         # NextAuth config (credentials, JWT)
    color-presets.ts                # Preset key → { bg, text, ring } mapping
    schedule.ts                     # KEEP — hardcoded fallback data
    actions/
      groups.ts                     # Server actions: createGroup, updateGroup, deleteGroup
    queries/
      schedule.ts                   # getScheduleData() — DB with fallback to hardcoded
  components/
    admin/
      AdminSidebar.tsx
      AdminHeader.tsx
middleware.ts                       # Auth middleware — protects /admin/* except /admin/login
prisma/
  schema.prisma
  seed.ts                           # Seeds admin user from ADMIN_EMAIL + ADMIN_PASSWORD env vars
```

---

## Auth Flow

1. **NextAuth v5** with Credentials provider + JWT session strategy
2. **Middleware** at project root protects `/admin/((?!login).*)` — redirects unauthenticated to `/admin/login`
3. **Seed script** creates admin user from env vars (`npx prisma db seed`) — no registration page
4. **Login page** at `/admin/login` — email + password form calling `signIn("credentials")`

---

## Data Flow: Public Schedule Page

```
zajecia/page.tsx (server component)
  → calls getScheduleData()
    → queries DB (groups + slots + prices)
    → if DB empty or error → returns hardcoded data from lib/schedule.ts
  → passes data as props to SchedulePage (client component)
```

**SchedulePage.tsx changes** (minimal):
- Remove direct imports of `SCHEDULE`, `PRICES`, `GROUP_COLORS` from `@/lib/schedule`
- Accept `data` prop with `{ groups, schedule, prices, groupColors }`
- Destructure into local constants — rest of component unchanged
- `DAYS` and `TIME_SLOTS` remain as local constants (display only)

---

## Color Presets

`src/lib/color-presets.ts` — maps preset keys to existing Tailwind theme classes:

| Key | bg | text | ring | Label |
|-----|-----|------|------|-------|
| `pool` | `bg-pool-100` | `text-deep-600` | `ring-pool-300` | Blekitny |
| `deep` | `bg-deep-100` | `text-deep-700` | `ring-deep-300` | Granatowy |
| `coral` | `bg-coral-100` | `text-coral-600` | `ring-coral-300` | Koralowy |
| `deepDark` | `bg-deep-800` | `text-white` | `ring-deep-500` | Ciemny |

Admin picks from visual swatches. Classes are in source code so Tailwind includes them.

---

## Admin CMS: Grafik Tab

The Grafik tab shows a list/table of groups with:
- Color badge, name, age range, slot count, price summary
- Edit / Delete actions per group

**GroupForm** (create/edit) contains:
- Name, number, age range inputs
- ColorPicker — 4 swatches
- SlotEditor — 6×9 grid (days × time slots), click to toggle
- PriceEditor — rows for frequencies 1/2/3, enter price per frequency (leave blank if N/A)

Server actions validate with Zod, run inside auth check, `revalidatePath` on `/zajecia` and `/admin/cms`.

---

## Env Variables

```
DATABASE_URL=postgresql://...         # Neon connection string
AUTH_SECRET=...                        # npx auth secret
ADMIN_EMAIL=admin@uksfala.com.pl      # Seed script
ADMIN_PASSWORD=...                    # Seed script
RESEND_API_KEY=...                    # Existing
```

---

## Implementation Order

### Phase 1: Foundation
1. Install dependencies
2. Create Prisma schema + `src/lib/prisma.ts`
3. Set up Neon DB, add env vars
4. Run `npx prisma migrate dev --name init`
5. Create `prisma/seed.ts`, add seed config to `package.json`, run seed

### Phase 2: Auth
6. Create `src/lib/auth.ts` (NextAuth config)
7. Create `src/app/api/auth/[...nextauth]/route.ts`
8. Create `middleware.ts`
9. Create `src/app/admin/login/page.tsx`

### Phase 3: Admin Layout
10. Move existing pages into `(public)` route group with its own layout
11. Create admin layout + sidebar + header
12. Create `src/app/admin/page.tsx` (redirect to CMS)

### Phase 4: Data Layer
13. Create `src/lib/color-presets.ts`
14. Create `src/lib/queries/schedule.ts` (DB + fallback)
15. Create `src/lib/actions/groups.ts` (CRUD)
16. Refactor `SchedulePage.tsx` to accept props
17. Update `zajecia/page.tsx` to fetch and pass data

### Phase 5: CMS UI
18. Create CMS page with tab bar
19. Build GrafikTab, GroupForm, ColorPicker, SlotEditor, PriceEditor, DeleteGroupDialog
20. Wire up server actions

### Phase 6: Polish
21. Update `/api/send/route.ts` to validate groups from DB (with fallback)
22. Test: login → create group → verify on public page
23. Test: empty DB → fallback to hardcoded data
24. Test: delete all groups → fallback activates

---

## Verification

1. `npx prisma migrate dev` succeeds
2. `npx prisma db seed` creates admin user
3. Navigate to `/admin` → redirected to `/admin/login`
4. Login with seeded credentials → see admin dashboard
5. Navigate to `/admin/cms` → Grafik tab visible
6. Create a group with name, age, color, slots, price → appears in group list
7. Navigate to `/zajecia` → new group visible in schedule table
8. Delete all groups → schedule falls back to hardcoded data
9. Edit a group → changes reflected on public page
10. Contact form still works (`/api/send`)
