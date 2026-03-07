import { prisma } from "@/lib/prisma";

const FALLBACK_NEWS = [
  {
    id: "fallback-news-1",
    title: "Rusza sezon 2026: zapisy do grup treningowych",
    slug: "rusza-sezon-2026-zapisy-do-grup-treningowych",
    description:
      "Otwieramy zapisy do wszystkich grup wiekowych. Pierwsze treningi pokazowe startuja od 16 marca.",
    content:
      "Nowy sezon rozpoczynamy od tygodnia treningow otwartych dla nowych zawodnikow i rodzicow. Kazda grupa bedzie miala dwa terminy pokazowe, podczas ktorych trenerzy przedstawia plan pracy na semestr oraz poziomy zaawansowania.\n\nW tym roku rozszerzamy harmonogram o dodatkowe poranne zajecia techniczne dla starszych zawodnikow. Treningi skupia sie na ekonomii ruchu, nawrotach i pracy nog.\n\nRodzicow prosimy o wypelnienie formularza i wybranie preferowanej grupy. Po pierwszym tygodniu trener prowadzacy potwierdzi ostateczny przydzial oraz przekaze komplet informacji organizacyjnych.",
    images: [
      "https://images.unsplash.com/photo-1678625994011-bf9022f90ff0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dpbW1pbmclMjBzY2hvb2x8ZW58MHx8MHx8fDI%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-03-07"),
    createdAt: new Date("2026-03-07"),
    updatedAt: new Date("2026-03-07"),
  },
  {
    id: "fallback-news-2",
    title: "5 medali UKS Fala na Mistrzostwach Mazowsza",
    slug: "5-medali-uks-fala-na-mistrzostwach-mazowsza",
    description:
      "Udany start naszej reprezentacji: dwa zlota, jedno srebro i dwa brazy w kategoriach mlodzikow.",
    content:
      "Weekendowe zawody w Warszawie przyniosly nam bardzo dobre wyniki i kilka rekordow zyciowych. Najlepiej zaprezentowala sie sztafeta 4x50 m stylem dowolnym, ktora poprawila czas o ponad trzy sekundy.\n\nIndywidualnie zawodnicy punktowali na dystansach 50 i 100 m stylem grzbietowym oraz dowolnym. Trenerzy podkreslaja, ze na szczegolne uznanie zasluguje regularnosc startow i spokojna realizacja zalozen taktycznych.\n\nDziekujemy rodzicom za obecnosci na trybunach i wsparcie podczas calego dnia startowego. Kolejna runda Grand Prix odbedzie sie za dwa tygodnie.",
    images: [
      "https://images.unsplash.com/photo-1678625994022-92765ba3920a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3dpbW1pbmclMjBzY2hvb2x8ZW58MHx8MHx8fDI%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-02-28"),
    createdAt: new Date("2026-02-28"),
    updatedAt: new Date("2026-02-28"),
  },
  {
    id: "fallback-news-3",
    title: "Plan na ferie: mini-camp techniczny",
    slug: "plan-na-ferie-mini-camp-techniczny",
    description:
      "W drugim tygodniu ferii organizujemy trzydniowy blok treningowy dla grup sredniozaawansowanych.",
    content:
      "Mini-camp obejmuje dwa treningi dziennie: poranny blok techniczny na basenie i popoludniowa sesje ogolnorozwojowa na sali. Program przygotowalismy pod zawodnikow, ktorzy chca poprawic efektywnosc stylu kraul i grzbiet.\n\nKazdy dzien zakonczymy analiza nagran video i krotkim podsumowaniem celow na kolejna jednostke. Taka forma pracy pozwala szybciej utrwalic nowe nawyki i kontrolowac postep.\n\nLiczba miejsc jest ograniczona, dlatego o udziale decyduje kolejnosc zgloszen oraz rekomendacja trenera grupy.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2026-02-10"),
    createdAt: new Date("2026-02-10"),
    updatedAt: new Date("2026-02-10"),
  },
  {
    id: "fallback-news-4",
    title: "Nowe godziny zajec dla grup 3-5 lat",
    slug: "nowe-godziny-zajec-dla-grup-3-5-lat",
    description:
      "Dodajemy dwa terminy popoludniowe dla najmlodszych. W planie oswajanie z woda i nauka przez zabawe.",
    content:
      "Ze wzgledu na duze zainteresowanie uruchamiamy dodatkowe zajecia dla przedszkolakow we wtorki i czwartki. Kazda jednostka trwa 40 minut i odbywa sie w malych, kameralnych grupach.\n\nProgram zawiera elementy adaptacji do srodowiska wodnego, cwiczenia oddechowe i podstawowe pozycje wypornosciowe. Trenerzy dbaja o bezpieczne tempo i komfort dzieci, a rodzice otrzymuja krotka informacje po kazdych zajeciach.\n\nZapisy prowadzone sa przez formularz online. Przy przydziale grupy bierzemy pod uwage wiek dziecka oraz dotychczasowe doswiadczenie na basenie.",
    images: [
      "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3dpbW1pbmclMjBwb29sfGVufDB8fDB8fHwy",
    ] as string[],
    published: true,
    publishedAt: new Date("2026-01-22"),
    createdAt: new Date("2026-01-22"),
    updatedAt: new Date("2026-01-22"),
  },
  {
    id: "fallback-news-5",
    title: "Spotkanie organizacyjne dla rodzicow",
    slug: "spotkanie-organizacyjne-dla-rodzicow",
    description:
      "Zapraszamy na wieczorne spotkanie informacyjne dotyczace kalendarza startow i zasad komunikacji.",
    content:
      "Podczas spotkania omowimy plan sezonu, zasady kwalifikacji na zawody oraz organizacje wyjazdow. Przedstawimy tez, jak wyglada tygodniowy mikrocykl treningowy w poszczegolnych grupach.\n\nW drugiej czesci odpowiemy na pytania dotyczace regeneracji, odzywiania i laczenia treningow z obowiazkami szkolnymi. Chcemy, aby rodzice mieli pelen obraz obciazen i celow sportowych.\n\nNa koniec udostepnimy materialy podsumowujace oraz harmonogram konsultacji indywidualnych z trenerami.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2026-01-12"),
    createdAt: new Date("2026-01-12"),
    updatedAt: new Date("2026-01-12"),
  },
  {
    id: "fallback-news-6",
    title: "Nowe elementy treningu sily w wodzie",
    slug: "nowe-elementy-treningu-sily-w-wodzie",
    description:
      "Wprowadzamy cykl cwiczen oporowych, ktory wspiera sile specyficzna i stabilizacje tulowia.",
    content:
      "Od stycznia do planu starszych grup dolaczamy zestaw cwiczen oporowych z gumami i bojkami. Priorytetem jest poprawa chwytu wody oraz utrzymania pozycji ciala na finiszu dystansu.\n\nNowy blok bedzie realizowany raz w tygodniu i monitorowany testami porownawczymi co cztery tygodnie. Wyniki pozwola precyzyjnie dopasowac intensywnosc do aktualnego etapu przygotowan.\n\nPierwsze obserwacje z grudniowych prob pokazuja, ze zawodnicy szybciej utrzymuja tempo na ostatnich 25 metrach wyscigu.",
    images: [
      "https://images.unsplash.com/photo-1560088939-ddaf4d3e0d0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHN3aW1taW5nJTIwcG9vbHxlbnwwfHwwfHx8Mg%3D%3D",
    ] as string[],
    published: true,
    publishedAt: new Date("2025-12-19"),
    createdAt: new Date("2025-12-19"),
    updatedAt: new Date("2025-12-19"),
  },
  {
    id: "fallback-news-7",
    title: "Mikolajkowe zawody klubowe: podsumowanie",
    slug: "mikolajkowe-zawody-klubowe-podsumowanie",
    description:
      "Ponad 80 startow, duzo emocji i rekordow zyciowych podczas grudniowego sprawdzianu wewnetrznego.",
    content:
      "Tradycyjne zawody mikolajkowe zgromadzily zawodnikow ze wszystkich grup szkoleniowych. Dla najmlodszych byly to pierwsze starty z pomiarem czasu i publicznoscia na trybunach.\n\nW starszych kategoriach testowalismy tempa startowe przed styczniowymi zawodami okregowymi. Najwiecej popraw odnotowalismy na dystansach 50 m i 100 m kraulem.\n\nDziekujemy wolontariuszom i rodzicom za pomoc przy organizacji wydarzenia. Galeria zdjec i oficjalne wyniki sa juz dostepne w panelu klubu.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-12-08"),
    createdAt: new Date("2025-12-08"),
    updatedAt: new Date("2025-12-08"),
  },
  {
    id: "fallback-news-8",
    title: "Wspolpraca z fizjoterapeuta sportowym",
    slug: "wspolpraca-z-fizjoterapeuta-sportowym",
    description:
      "Rozszerzamy opieke okolotreningowa o regularne konsultacje z fizjoterapeuta sportowym.",
    content:
      "W odpowiedzi na potrzeby zawodnikow uruchamiamy cykl konsultacji profilaktycznych z fizjoterapeuta specjalizujacym sie w sportach wodnych. Spotkania beda dostepne raz w miesiacu dla grup wyczynowych.\n\nPodczas wizyt oceniana bedzie mobilnosc obraczy barkowej, praca tulowia i ewentualne asymetrie wynikajace z obciazen treningowych. Na tej podstawie zawodnicy otrzymaja indywidualne zalecenia cwiczen uzupelniajacych.\n\nTakie wsparcie pomaga ograniczyc ryzyko przeciazen i utrzymac regularnosc treningow przez caly sezon.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-11-18"),
    createdAt: new Date("2025-11-18"),
    updatedAt: new Date("2025-11-18"),
  },
  {
    id: "fallback-news-9",
    title: "Nabor uzupelniajacy do grup srednich",
    slug: "nabor-uzupelniajacy-do-grup-srednich",
    description:
      "Ostatnie wolne miejsca dla dzieci, ktore opanowaly podstawy i chca trenowac regularnie dwa razy w tygodniu.",
    content:
      "Uruchamiamy nabor uzupelniajacy do dwoch grup sredniozaawansowanych. Zajecia skierowane sa do dzieci, ktore potrafia samodzielnie przeplynac dlugosc toru i chca kontynuowac nauke techniki.\n\nW trakcie pierwszych zajec trener przeprowadzi krotka diagnoze umiejetnosci i dobierze odpowiedni poziom. Priorytetem jest plynnosc ruchu, prawidlowy oddech i kontrola tempa.\n\nPo zakonczeniu miesiaca probnego rodzice otrzymaja rekomendacje dotyczaca dalszej sciezki szkolenia.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-10-30"),
    createdAt: new Date("2025-10-30"),
    updatedAt: new Date("2025-10-30"),
  },
  {
    id: "fallback-news-10",
    title: "Kalendarz startow na wiosne 2026",
    slug: "kalendarz-startow-na-wiosne-2026",
    description:
      "Publikujemy harmonogram najwazniejszych zawodow i terminow kwalifikacji na najblizsze miesiace.",
    content:
      "Wiosenny kalendarz obejmuje cztery imprezy okregowe oraz dwa starty kontrolne organizowane przez klub. Szczegolowy plan z datami i dystansami zostal opublikowany w panelu zawodnika.\n\nKwalifikacje beda oparte na aktualnej dyspozycji i frekwencji treningowej. Trenerzy beda przekazywac decyzje o skladach na biezaco, po kazdym sprawdzianie czasowym.\n\nProsimy o rezerwacje terminow i szybkie potwierdzanie udzialu, aby sprawnie organizowac transport oraz zgloszenia do organizatorow.",
    images: [] as string[],
    published: true,
    publishedAt: new Date("2025-10-12"),
    createdAt: new Date("2025-10-12"),
    updatedAt: new Date("2025-10-12"),
  },
];

export async function getLatestNews(limit = 4) {
  const items = await prisma.news.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return items.length > 0 ? items : FALLBACK_NEWS.slice(0, limit);
}

export async function getAllNews(page = 1, perPage = 9) {
  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.news.count({ where: { published: true } }),
  ]);

  if (total === 0) {
    const fallbackItems = FALLBACK_NEWS.slice((page - 1) * perPage, page * perPage);
    const fallbackTotal = FALLBACK_NEWS.length;

    return {
      items: fallbackItems,
      total: fallbackTotal,
      totalPages: Math.ceil(fallbackTotal / perPage),
    };
  }

  return { items, total, totalPages: Math.ceil(total / perPage) };
}

export async function getNewsBySlug(slug: string) {
  const item = await prisma.news.findUnique({ where: { slug } });
  if (item) return item;
  return FALLBACK_NEWS.find((fallback) => fallback.slug === slug) ?? null;
}

export async function getAllNewsAdmin() {
  return prisma.news.findMany({ orderBy: { createdAt: "desc" } });
}
