# Plan optymalizacji wydajności — uks_fala

Data analizy: 2026-08-26 · Next 16.1.6 (App Router, Turbopack) · React 19.2 · Neon Postgres (eu-central-1) · Cloudinary

> **Status (2026-08-26): fazy 1, 2, 3a, 3b i 3c wdrożone.**
>
> - **Renderowanie:** TTFB stron statycznych **4–22 ms** (wcześniej każde
>   wejście = round-trip do Neon). Wszystkie strony publiczne poza
>   `/aktualnosci` i `/osiagniecia` (paginacja przez `searchParams`) są
>   prerenderowane, łącznie ze stronami szczegółów `[slug]`.
> - **Obrazy statyczne:** `public/` z **15 MB → 1,3 MB**.
> - **Obrazy z CMS-u:** strona główna z **1161 KB → 162 KB** na desktopie
>   i **76 KB** na mobile (spadek ~86–93%). Zniknęły też dwa preloady
>   surowych oryginałów, które konkurowały z LCP hero.
>
> Zamiast `next/image` powstał komponent `src/components/CmsImage.tsx`
> oparty o `src/lib/cloudinary-image.ts` — transformacje (`f_auto,q_auto,
> c_limit,w_*`) i wybór formatu robi CDN Cloudinary, więc nie obciążamy
> optymalizatora Next ani limitu optymalizacji obrazów na Vercelu.
> Adresy spoza Cloudinary (dane fallbackowe z Unsplasha) degradują się do
> zwykłego `<img loading="lazy">`.
>
> **Pozostało:** faza 4 (klient), faza 5 (zapytania, sitemap) oraz 5 surowych
> `<img>` w panelu admina (`cms/_components/*Tab.tsx`, `ImageUploader.tsx`) —
> ten sam defekt, ten sam helper, ~10 minut.

---

## 1. Gdzie realnie ucieka czas

Strona nie jest wolna z powodu "za dużo JavaScriptu" — bundle jest zdrowy
(~390 KB nieskompresowanego runtime + ~69 KB CSS). Wolna jest z trzech
konkretnych powodów, w tej kolejności ważności:

| # | Przyczyna | Wpływ | Koszt naprawy |
|---|-----------|-------|---------------|
| 1 | **Wszystkie strony publiczne są `force-dynamic`** — każde wejście = round-trip do Neon | TTFB 300 ms – 2 s (cold start Neon), *każdorazowo* | niski |
| 2 | **Obrazy w `public/` mają 14 MB** — `szkola.jpg` 10 MB / 4000×2667, `fala-about.jpg` 3.9 MB / 3615×3615 | pierwszy request na `/szkola-plywania` i `/o-nas` czeka na optymalizator | trywialny |
| 3 | **Zdjęcia z Cloudinary lecą przez surowe `<img>`** — bez `srcset`, bez lazy, bez wymiarów | pełne oryginały (do 5 MB) na listingach, duży CLS | niski |

Poza tym: kilka `priority` na obrazach poniżej folda, brak `sizes` przy
`fill`, listener scrolla w nawigacji ustawiający state co klatkę, brak
`loading.tsx`.

---

## 2. Szczegółowe ustalenia

### 2.1 Renderowanie — `force-dynamic` na 12 stronach

```
src/app/(public)/page.tsx:1                    export const dynamic = "force-dynamic"
src/app/(public)/o-nas/page.tsx                (brak — statyczna, OK)
src/app/(public)/aktualnosci/page.tsx:1        force-dynamic
src/app/(public)/aktualnosci/[slug]/page.tsx:1 force-dynamic
src/app/(public)/osiagniecia/page.tsx:1        force-dynamic
src/app/(public)/osiagniecia/[slug]/page.tsx:1 force-dynamic
src/app/(public)/obozy/page.tsx:1              force-dynamic
src/app/(public)/obozy/[slug]/page.tsx:1       force-dynamic
src/app/(public)/polkolonie/page.tsx:1         force-dynamic
src/app/(public)/polkolonie/[slug]/page.tsx:1  force-dynamic
src/app/(public)/trenerzy/page.tsx:1           force-dynamic
src/app/(public)/trenerzy/[slug]/page.tsx:1    force-dynamic
src/app/(public)/grafik/page.tsx:1             force-dynamic
```

To jest **pojedyncza największa przyczyna** wolnego ładowania. Treść zmienia
się kilka razy w miesiącu przez CMS, a płacimy za nią przy każdym wejściu
użytkownika. Strona główna odpala przy tym 5 niezależnych zapytań
(`AktualnosciSection` → news + seasonal offers, `OsiagnieciaSection`,
`TrainingGroups`, `Coaches`, `SitePopup`) — bez `Suspense`, więc HTML nie
wychodzi, dopóki nie wróci najwolniejsze z nich.

Neon na planie ze scale-to-zero dokłada do tego cold start rzędu 0,5–2 s po
okresie bezruchu — czyli dokładnie w scenariuszu "rodzic klika link z
Facebooka wieczorem".

Infrastruktura pod ISR **już istnieje**: wszystkie server actions wołają
`revalidatePath`, a `getTrainingGroups` używa `unstable_cache` + `updateTag`.
Brakuje tylko zdjęcia `force-dynamic`.

**Luki w rewalidacji do załatania *przed* włączeniem ISR** (dziś nieszkodliwe,
bo nic nie jest cache'owane; po zmianie spowodują pokazywanie starej treści):

- `src/lib/actions/coaches.ts:20` — rewaliduje `/` i `/admin/cms`, **nie** `/trenerzy` ani `/trenerzy/[slug]`
- `src/lib/actions/news.ts:20` — nie rewaliduje `/aktualnosci/[slug]`
- `src/lib/actions/achievements.ts:20` — nie rewaliduje `/osiagniecia/[slug]`

### 2.2 Obrazy statyczne

| Plik | Wymiary | Waga | Wyświetlany na | Realnie potrzebne |
|------|---------|------|----------------|-------------------|
| `public/szkola.jpg` | 4000×2667 | **10 MB** | `/szkola-plywania` (16:9, max 1240 px) | ~2000 px, ~250 KB webp |
| `public/fala-about.jpg` | 3615×3615 | **3.9 MB** | `/o-nas`, `/sekcja-sportowa` (3:4, ~450 px kolumna) | ~1200 px, ~150 KB webp |
| `public/about1.webp` | 2158×2860 | 512 KB | `/` (3:4, ~450 px) | ~1200 px, ~150 KB |
| `public/hero1.webp` | 2367×1510 | 304 KB | hero (100vw) | OK |
| `logo-blue/*.png` | do 4222×1591 | 100–156 KB | 106×40 i 43×50 px | SVG lub PNG ~300 px |

`next/image` te obrazy przetworzy, ale: (a) pierwsze żądanie każdego wariantu
płaci pełną dekompresję 10 MB JPEG-a po stronie serwera, (b) 14 MB leci do
repo i do każdego deployu, (c) `next build` z tym pracuje.

**Brakujące `sizes` przy `fill`** — Next przyjmuje wtedy `100vw` i wybiera
kandydata 3840 px do kolumny szerokiej na ~450 px:

```
src/components/About.tsx:111              fill + priority, brak sizes
src/app/(public)/o-nas/page.tsx:224       fill + priority, brak sizes
src/app/(public)/sekcja-sportowa/page.tsx:175  fill + priority, brak sizes
src/app/(public)/trenerzy/[slug]/page.tsx:64   priority
```

**`priority` poniżej folda** — 4 z 8 użyć. `priority` wstrzykuje
`<link rel="preload">`, więc obrazek z sekcji "O klubie" konkuruje o pasmo z
LCP hero. Do zdjęcia zostają: `Hero.tsx:18` i logo w `Navigation.tsx:81`.

### 2.3 Obrazy z Cloudinary — surowe `<img>`

```
src/components/AktualnosciSection.tsx:92        <img src={item.images[0]}>
src/components/SeasonalOfferCard.tsx:56         <img src={offer.images[0]}>
src/components/SeasonalOfferDetail.tsx:189,197  <img>
src/app/(public)/aktualnosci/page.tsx:46        <img>
src/app/(public)/aktualnosci/[slug]/page.tsx:50 <img>
src/app/(public)/osiagniecia/[slug]/page.tsx:51 <img>
```

`src/lib/upload.ts:52` zapisuje `result.secure_url` — czyli
`https://res.cloudinary.com/<cloud>/image/upload/v.../plik.jpg`, oryginał do
5 MB, bez transformacji. Strona główna pokazuje 4 takie kafelki w siatce
`aspect-[16/10]` — potrafi to być kilkanaście MB obrazów na jedną sekcję.
Brak `width`/`height` i `loading` = skok layoutu przy dociąganiu.

Cloudinary jest już na liście `remotePatterns` (`next.config.ts:18`), więc
`next/image` zadziała od ręki. Alternatywnie (taniej, bo bez przechodzenia
przez optymalizator Next) — wstrzyknąć `f_auto,q_auto,w_800` w URL.

### 2.4 Klient

- **`src/components/Navigation.tsx:47-53`** — `setScrollY(window.scrollY)` na
  każdym zdarzeniu scrolla. Komponent renderuje ~10 pozycji menu i 2 obrazy,
  więc na stronie głównej re-render leci przy każdej klatce przewijania.
  Wykorzystywana jest z tego wyłącznie wartość boolean `scrollY > 40`.
- **`src/components/CallToAction.tsx:1`** — cała sekcja kontaktowa jest
  `"use client"` wyłącznie z powodu `onSubmit={(e) => e.preventDefault()}`
  w linii 114. Formularz **nic nie wysyła** — to osobny błąd funkcjonalny
  (`/api/send` istnieje i działa, ale wywołuje go tylko `SchedulePage`).
- **`src/app/(public)/grafik/SchedulePage.tsx`** — 617 linii `"use client"`,
  dostaje cały `ScheduleData` zserializowany do RSC payloadu. Działa, ale
  `HeroStrip` i statyczne sekcje opisowe można wyciągnąć do serwera.
- **Brak `loading.tsx`** w całym `src/app` — nawigacja między stronami blokuje
  się na serwerze bez żadnej wizualnej odpowiedzi.

### 2.5 Zapytania

- `src/lib/queries/schedule.ts:56` i `:92` — `findMany` i `findUnique`
  sekwencyjnie; można równolegle (`Promise.all`), oszczędza jeden RTT do Neon.
- `getLatestNews` / `getLatestAchievements` / `getPublishedSeasonalOffers` —
  `findMany` bez `select`, ciągną pełne `content` (długi tekst artykułu) tylko
  po to, żeby wyrenderować kafelek z tytułem i opisem. `getTrainingGroups`
  robi to poprawnie (`select`) — wystarczy powtórzyć wzorzec.
- `getCoachBySlug` (`src/lib/queries/coaches.ts:80`) pobiera **wszystkich**
  trenerów, żeby znaleźć jednego — to świadoma decyzja (slugi liczone z
  całej listy) i przy kilkunastu rekordach jest OK. Zostawić.

### 2.6 Drobne

- Brak `sitemap.ts` i `robots.ts` w `src/app`.
- `next.config.ts` — brak `images.formats` (AVIF) i `images.minimumCacheTTL`.
- `remotePatterns` wciąż dopuszcza trzy domeny Unsplash — używane już tylko
  przez dane fallbackowe.
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` jest w `.env`, ale nigdzie nie użyty — jeśli
  pixel ma trafić na stronę, musi iść przez `next/script` ze `strategy="lazyOnload"`,
  inaczej skasuje część zysku z tego planu.

---

## 3. Plan wdrożenia

### Faza 0 — pomiar bazowy (15 min)

```bash
npm run build            # zanotuj rozmiary route'ów i czas builda
npx unlighthouse --site <prod-url>    # albo Lighthouse na /, /o-nas, /grafik
```

Zapisz LCP, TTFB i "Total Byte Weight" dla `/`, `/o-nas`, `/szkola-plywania`,
`/aktualnosci`. Bez tego nie da się pokazać efektu.

---

### Faza 1 — obrazy statyczne (30 min, największy zysk na wysiłek)

Kompresja źródeł w `public/`:

```bash
cd public
# sharp jest już w node_modules (0.34.5)
node -e '
const sharp=require("sharp");
const jobs=[
  ["szkola.jpg","szkola.webp",2000],
  ["fala-about.jpg","fala-about.webp",1400],
  ["about1.webp","about1.webp",1400],
  ["hero1.webp","hero1.webp",2000],
];
for(const [i,o,w] of jobs){
  sharp(i).resize({width:w,withoutEnlargement:true})
    .webp({quality:80}).toFile("_opt_"+o)
    .then(()=>console.log(o));
}'
# sprawdź wizualnie _opt_*, potem podmień i zaktualizuj ścieżki .jpg -> .webp
```

Logo: przeskalować do ~400 px szerokości (albo wyeksportować SVG — logo
wektorowe zejdzie do ~4 KB i przestanie w ogóle wymagać optymalizatora).

Spodziewany efekt: `public/` z 15 MB → ~1 MB.

Równolegle w kodzie:

1. Dodać `sizes` do każdego `<Image fill>`:
   ```tsx
   // About.tsx:111, o-nas:224, sekcja-sportowa:175
   sizes="(min-width: 768px) 42vw, 100vw"
   // szkola-plywania:186 ma już poprawne sizes
   ```
2. Usunąć `priority` z: `About.tsx:111`, `o-nas/page.tsx:224`,
   `sekcja-sportowa/page.tsx:175`, `szkola-plywania/page.tsx:190`,
   `trenerzy/[slug]/page.tsx:64`. Zostawić w `Hero.tsx:18` i
   `Navigation.tsx:81` (logo w headerze).
3. `next.config.ts` — dodać:
   ```ts
   images: {
     formats: ["image/avif", "image/webp"],
     minimumCacheTTL: 2678400, // 31 dni
     remotePatterns: [ /* zostawić tylko res.cloudinary.com */ ],
   }
   ```

---

### Faza 2 — obrazy z Cloudinary (1 h)

Dodać helper i użyć go we wszystkich 6 miejscach z surowym `<img>`:

```ts
// src/lib/cloudinary-url.ts
export function cldThumb(url: string, width = 800) {
  return url.includes("/image/upload/")
    ? url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`)
    : url;
}
```

W komponentach zamienić na `next/image` z jawnym `sizes` (Cloudinary jest już
w `remotePatterns`) **albo** — prościej i bez obciążania optymalizatora Next —
zostawić `<img>`, ale z `src={cldThumb(url, 800)}`, `width`, `height`,
`loading="lazy"` i `decoding="async"`. Rekomendacja: `next/image` na
listingach (`AktualnosciSection`, `SeasonalOfferCard`, `aktualnosci/page`),
`cldThumb` w galeriach na stronach szczegółów.

Dla nowych uploadów warto docelowo zapisywać już przetworzony URL w
`src/lib/upload.ts` — ale to zmienia dane w bazie, więc osobno.

---

### Faza 3 — renderowanie: ISR zamiast `force-dynamic` (2 h, największy zysk na TTFB)

**Krok 3a — najpierw domknąć rewalidację** (inaczej CMS przestanie działać
"od razu"):

```ts
// src/lib/actions/coaches.ts
function revalidate() {
  revalidatePath("/");
  revalidatePath("/trenerzy");
  revalidatePath("/trenerzy/[slug]", "page");
  revalidatePath("/admin/cms");
}
// src/lib/actions/news.ts — dodać revalidatePath("/aktualnosci/[slug]", "page")
// src/lib/actions/achievements.ts — dodać revalidatePath("/osiagniecia/[slug]", "page")
// src/lib/actions/groups.ts — dodać revalidatePath("/") (karty grup na home)
```

**Krok 3b — zamienić dyrektywy.** W każdym z 12 plików:

```diff
-export const dynamic = "force-dynamic";
+export const revalidate = 3600;
```

`revalidate` + istniejące `revalidatePath` daje: strona serwowana z cache
natychmiast, a edycja w CMS publikuje się od razu. Godzina to tylko siatka
bezpieczeństwa.

**Krok 3c — `generateStaticParams`** dla `[slug]` (aktualności, osiągnięcia,
obozy, półkolonie, trenerzy), żeby detale były prerenderowane, a nie
generowane przy pierwszym trafieniu.

**Krok 3d — `loading.tsx`** w `src/app/(public)/` (i ewentualnie per-sekcja),
żeby nawigacja pokazywała szkielet natychmiast.

**Krok 3e — `Suspense` wokół sekcji strony głównej**, żeby hero (statyczny,
zero zapytań) wychodził natychmiast, a sekcje z bazy dociągały się strumieniowo:

```tsx
<Hero />
<About />
<Advantages />
<Suspense fallback={<SectionSkeleton />}><AktualnosciSection /></Suspense>
<Suspense fallback={<SectionSkeleton />}><OsiagnieciaSection /></Suspense>
...
```

---

### Faza 4 — klient (1 h)

1. **`Navigation.tsx`** — trzymać boolean zamiast pozycji:
   ```ts
   const [scrolled, setScrolled] = useState(false);
   useEffect(() => {
     if (!isHome) { setScrolled(true); return; }
     let raf = 0;
     const onScroll = () => {
       cancelAnimationFrame(raf);
       raf = requestAnimationFrame(() => setScrolled(window.scrollY > 40));
     };
     onScroll();
     window.addEventListener("scroll", onScroll, { passive: true });
     return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
   }, [isHome]);
   ```
   React i tak pominie render, gdy boolean się nie zmieni — znika ~60 renderów/s.

2. **`CallToAction.tsx`** — zdjąć `"use client"`, wydzielić `<ContactForm />`
   jako mały komponent kliencki. Przy okazji **podpiąć formularz pod
   `/api/send`** — dziś nie robi nic.

3. **`grafik/SchedulePage.tsx`** — wyciągnąć `HeroStrip` i statyczne bloki
   opisowe poza granicę klienta.

---

### Faza 5 — zapytania i dodatki (30 min)

1. `src/lib/queries/schedule.ts` — `Promise.all` dla `group.findMany` i
   `semesterDayCount.findUnique`.
2. Dodać `select` do `getLatestNews`, `getLatestAchievements`,
   `getPublishedSeasonalOffers` — bez pola `content` na listingach.
3. Dodać `src/app/sitemap.ts` i `src/app/robots.ts`.
4. Jeśli pixel Facebooka ma wejść — `next/script` ze `strategy="lazyOnload"`.

---

## 4. Kolejność, gdyby był czas tylko na część

1. **Faza 1** (obrazy statyczne) — 30 min, natychmiast widoczne na `/o-nas`
   i `/szkola-plywania`.
2. **Faza 3b** (`force-dynamic` → `revalidate`) — 20 min, zmienia TTFB
   wszystkich stron; wymaga tylko kroku 3a jako zabezpieczenia.
3. **Faza 2** (Cloudinary) — największy zysk na stronie głównej i listingach.
4. Reszta.

## 5. Czego celowo *nie* robimy

- Nie ruszamy `getCoachBySlug` — pobieranie całej listy jest tu świadome i
  przy kilkunastu trenerach nieistotne.
- Nie przepisujemy `SchedulePage` na server components — 617 linii mocno
  interaktywnego UI, stosunek ryzyka do zysku zły.
- Nie włączamy `cacheComponents` / `"use cache"` — `revalidate` +
  `revalidatePath` załatwia sprawę bez wchodzenia w świeże API.
- Nie zmniejszamy bundla — jest w normie, to nie tu jest problem.
