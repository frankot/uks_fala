# Code review — UKS Fala (pre-launch)

**Date:** 2026-08-20 · **Commit:** `7e9192b` · **Branch:** `main`
**Scope:** full application — public site, admin panel + CMS, schedule/reservation component, data layer, auth, infra config.

**Verification performed:** `npx tsc --noEmit` (clean), `npx eslint .` (0 errors, 18 warnings), `npm run build` (succeeds). All findings below were traced in source; none rely on the build output alone.

---

## Verdict

**Do not launch as-is.** The build is green and the architecture is sound, but **both lead-capture paths on the site are non-functional** — the reservation form on `/zajecia` sends a payload the API rejects, and the contact form on the homepage discards submissions entirely. For a site whose entire commercial purpose is collecting enrolment enquiries, that is a total failure of the primary conversion path.

There is also one genuine security hole (unauthenticated Cloudinary upload/delete), a visibly broken footer logo on every page, and a data-integrity risk where fabricated demo content is published to real visitors when the database is empty.

Estimated work to launch-ready: **P0 items are roughly half a day.** P1 items are a further day or two and several are legal (RODO) rather than technical.

| Severity | Count | Meaning |
|---|---|---|
| P0 — blocker | 5 | Must fix before DNS is pointed at this |
| P1 — high | 7 | Fix within the first week, several before launch |
| P2 — medium | 12 | Schedule into the next iteration |
| P3 — polish | 10 | Backlog |

---

## P0 — Launch blockers

### 1. The reservation form never sends. Every submission fails.

`src/app/(public)/zajecia/SchedulePage.tsx:110-118` builds the payload as:

```ts
const days = [...selectedDays].sort(...).map((d) => DAYS[d]).join(", ");
body: JSON.stringify({ ...form, group: selectedGroup, days }),
```

`src/app/api/send/route.ts:41` requires:

```ts
if (!name || !email || !group || !frequency) {
  return NextResponse.json({ error: "Brakujące pola" }, { status: 400 });
}
```

The client sends `days` (a Polish day-name string). The server reads `frequency`. It is always `undefined`, so **every reservation returns 400** and the user sees "Coś poszło nie tak." There is no code path in which this form succeeds.

The client and the route were clearly written against different contracts and never tested end-to-end together.

**Fix:** send `frequency: selectedDays.size` alongside `days`, accept both server-side, and add `days` to the email body — the club needs to know *which* days were picked, not just how many. Suggested payload:

```ts
body: JSON.stringify({
  ...form,
  group: selectedGroup,
  frequency: selectedDays.size,
  days,
})
```

…and a corresponding `days` row in the email table in `route.ts`, with a `days.length > 200` guard alongside the existing length checks.

**Then verify by actually submitting the form**, not by reading the diff.

---

### 2. The homepage contact form is a no-op

`src/components/CallToAction.tsx:99`:

```tsx
<form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
```

No handler, no fetch, no state. The user fills in name, e-mail, child's age and a message, clicks "Wyślij wiadomość", and **nothing happens at all** — no request, no error, no confirmation. The form simply sits there.

This is the `#kontakt` section that every "Kontakt" link in the header, the mobile menu and the footer scrolls to (`ContactLink.tsx`). It is the most prominent form on the site.

Worse than a visible failure: the visitor has no way to tell it did not work, so the enquiry is lost silently and neither side ever follows up.

**Fix:** wire it to `/api/send` with the same submit/status pattern already written in `SchedulePage.tsx` (`status: "idle" | "sending" | "ok" | "error"`, `aria-live` region, success panel). That component is a good reference — this form should reuse the shape. The route will need a variant that accepts a general enquiry without `group`/`frequency`, or a `type: "kontakt"` discriminator.

---

### 3. Footer logo 404s on every page

`src/components/Footer.tsx:21` and `:28` reference:

- `/fala-logo-only-transparent.png`
- `/fala-company-name-transparent.png`

Neither file exists. `public/` contains only:

```
public/logo-blue/fala-logo-only-transparent.png
public/logo-blue/fala-company-name-transparent.png
public/logo-black/fala-symbol-transparent.png
public/logo-black/fala-wordmark-transparent.png
```

`Navigation.tsx:58,66` uses the correct `/logo-blue/...` paths — the footer was not updated when the logos were moved into subfolders. Since these go through `next/image`, the optimizer request fails and the footer renders broken image slots on **every page of the site**.

**Fix:** prefix both with `/logo-blue/`. Consider a `LOGO_SRC` constant in one place so nav and footer cannot drift again.

---

### 4. Unauthenticated Cloudinary upload and delete (security)

`src/lib/upload.ts:1` is a `"use server"` module, and both of its exports are imported into a **client** component (`ImageUploader.tsx:4`). That makes `uploadImage` and `deleteImage` **public HTTP endpoints with no authentication check whatsoever**. Every other mutating action in the codebase guards correctly:

```ts
const session = await auth();
if (!session) throw new Error("Unauthorized");
```

`upload.ts` has no such guard. Anyone who reads the client bundle can extract the action IDs and:

- **`uploadImage`** — upload arbitrary images (5 MB each, unlimited count) into your Cloudinary account. Storage/bandwidth cost, and a plausible route for hosting illegal content on a domain associated with a children's swimming club.
- **`deleteImage`** — pass any Cloudinary URL and **permanently destroy that asset**. `cloudinary.uploader.destroy()` is not reversible. An attacker who can enumerate or guess your public IDs can wipe the club's media library.

The 5 MB cap in `uploadImage` is a size limit, not an authorization control. The duplicate check in `ImageUploader.tsx:29` is client-side only.

**Fix:** add the session guard to both functions in `src/lib/upload.ts`:

```ts
export async function uploadImage(file: File, folder?: string): Promise<string> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  ...
}
```

Also validate the MIME type server-side (`file.type.startsWith("image/")` — `accept="image/*"` on the input is a hint, not enforcement), and constrain `folder` to a known allow-list rather than passing the client string straight to Cloudinary.

---

### 5. `/api/send` rejects every group the CMS creates

`src/app/api/send/route.ts:65`:

```ts
const VALID_GROUPS = Object.keys(PRICES);   // from "@/lib/schedule"
if (!VALID_GROUPS.includes(group)) {
  return NextResponse.json({ error: "Nieznana grupa" }, { status: 400 });
}
```

`PRICES` is the **hardcoded fallback constant** — the eight seed group names (Krewetki, Neonki, Koniki Morskie, Płotki, Okonki, Delfiny, Barrakudy, Rekiny). The whole point of the Grafik tab is that the club can add, rename and remove groups. The moment they do, reservations for that group are rejected with "Nieznana grupa" — and the group is selectable in the UI, so the user has no way to know which groups are "real".

This is latent until the first CMS edit, which makes it worse: it will break *after* launch, in the client's hands, with no obvious cause.

**Fix:** validate against the database. `getScheduleData()` already returns `prices` keyed by live group name; use `Object.keys((await getScheduleData()).prices)` — or query `prisma.group.findMany({ where: { active: true }, select: { name: true } })` directly. Keep the fallback list only as the empty-DB case, matching the behaviour of the rest of the query layer.

---

## P1 — High

### 6. Fabricated demo content is published to real visitors

`src/lib/queries/news.ts` and `queries/achievements.ts` each carry ~10 fully-written fake articles (`FALLBACK_NEWS`, `FALLBACK_ACHIEVEMENTS`) that render **whenever the published-rows count is zero**:

```ts
return items.length > 0 ? items : FALLBACK_NEWS.slice(0, limit);
```

These are not lorem ipsum. They are plausible Polish sentences making specific factual claims — *"5 medali UKS Fala na Mistrzostwach Mazowsza"*, *"Zloto na 100 m stylem dowolnym"*, *"Wynik 31.22 na 50 m motylkiem to obecnie najlepszy czas sezonu w klubie"*, with dates and times. If the production database is empty on launch day, or the club unpublishes everything, the site publishes **invented sporting results as club news**, indistinguishable from real content, on a real domain.

The same pattern applies to `FALLBACK_COACHES` (a named person, "Bartosz Krawczak", plus two "Trener / Trenerka" placeholders) and `getScheduleData`'s fallback, which is genuinely useful — a schedule fallback prevents a blank page; fabricated medal results do not.

Note also the fallbacks are diacritic-free ("Zloto", "plywackiego") while the real site copy is properly accented — they will look visibly wrong even to a casual reader.

**Fix:** delete `FALLBACK_NEWS` and `FALLBACK_ACHIEVEMENTS` and render the empty state instead (`/aktualnosci` already has one at `page.tsx:31`). Keep the schedule fallback. Replace the coach fallback with an empty state or genuinely neutral placeholders. Whatever is kept, seed the production database before launch so no fallback ever fires.

---

### 7. No rate limiting on either public endpoint

- **`POST /api/send`** is an unauthenticated relay into `biuro@uksfala.com.pl` with no captcha, no honeypot, no per-IP throttle. A trivial loop fills the club's inbox, burns the Resend quota, and risks the sending domain's reputation.
- **`POST /api/auth/callback/credentials`** has no throttle or lockout, so admin passwords can be brute-forced at network speed. There is a single admin account seeded from `ADMIN_PASSWORD` in `.env`; if that is a human-chosen password, this is the weakest link in the whole system.

**Fix:** the cheapest effective step for a site this size is a hidden honeypot field plus a per-IP token bucket (Upstash Redis if on Vercel, or an in-memory `Map` keyed by IP if single-instance — imperfect but far better than nothing). Add a short lockout after ~5 failed logins. Confirm `ADMIN_PASSWORD` in production is long and randomly generated, not a memorable one reused from elsewhere.

---

### 8. No privacy policy, no RODO consent — on forms collecting children's data

The reservation form collects a parent's name, e-mail and phone, plus free-text explicitly prompted for the child's age (`placeholder="Wiek dziecka, pytania, preferowane dni..."`). The homepage form has a dedicated "Wiek dziecka" field.

There is:
- no privacy policy page anywhere in the app (`find` over `src/app` confirms no such route),
- no consent checkbox on either form,
- no information about the data controller, retention or the right to erasure.

`src/components/Footer.tsx:190` renders "Polityka prywatności" as a **plain `<p>`, not a link** — it looks like a policy exists and points nowhere.

For a Polish organisation processing minors' personal data this is a GDPR/RODO compliance gap, not a nice-to-have. It is also the kind of thing a parent notices.

**Fix (needs the club's input, not just code):** add a `/polityka-prywatnosci` page with the controller's details, purpose, legal basis, retention period and data-subject rights; link it from the footer; add a required consent checkbox to both forms with a link to that page. Get the wording reviewed by whoever handles the club's legal paperwork.

---

### 9. Every page is `force-dynamic` — nothing is cached

Every public route declares `export const dynamic = "force-dynamic"`, confirmed by the build output (`ƒ` on all of `/`, `/zajecia`, `/aktualnosci`, `/obozy`, `/osiagniecia`, `/trenerzy`, `/polkolonie` and all `[slug]` routes). Only `/o-nas`, `/admin`, `/admin/login` and `/_not-found` are static.

So every single visitor hit — including bots and repeat views of a news article that changes once a month — runs a fresh Postgres round-trip. On serverless this also means a cold connection per instance. The `unstable_cache` wrapper in `queries/training-groups.ts` is the right pattern and is well-commented, but it is the only place it is used, and the homepage's `force-dynamic` defeats it anyway.

The mutation actions already call `revalidatePath` for every affected route, so **the invalidation plumbing for ISR is already written** — the `force-dynamic` declarations are the only thing stopping it from working.

**Fix:** drop `force-dynamic` from the content routes and let the existing `revalidatePath` calls drive revalidation. `/zajecia` and the `[slug]` pages are the best candidates; add `generateStaticParams` for the slug routes. Keep `force-dynamic` only where a request genuinely must not be cached.

---

### 10. CMS images bypass `next/image` entirely

`next.config.ts` configures `res.cloudinary.com` in `remotePatterns` — and then nothing uses it. Every Cloudinary-hosted image on the public site is a raw `<img>`:

- `aktualnosci/page.tsx:46`, `aktualnosci/[slug]/page.tsx:50`
- `osiagniecia/[slug]/page.tsx:51`
- `components/AktualnosciSection.tsx:92`, `SeasonalOfferCard.tsx:56`
- `components/SeasonalOfferDetail.tsx:189,197` — including a hero at `min-h-[560px]`

No `srcset`, no responsive sizing, no lazy-loading below the fold, no format negotiation, no width/height so **every one of these causes layout shift**. ESLint flags all 12 (`@next/next/no-img-element`) and the warnings have been ignored.

The offer detail hero is the worst case: a full-width unoptimised original, likely a multi-megabyte phone photo straight from the admin's upload, as the LCP element on a page parents will open on mobile.

Related: `public/fala-about.jpg` is **3.9 MB**. It goes through `next/image` so it is optimised on delivery, but it bloats the repo and every deployment.

**Fix:** swap these to `next/image` with explicit `sizes`. Cloudinary URLs work with the default loader given the existing `remotePatterns` entry. Re-compress `fala-about.jpg` at source. Then clear the ESLint warnings rather than leaving them as permanent noise.

---

### 11. `publishedAt` drifts by the UTC offset on every edit

`NewsForm.tsx:23-25` and `AchievementForm.tsx:27-29`:

```ts
function toDatetimeLocal(dateStr?: string) {
  if (!dateStr) return new Date().toISOString().slice(0, 16);
  return new Date(dateStr).toISOString().slice(0, 16);
}
```

`toISOString()` converts to **UTC**, but `<input type="datetime-local">` and the `new Date(publishedAt)` on submit (`NewsForm.tsx:50`) both interpret the string as **local time**. In Poland that is UTC+1 in winter, UTC+2 in summer.

Consequences:
- The admin opens an article published at 18:00 and sees 16:00.
- Saving it without touching the date field writes 16:00 back. **Each save shifts the timestamp back another 1–2 hours.**
- A new article created at 00:30 CEST is stamped the previous day, so it sorts wrongly in the "latest news" list.

**Fix:** build the input value from local components rather than the UTC ISO string:

```ts
function toDatetimeLocal(dateStr?: string) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const offsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
}
```

---

### 12. Cloudinary images are deleted before the DB write commits

In `actions/news.ts:57-62`, `actions/achievements.ts`, and `actions/seasonal-offers.ts`, the update flow is:

```ts
const removed = existing.images.filter((url) => !parsed.images.includes(url));
await Promise.allSettled(removed.map(deleteImage));   // ← destroys the assets

await prisma.news.update({ where: { id }, data: parsed });   // ← may throw
```

If the update throws — unique-constraint violation, connection drop, validation on a field Zod let through — the images are **already permanently gone from Cloudinary** while the row still references them. Result: dead image URLs on the live site, unrecoverable.

`Promise.allSettled` makes this worse by guaranteeing the deletes are never rolled back or surfaced.

**Fix:** invert the order — commit the DB write first, then delete the orphaned assets. On the delete path (`deleteNews` etc.) the current order is already correct.

---

## P2 — Medium

### 13. Renaming an offer breaks its live URL with no redirect

`actions/seasonal-offers.ts:151-153` regenerates the slug whenever the title changes. Any link already shared — Facebook post, parent WhatsApp group, Google's index — 404s immediately, and nothing maps old to new.

News and achievements take the opposite approach: `updateNews` never touches the slug, so the URL survives but drifts out of sync with the title. Two entities, two behaviours, neither documented.

**Fix:** pick one. Keeping the slug stable is the SEO-correct default; if renaming must change the URL, store the previous slug and redirect.

### 14. `slugify` appends a random suffix

`src/lib/slugify.ts:20`:

```ts
const suffix = Math.random().toString(36).substring(2, 6);
return `${base}-${suffix}`;
```

Every URL gets a meaningless 4-character tail: `/aktualnosci/rusza-sezon-2026-zapisy-do-grup-treningowych-k3f9`. It is not deterministic (so the same title yields a different URL each save), it hurts shareability and it is not actually a uniqueness guarantee — 4 base-36 chars is ~1.7M values, and nothing catches the Prisma `P2002` when it does collide, so the admin gets an unhandled error.

**Fix:** slugify plainly, check for an existing row, and append `-2`, `-3`… only on genuine collision. Catch `P2002` and surface a readable message.

### 15. `Group.active` exists but has no UI

The column is in the schema, respected by `getScheduleData` and by the conflict checker in `assertScheduleIsValid`, and `GroupForm` never sets it — `createGroup`/`updateGroup` do not include it in their payloads. So a group can only ever be **deleted**, which cascades away its slots and prices permanently (`DeleteGroupDialog` warns, but the data is gone).

A club that suspends a group for a term has to delete it and re-enter the whole schedule later.

**Fix:** add an "Aktywna" toggle to `GroupForm` and include `active` in the action schema.

### 16. Delete failures are swallowed across every tab

`GrafikTab.tsx:38-47` and the same pattern in `AktualnosciTab`, `OsiagnieciaTab`, `TrenerzyTab`, `SeasonalOffersTab`:

```ts
try {
  await deleteNews(deleteTarget.id);
  router.refresh();
} finally {
  setDeleteTarget(null);
  setDeleting(false);
}
```

No `catch`. If the action throws — session expired, FK constraint, network — the dialog closes as if it worked, the item is still there after refresh, and the admin concludes the CMS is flaky.

**Fix:** add `catch` and surface the message, the way the create/edit forms already do.

### 17. Modals are inaccessible

No modal in the CMS (`GroupForm`, `NewsForm`, `AchievementForm`, `CoachForm`, `SeasonalOfferForm`, `SemesterModal`, `DeleteDialog`, `DeleteGroupDialog`) has `role="dialog"`, `aria-modal`, a focus trap, Escape-to-close, focus restoration, or a click-outside handler. A grep for `role="dialog"`, `aria-modal`, `onKeyDown` and `Escape` across `src/` returns nothing.

Keyboard users can tab straight out of the dialog into the page behind it; screen readers announce no context change. Escape does nothing on a full-screen overlay — the most reflexive keystroke there is.

**Fix:** one shared `<Modal>` wrapper handling `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape, focus trap and restore. Eight call sites, one component.

### 18. Undefined `scrollbar-none` class

`SchedulePage.tsx:169` uses `scrollbar-none`. Tailwind v4 has no such utility and `globals.css` defines `.scroll-hide` (line 156) instead — which `Hero.tsx:142` uses correctly. So the group-picker strip on `/zajecia` shows a scrollbar the design does not account for.

**Fix:** `scrollbar-none` → `scroll-hide`.

### 19. No error, not-found or loading boundaries

There is no `error.tsx`, `global-error.tsx`, `not-found.tsx` or `loading.tsx` anywhere in `src/app`. Only `getScheduleData` wraps its query in `try/catch` (`queries/schedule.ts:107`).

So a Postgres blip on `/aktualnosci`, `/trenerzy`, `/obozy` or any detail page gives the visitor Next's default error screen. `notFound()` on a bad slug renders the unstyled default 404 with no navigation back into the site — every page is `force-dynamic`, so bad URLs reach it at runtime rather than being caught at build.

**Fix:** add a branded `not-found.tsx` and an `error.tsx` with a retry button, at minimum at the `(public)` group level.

### 20. No sitemap, robots, canonical URLs, or social preview images

Missing: `sitemap.ts`, `robots.ts`, `metadataBase`, `alternates.canonical`, and any `openGraph`/`twitter` metadata. The `[slug]` routes have `generateMetadata` with title and description (good) but nothing else.

Practical effect: sharing any page on Facebook — the primary channel for a local club — produces a bare link with no image, no title card, no description. Search engines get no sitemap and no canonical, and there is nothing stopping `/admin` from being crawled.

**Fix:** add `metadataBase` in the root layout, a `sitemap.ts` enumerating published news/achievements/offers, a `robots.ts` disallowing `/admin`, and `openGraph.images` — either a static default or `opengraph-image.tsx` per detail route using the item's first image.

### 21. `signupUrl` accepts any URI scheme

`actions/seasonal-offers.ts:70-76`:

```ts
if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
```

The comment says "Any link is allowed", and it means it — `javascript:...` and `data:text/html,...` pass through and land in `<a href>` in `SeasonalOfferDetail.tsx:50`.

This is admin-only, so it is not a path from an anonymous attacker; it matters as defence-in-depth if an admin session is ever compromised, and because a typo'd scheme silently produces a dead button.

**Fix:** allow-list `http:`, `https:`, `mailto:`, `tel:` and reject the rest with a validation message.

### 22. Session and credential hardening

- No `session.maxAge` in `authOptions` — NextAuth defaults to **30 days**. For a panel that edits a public website, a few days is more appropriate.
- `authorize` (`lib/auth.ts:24-27`) returns early when the user is not found, skipping `bcrypt.compare`. The timing difference lets an attacker enumerate valid admin e-mails. Compare against a dummy hash on the not-found path.
- `.env` defines both `AUTH_SECRET` and `NEXTAUTH_SECRET`. NextAuth v4 reads only `NEXTAUTH_SECRET`; `AUTH_SECRET` is a v5 name and is dead here. Remove it so nobody rotates the wrong one.
- No `Role` enforcement anywhere. The schema has `ADMIN`/`SUPERADMIN` and every guard is a bare `if (!session)`. Either use the roles or drop the enum.

### 23. No security headers

`next.config.ts` sets `images` and nothing else. No CSP, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` or HSTS. The admin panel in particular should not be framable.

**Fix:** add a `headers()` block. `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` are free; a CSP will need tuning against the inline styles and the Cloudinary/Google Fonts origins.

### 24. Unbounded text fields

`SeasonalOfferSchema` caps `title`, `summary`, `locationName` and friends, but `program`, `accommodation`, `meals`, `transport`, `included` and `signupInfo` have only `.min(1)` or nothing. `NewsSchema.content` and `AchievementSchema.content` are likewise uncapped. Admin-only, so low risk — but a pasted document goes straight into Postgres and then into every page render.

**Fix:** add `.max()` bounds consistent with the fields that already have them.

---

## P3 — Polish

25. **Orphaned uploads.** `ImageUploader` uploads to Cloudinary the instant a file is chosen. Closing the form without saving leaves the asset in the account, unreferenced and invisible to the CMS. A periodic sweep, or deferring upload to submit, would fix it.

26. **`escapeHtml` in the e-mail subject** (`api/send/route.ts:76`). Subjects are not HTML; a group name containing `&` arrives as `&amp;`. Escape the body only.

27. **No `replyTo` on the Resend send.** Hitting reply in the club's mailbox goes to `formularz@uksfala.com.pl`, not the parent. Set `replyTo: email` — small change, noticeably better workflow.

28. **No confirmation to the sender.** The parent gets no acknowledgement that their enquiry arrived. A short auto-reply reduces duplicate submissions and phone calls.

29. **Placeholder social links.** `Footer.tsx:44,60` point at `https://facebook.com` and `https://instagram.com` — the bare homepages, not the club's profiles.

30. **`prefers-reduced-motion` ignored.** `animate-fade-up`, `animate-ping` on the hero badge and `wave-drift` on the wave divider run unconditionally. A `@media (prefers-reduced-motion: reduce)` block in `globals.css` disabling them is a few lines.

31. **Unsplash hosts still allowed** in `next.config.ts` `remotePatterns` — demo leftovers, only referenced by the fallback data removed in finding 6. Drop them once that goes.

32. **README is untouched create-next-app boilerplate**, and there is no `.env.example`. For a site being handed to a club, document the required env vars (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, the three `CLOUDINARY_*`, `RESEND_API_KEY`), the seed command, and how to reset the admin password.

33. **`NEXT_PUBLIC_FACEBOOK_PIXEL_ID` is set in `.env` but never read** — a grep for `FACEBOOK`, `fbq` and `Pixel` across `src/` returns nothing. Either wire up the pixel (which itself needs a cookie-consent banner under RODO) or delete the variable.

34. **18 ESLint warnings** — 12 `no-img-element` (finding 10) and 6 `no-unused-vars` in `AktualnosciTab`, `OsiagnieciaTab`, `TrenerzyTab`, `GrafikTab`, `GroupForm` and one more. Clear them so the next real warning is visible instead of buried.

---

## What is good

Worth recording, because these are the parts not to disturb while fixing the above:

- **Every mutating server action is auth-guarded and Zod-validated.** Twenty-odd actions across six files, consistent pattern, no gaps — except `upload.ts` (finding 4). That consistency is exactly why the one omission stands out.
- **`src/lib/schedule-grid.ts` is genuinely well-designed.** One source of truth for the grid geometry, shared by the public `/zajecia` view and the CMS slot editor, with comments explaining *why* CSS grid rows replaced table `rowSpan`. `placeBlocks`/`hasConflict`/`laneColumn` are pure and testable.
- **Schedule conflict validation is server-side, not just UI.** `assertScheduleIsValid` (`actions/groups.ts:36`) checks grid fit, self-overlap and cross-group lane clashes, with error messages naming the specific day, hour, lane and conflicting group in Polish. The client editor is a convenience layer over real enforcement, which is the right way round.
- **`updateGroup` wraps its delete-and-recreate in `prisma.$transaction`** — slots and prices cannot be left half-written.
- **The admin help page** (`/admin/pomoc`) is a real, structured Polish manual with a table of contents. Rare, and it is what makes this handover-able.
- **Comments explain intent rather than restating code** — the caching rationale in `training-groups.ts`, the `normalizeUrl` reasoning, the `pluralZajecia` note about Polish plurale tantum. That last one is a nice touch: the price panel gets its grammar right.
- **Type safety holds up.** `tsc --noEmit` is clean and the build succeeds with no `any` escapes in the application code.

---

## Suggested order of work

**Before launch**
1. Findings 1 and 2 — make both forms actually send, and test each by submitting one. *(Nothing else matters if these are broken.)*
2. Finding 3 — footer logo path.
3. Finding 4 — auth guard on `upload.ts`.
4. Finding 5 — validate groups against the DB.
5. Finding 6 — remove the fabricated news/achievement fallbacks and seed production.
6. Finding 8 — privacy policy and consent (needs the club's input; start it early).
7. Finding 7 — at minimum a honeypot on both forms and a login lockout.

**First week**
8. Findings 9, 10 — caching and `next/image`; the two biggest performance wins.
9. Findings 11, 12 — the two data-correctness bugs.
10. Findings 20, 19 — sitemap/OG/robots, then error and 404 boundaries.

**Next iteration**
11. The rest of P2, starting with 15 (`active` toggle) and 16 (delete error handling) — both directly affect the club's day-to-day use of the panel.
12. P3 as capacity allows.

---

## Testing gap

There are no tests of any kind in the repository — no test runner in `package.json`, no spec files.

Findings 1 and 5 are precisely the class of bug a single integration test would have caught: an assertion that posting the reservation form's own payload to `/api/send` returns 200. Findings 11 and 18 would fall to a component test.

Before the next round of changes, the highest-value additions are:
- an integration test posting each form's real payload shape to `/api/send`,
- unit tests for `schedule-grid.ts` (`placeBlocks`, `hasConflict`, `fitsInGrid` — pure functions, trivial to cover) and for `assertScheduleIsValid`,
- a test that `uploadImage`/`deleteImage` reject an unauthenticated call, so finding 4 cannot silently return.
