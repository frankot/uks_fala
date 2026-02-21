# Design: /zajecia Schedule & Reservation Page

**Date:** 2026-02-21
**Status:** Approved

## Overview

Extend the UKS Fala website with a `/zajecia` page showing a weekly training schedule table, group highlighting controls, per-frequency pricing, and a reservation form that sends email via Resend API.

## Changes Required

### 1. TrainingGroups.tsx (modified)
- Change button text from "Zapytaj o miejsce" to "Zarezerwuj"
- Change button from `<a href="#kontakt">` to `<Link href={`/zajecia?group=${group.name}`}>`
- Add `import Link from "next/link"`

### 2. New: `src/app/zajecia/page.tsx`
Main page component. Imports Navigation, Footer, and the two new client components.

### 3. New: `src/app/zajecia/SchedulePage.tsx` (Client Component)
Full interactive schedule page. Uses `useSearchParams()` to read `?group=` param.

**Layout:** Two-column on desktop (`lg:grid-cols-[300px_1fr]`), stacked on mobile.

**Left sidebar:**
- Compact hero strip (page title)
- Group selector: 8 chips with group name + color accent, selected = filled deep-blue
- Training frequency: 1×, 2×, 3× toggle buttons (only valid options enabled per group)
- Monthly price display: updates reactively

**Right — schedule table:**
- Rows: time slots (15:30–19:30 in 30-min increments)
- Columns: Poniedziałek–Sobota (Mon–Sat, no Sunday)
- Cells with training: colored badge with group name
- Selected group cells: highlighted ring + full opacity
- Non-selected group cells: muted (40% opacity)
- Horizontally scrollable on mobile

### 4. New: `src/app/api/send/route.ts`
Next.js API Route (POST). Receives `{ name, email, phone, group, frequency, message }`. Sends HTML email to `biuro@uksfala.com.pl` via Resend SDK.

### 5. Reservation Form (inside SchedulePage.tsx)
Below the table. Fields:
- Name (text, required)
- Email (email, required)
- Phone (tel, optional)
- Group (read-only badge, pre-filled from state)
- Trainings/week (read-only, pre-filled from state)
- Message (textarea, optional)
- Submit → calls `/api/send`, shows success/error state

## Data Structures

### Schedule Data (placeholder)
```ts
type Slot = { group: string; day: number; hour: string };
// day: 0=Mon, 1=Tue, ..., 5=Sat
```

Sample schedule (all placeholder, edit freely):
- Krewetki: Mon 16:00, Wed 16:00
- Neonki: Tue 16:00, Thu 16:00
- Koniki Morskie: Mon 16:30, Wed 16:30, Sat 09:00
- Płotki: Tue 16:30, Thu 16:30, Sat 09:30
- Okonki: Mon 17:00, Wed 17:00, Fri 16:30
- Delfiny: Tue 17:00, Thu 17:00, Fri 17:00
- Barrakudy: Mon 17:30, Wed 17:30, Fri 17:30, Sat 10:00
- Rekiny: Mon–Fri 18:00, Sat 10:30

### Pricing Data (placeholder)
| Group | 1× | 2× | 3× |
|-------|----|----|-----|
| Krewetki | 173 zł | 290 zł | — |
| Neonki | 173 zł | 290 zł | — |
| Koniki Morskie | 220 zł | 310 zł | — |
| Płotki | 220 zł | 310 zł | — |
| Okonki | — | 310 zł | 360 zł |
| Delfiny | — | 310 zł | 360 zł |
| Barrakudy | — | 350 zł | 408 zł |
| Rekiny | — | — | 408 zł |

## Styling
- Same color tokens as main page (deep/pool/coral/sand)
- Same fonts (Outfit sans + Source Serif 4 editorial)
- Same `font-editorial` headings, `grain` overlay, wave dividers where appropriate
- Table cells: use group accent colors from existing `groups` array

## Environment
- `RESEND_API_KEY` in `.env.local`
- Install: `npm install resend`

## Files to Create/Modify
1. `src/components/TrainingGroups.tsx` — modify button
2. `src/app/zajecia/page.tsx` — new
3. `src/app/zajecia/SchedulePage.tsx` — new (client component)
4. `src/app/api/send/route.ts` — new
5. `.env.local` — add RESEND_API_KEY placeholder
