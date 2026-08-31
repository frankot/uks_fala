import Link from "next/link";

export const metadata = {
  title: "Pomoc — Panel admina — UKS Fala",
  description: "Instrukcja obsługi panelu administratora UKS Fala.",
};

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-12 scroll-mt-20">
      <h2 className="text-[1.3rem] font-bold text-sand-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function SubSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-6">
      <h3 className="text-[1.05rem] font-bold text-sand-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Note({ tone = "pool", children }: { tone?: "pool" | "coral" | "sand" | "amber"; children: React.ReactNode }) {
  const tones = {
    pool: "border-pool-200 bg-pool-50 text-pool-700",
    coral: "border-coral-200 bg-coral-50 text-coral-700",
    sand: "border-sand-200 bg-sand-50 text-sand-600",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <div className={`mt-3 rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <p className="text-[13px]">{children}</p>
    </div>
  );
}

/** Two-column field reference — every CMS form is documented in this shape. */
function Fields({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr className="border-b border-sand-200">
            <th className="text-left py-2 pr-4 font-bold text-sand-600">Pole</th>
            <th className="text-left py-2 font-bold text-sand-600">Opis</th>
          </tr>
        </thead>
        <tbody className="text-sand-700">
          {rows.map(([field, desc], i) => (
            <tr key={field} className={i < rows.length - 1 ? "border-b border-sand-100" : ""}>
              <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap align-top">{field}</td>
              <td className="py-2">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOC: Array<[string, string, string[]?]> = [
  ["#grafik", "1. Grafik — plan zajęć", [
    "#grafik-dodaj|Dodawanie grupy",
    "#grafik-terminy|Terminy treningów i tory",
    "#grafik-cennik|Cennik — cena za zajęcia",
    "#grafik-semestr|Liczba zajęć w semestrze",
    "#grafik-usuwanie|Usuwanie grupy",
  ]],
  ["#aktualnosci", "2. Aktualności"],
  ["#osiagniecia", "3. Osiągnięcia"],
  ["#trenerzy", "4. Trenerzy"],
  ["#obozy", "5. Obozy i Półkolonie"],
  ["#popup", "6. Pop-up"],
  ["#wylogowanie", "Wylogowanie"],
  ["#problemy", "Najczęstsze problemy"],
];

export default function PomocPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-[1.5rem] font-bold text-sand-900">
          Instrukcja obsługi panelu administratora
        </h1>
        <p className="mt-2 text-[14px] text-sand-500 leading-relaxed">
          Panel administratora pozwala zarządzać treściami na stronie internetowej klubu UKS Fala.
          W panelu CMS znajduje się siedem zakładek: <strong>Grafik</strong>, <strong>Aktualności</strong>,{" "}
          <strong>Osiągnięcia</strong>, <strong>Trenerzy</strong>, <strong>Obozy</strong>,{" "}
          <strong>Półkolonie</strong> i <strong>Pop-up</strong>.
        </p>
        <p className="mt-2 text-[14px] text-sand-500 leading-relaxed">
          Zmiany zapisane w panelu pojawiają się na stronie od razu — nie trzeba nic dodatkowo publikować
          ani prosić o wgranie zmian.
        </p>
      </div>

      {/* Spis treści */}
      <div className="mb-12 rounded-xl border border-sand-200 bg-white p-6">
        <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-3">Spis treści</p>
        <nav className="space-y-1.5">
          {TOC.map(([href, label, children]) => (
            <div key={href}>
              <a href={href} className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">
                {label}
              </a>
              {children?.map((child) => {
                const [childHref, childLabel] = child.split("|");
                return (
                  <a
                    key={childHref}
                    href={childHref}
                    className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium pl-4"
                  >
                    {childLabel}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* 1. Grafik */}
      <Section id="grafik" title="1. Grafik — plan zajęć">
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-5 py-4 mb-6">
          <p className="text-[14px] text-coral-700 font-semibold">
            ⚡ To najważniejsza sekcja CMS. Tutaj definiujesz grupy treningowe, ich godziny i cennik.
            Dane trafiają na podstronę /grafik oraz do sekcji z grupami na stronie głównej.
          </p>
        </div>

        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          W zakładce <strong>Grafik</strong> widzisz listę wszystkich grup. Każdy wiersz pokazuje numer grupy
          w kolorowym kółku, nazwę, przedział wiekowy, dni tygodnia z liczbą terminów oraz cennik.
          Przy każdej grupie masz dwie akcje: ✏️ edycja i 🗑️ usunięcie.
        </p>

        <Note tone="amber">
          ⚠️ <strong>Jeśli nie ma żadnej grupy</strong>, podstrona /grafik pokazuje komunikat
          „Harmonogram w przygotowaniu” zamiast planu zajęć. Strona nigdy nie wyświetla przykładowych,
          wymyślonych grup — pokazuje wyłącznie to, co sam(a) wprowadzisz.
        </Note>

        <SubSection title="Dodawanie grupy" id="grafik-dodaj">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij przycisk <strong>Dodaj grupę</strong></li>
            <li>Wypełnij pola formularza:</li>
          </ol>
          <Fields
            rows={[
              ["Nazwa grupy *", "np. „Krewetki”. Ta nazwa pojawia się też w formularzu rezerwacji na stronie."],
              ["Numer *", "Krótki numer, np. „01” — duża cyfra w tle kafelka grupy."],
              ["Przedział wiekowy *", "np. „3–5 lat”."],
              ["Czas trwania zajęć", "Lista wyboru — długość jednych zajęć w minutach. Decyduje o tym, ile miejsca grupa zajmuje w planie."],
              ["Poziom", "Etykieta grupy, np. „Oswajanie z wodą”. Puste = bez etykiety."],
              ["Krótki opis grupy", "Kilka zdań o tym, czego uczy się grupa. Widoczne przy opisie grupy w planie zajęć."],
              ["Kolejność sortowania", "Liczba. Niższa wartość = grupa wyżej na liście."],
              ["Kolor grupy", "Kliknij jeden z kolorowych przycisków. Kolor jest używany w planie zajęć i na kafelkach."],
            ]}
          />
        </SubSection>

        <SubSection title="Terminy treningów i tory" id="grafik-terminy">
          <p className="text-[14px] text-sand-700 leading-relaxed mb-2">
            Poniżej pól podstawowych znajduje się sekcja <strong>Terminy treningów</strong>.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Wiersze to godziny (od 15:30 do 19:30), kolumny to dni tygodnia: <strong>Pon</strong>, <strong>Wt</strong>, <strong>Śr</strong>, <strong>Czw</strong>, <strong>Pt</strong>, <strong>Niedz</strong> (bez soboty)</li>
            <li>Basen ma <strong>dwa tory</strong> — <strong>Tor 1</strong> i <strong>Tor 2</strong>. Ta sama godzina może być zajęta przez dwie różne grupy, po jednej na każdym torze</li>
            <li>Kliknij komórkę, aby dodać termin. Kliknij ponownie, aby go usunąć</li>
            <li>Pod tabelką widoczny jest licznik zaznaczonych terminów</li>
          </ol>
          <Note>
            💡 <strong>Wskazówka:</strong> Jeśli grupa trenuje dwa razy w tygodniu (np. wtorek 16:00 i czwartek 17:00),
            zaznacz dwie komórki — jeden termin na każdy trening.
          </Note>
          <Note tone="sand">
            📝 Komórka zablokowana i podpisana nazwą innej grupy oznacza, że ten tor jest w tej godzinie zajęty.
            Wybierz inną godzinę, inny dzień albo drugi tor. System pilnuje tego również przy zapisie —
            nie da się zapisać grafiku z nakładającymi się zajęciami.
          </Note>
        </SubSection>

        <SubSection title="Cennik — cena za zajęcia" id="grafik-cennik">
          <div className="rounded-xl border border-coral-200 bg-coral-50 px-4 py-3 mb-3">
            <p className="text-[13px] text-coral-700">
              ⚠️ <strong>Uwaga — to cena za JEDNE zajęcia, nie za miesiąc.</strong> Pole nazywa się
              <strong> Cennik (zł / zajęcia)</strong>. Strona sama mnoży tę kwotę przez liczbę zajęć w semestrze
              i pokazuje rodzicowi sumę za cały semestr.
            </p>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Po wybraniu terminów pojawią się pola <strong>1× / tydzień</strong>, <strong>2× / tydzień</strong> itd. — tyle, ile grupa ma unikalnych dni treningowych</li>
            <li>Przy każdej częstotliwości wpisz cenę <strong>za jedne zajęcia</strong> przy takim wymiarze</li>
            <li>Jeśli dana częstotliwość nie jest dostępna — zostaw pole puste</li>
          </ol>
          <Note tone="sand">
            📝 <strong>Przykład:</strong> Chcesz, żeby semestr przy 2 treningach w tygodniu kosztował 1200 zł,
            a w semestrze wypada 30 takich zajęć. Wpisujesz <strong>40</strong> (bo 40 zł × 30 zajęć = 1200 zł)
            w polu <strong>2× / tydzień</strong> — <em>nie</em> 1200 i <em>nie</em> cenę miesięczną.
          </Note>
        </SubSection>

        <SubSection title="Liczba zajęć w semestrze" id="grafik-semestr">
          <p className="text-[14px] text-sand-700 leading-relaxed mb-2">
            W zakładce Grafik jest osobny przycisk otwierający okno <strong>Liczba zajęć w semestrze</strong>.
            To ustawienie wspólne dla całego klubu — nie ustawia się go per grupa.
          </p>
          <Fields
            rows={[
              ["Nazwa semestru", "Etykieta pokazywana przy cenie, np. „2026/2027”."],
              ["Pon … Niedz", "Ile razy w tym semestrze wypadają zajęcia w dany dzień tygodnia."],
            ]}
          />
          <Note tone="amber">
            ⚠️ <strong>Bez tego ustawienia strona nie pokaże ceny za semestr</strong> — rodzic zobaczy tylko
            cenę za pojedyncze zajęcia. Jeśli w jakimś dniu wpiszesz 0, a rodzic wybierze ten dzień,
            kwota za semestr się nie policzy.
          </Note>
          <Note tone="sand">
            📝 Pamiętaj o aktualizacji tych liczb na początku każdego semestru — inaczej ceny na stronie
            będą liczone według poprzedniego semestru.
          </Note>
        </SubSection>

        <SubSection title="Usuwanie grupy" id="grafik-usuwanie">
          <ul className="list-disc list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij ikonę kosza 🗑️ przy grupie</li>
            <li>Potwierdź w oknie, klikając <strong>Usuń grupę</strong></li>
          </ul>
          <Note tone="coral">
            ⚠️ <strong>Tej operacji nie można cofnąć.</strong> Wraz z grupą znikają wszystkie jej terminy i cennik.
            Jeśli chcesz tylko tymczasowo zawiesić grupę, lepiej usuń jej terminy i zostaw samą grupę.
          </Note>
        </SubSection>
      </Section>

      {/* 2. Aktualności */}
      <Section id="aktualnosci" title="2. Aktualności">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Wpisy widoczne w sekcji „Co nowego w naszym klubie” na stronie głównej oraz na podstronie /aktualnosci.
          Każdy wpis ma własny adres z tytułem w linku.
        </p>
        <Note>
          💡 <strong>Ile się wyświetla:</strong> sekcja na stronie głównej łączy różne treści — pokazuje
          <strong> 2 najnowsze aktualności</strong> plus najbliższy obóz i najbliższe półkolonie (łącznie maks. 4 kafelki).
          Pełna lista aktualności jest na podstronie /aktualnosci, po 9 wpisów na stronę.
        </Note>

        <SubSection title="Dodawanie wpisu">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij <strong>Dodaj aktualność</strong></li>
            <li>Wypełnij pola:</li>
          </ol>
          <Fields
            rows={[
              ["Tytuł *", "Nagłówek wpisu. Z tytułu tworzony jest adres strony."],
              ["Opis krótki *", "2–3 zdania widoczne na kafelku."],
              ["Treść *", "Pełna treść wpisu — widoczna po kliknięciu w kafelek."],
              ["Zdjęcia", "Kliknij „+” i wybierz plik z komputera lub telefonu. Zdjęcia są automatycznie zmniejszane przed wysłaniem, więc nie musisz ich wcześniej obrabiać. Możesz dodać kilka. Najedź na miniaturkę i kliknij ✕, aby usunąć."],
              ["Data publikacji", "Data i godzina przy wpisie. Decyduje o kolejności — najnowsze są na górze."],
              ["Opublikowany", "Zaznacz ✓, aby wpis był widoczny. Odznacz, aby zapisać jako szkic."],
            ]}
          />
          <p className="mt-3 text-[14px] text-sand-700">3. Kliknij <strong>Dodaj</strong></p>
        </SubSection>

        <SubSection title="Edycja i usuwanie">
          <ul className="list-disc list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>✏️ otwiera formularz <strong>Edytuj aktualność</strong></li>
            <li>🗑️ usuwa wpis — wymaga potwierdzenia</li>
            <li>Na liście widzisz status: zielony <strong>Opublikowany</strong> lub szary <strong>Szkic</strong></li>
          </ul>
          <Note tone="sand">
            📝 Adres wpisu nie zmienia się przy edycji tytułu — linki wysłane wcześniej rodzicom
            albo wklejone na Facebooka nadal działają.
          </Note>
        </SubSection>
      </Section>

      {/* 3. Osiągnięcia */}
      <Section id="osiagniecia" title="3. Osiągnięcia">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Działa identycznie jak Aktualności i ma te same pola (<strong>Tytuł</strong>, <strong>Opis krótki</strong>,{" "}
          <strong>Treść</strong>, <strong>Zdjęcia</strong>, <strong>Data publikacji</strong>, <strong>Opublikowany</strong>).
        </p>
        <Note>
          💡 <strong>Ile się wyświetla:</strong> na stronie głównej <strong>3 najnowsze</strong> opublikowane osiągnięcia.
          Pełna lista jest na podstronie /osiagniecia, po 9 na stronę.
        </Note>
        <Note tone="sand">
          📌 <strong>Różnica względem Aktualności:</strong> osiągnięcia pokazywane są w ciemnej sekcji
          „Nasze sukcesy i medale”, ze stylizowaną ikoną pucharu.
        </Note>
        <p className="mt-4 text-[14px] text-sand-700">
          Przyciski: <strong>Dodaj osiągnięcie</strong>, <strong>Edytuj osiągnięcie</strong>, <strong>Usuń osiągnięcie</strong>.
        </p>
      </Section>

      {/* 4. Trenerzy */}
      <Section id="trenerzy" title="4. Trenerzy">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Kadra trenerska pokazywana na stronie głównej i na podstronie /trenerzy. Każdy trener ma też
          własną podstronę z pełnym opisem.
        </p>

        <SubSection title="Dodawanie trenera">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij <strong>Dodaj trenera</strong></li>
            <li>Wypełnij pola:</li>
          </ol>
          <Fields
            rows={[
              ["Imię i nazwisko *", "Pełne imię i nazwisko. Z niego tworzony jest adres podstrony trenera."],
              ["Rola / stanowisko *", "Funkcja, np. „Trener główny / Prezes klubu”."],
              ["Opis *", "Doświadczenie i specjalizacja trenera."],
              ["Zdjęcia", "Kliknij „+”, aby dodać zdjęcie. Bez zdjęcia wyświetlą się inicjały."],
              ["Kolejność", "Liczba. Niższa wartość = trener wyżej na liście."],
              ["Opublikowany", "Zaznacz ✓, aby trener był widoczny na stronie."],
            ]}
          />
          <p className="mt-3 text-[14px] text-sand-700">3. Kliknij <strong>Dodaj</strong></p>
        </SubSection>

        <Note tone="amber">
          ⚠️ <strong>Kto trafia na stronę główną:</strong> pokazywanych jest <strong>4 pierwszych</strong>{" "}
          opublikowanych trenerów, czyli czterech z najniższymi wartościami pola <strong>Kolejność</strong>.
          Pełna lista jest na /trenerzy. Aby zmienić, kto jest na stronie głównej, zmień wartości
          w polu Kolejność — np. 0 dla najważniejszego, 1 dla kolejnego itd.
        </Note>
      </Section>

      {/* 5. Obozy i Półkolonie */}
      <Section id="obozy" title="5. Obozy i Półkolonie">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          To dwie osobne zakładki, ale działają dokładnie tak samo i mają te same pola.
          <strong> Obozy</strong> trafiają na podstronę /obozy, <strong>Półkolonie</strong> na /polkolonie.
          Najbliższa oferta z każdej z nich pokazuje się też na stronie głównej, w sekcji z aktualnościami.
        </p>

        <SubSection title="Dodawanie oferty">
          <Fields
            rows={[
              ["Tytuł *", "np. „Letni obóz pływacki”. Z tytułu tworzony jest adres podstrony."],
              ["Krótki opis *", "Kilka zdań na kafelek i do zajawki."],
              ["Miejsce *", "Nazwa ośrodka lub obiektu, np. „OSiR Nieporęt”."],
              ["Adres", "Ulica i numer — pokazywane przy opisie miejsca."],
              ["Data od / Data do", "Termin turnusu. Steruje kolejnością — najbliższe terminy są pierwsze."],
              ["Wiek", "np. „7–13 lat”."],
              ["Cena", "Wpisywana jako tekst, razem z walutą, np. „1490 zł”."],
              ["Dopisek do ceny", "Doprecyzowanie, np. „Cena obejmuje wyżywienie i opiekę trenerską”."],
              ["Program", "Plan dnia lub przebieg turnusu."],
              ["Zakwaterowanie / Wyżywienie / Transport", "Opisowe sekcje na podstronie oferty. Zostaw puste, jeśli nie dotyczy — pusta sekcja się nie pokaże."],
              ["Zapisy", "Informacje o tym, jak się zapisać."],
              ["Link przycisku „Zarezerwuj miejsce”", "Adres formularza zapisów. Zostaw pusty, jeśli przycisk ma nie być widoczny."],
              ["Zdjęcia", "Pierwsze zdjęcie jest używane jako główne, na górze podstrony."],
              ["Kolejność", "Liczba. Niższa wartość = oferta wyżej na liście."],
              ["Opublikowany", "Zaznacz ✓, aby oferta była widoczna."],
            ]}
          />
        </SubSection>

        <Note tone="amber">
          ⚠️ <strong>Zmiana tytułu zmienia adres podstrony.</strong> Jeśli oferta była już udostępniana
          — na Facebooku albo w wiadomości do rodziców — stary link przestanie działać.
          Staraj się ustalić tytuł przed opublikowaniem oferty.
        </Note>
        <Note tone="sand">
          📝 W polu <strong>Link przycisku</strong> wklej pełny adres, razem z <strong>https://</strong>.
          Sam adres bez tego przedrostka może nie zadziałać.
        </Note>
      </Section>

      {/* 6. Pop-up */}
      <Section id="popup" title="6. Pop-up">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Okienko z ogłoszeniem, które wyskakuje odwiedzającemu na stronie głównej — np. informacja
          o starcie zapisów albo o zmianie godzin zajęć. W tej zakładce jest jeden formularz,
          bez listy wpisów: ustawiasz treść i włączasz albo wyłączasz okienko.
        </p>
        <Fields
          rows={[
            ["Aktywny", "Główny przełącznik. Odznacz, aby wyłączyć pop-up bez kasowania treści — tekst zostanie zapisany na później."],
            ["Tytuł", "Nagłówek okienka."],
            ["Treść", "Tekst ogłoszenia."],
            ["Opóźnienie", "Po ilu sekundach od wejścia na stronę okienko ma się pokazać."],
          ]}
        />
        <p className="mt-4 text-[14px] text-sand-700">
          Po wypełnieniu kliknij <strong>Zapisz</strong>. Pojawi się potwierdzenie zapisu.
        </p>
        <Note tone="sand">
          📝 Odwiedzający może zamknąć okienko krzyżykiem. Trzymaj treść krótką — jedno ogłoszenie naraz
          działa lepiej niż kilka informacji w jednym okienku.
        </Note>
      </Section>

      {/* Wylogowanie */}
      <Section id="wylogowanie" title="Wylogowanie">
        <p className="text-[14px] text-sand-700 leading-relaxed">
          Kliknij przycisk <strong>Wyloguj</strong> w prawym górnym rogu ekranu, aby bezpiecznie zakończyć pracę.
          Zawsze wylogowuj się po zakończeniu, zwłaszcza na współdzielonym komputerze.
        </p>
      </Section>

      {/* Problemy */}
      <Section id="problemy" title="Najczęstsze problemy">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-sand-200">
                <th className="text-left py-2 pr-6 font-bold text-sand-600">Problem</th>
                <th className="text-left py-2 font-bold text-sand-600">Rozwiązanie</th>
              </tr>
            </thead>
            <tbody className="text-sand-700">
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Nie widzę zmian na stronie</td>
                <td className="py-2.5">Odśwież stronę klawiszem F5. Jeśli nie pomaga — Ctrl+Shift+R.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Zdjęcie nie chce się dodać</td>
                <td className="py-2.5">Zdjęcia są zmniejszane automatycznie, więc rozmiar rzadko bywa problemem. Sprawdź, czy to na pewno plik graficzny (JPG, PNG, WebP) — dokumenty i pliki PDF nie zostaną przyjęte.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Wpis / trener / grupa nie wyświetla się na stronie</td>
                <td className="py-2.5">Sprawdź, czy pole <strong>Opublikowany</strong> jest zaznaczone, a potem odśwież stronę.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Nie mogę uzupełnić cennika — pola się nie pokazują</td>
                <td className="py-2.5">Cennik pojawia się dopiero po zaznaczeniu przynajmniej jednego terminu treningu. Najpierw wybierz terminy.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Komórka w terminarzu jest zablokowana</td>
                <td className="py-2.5">Ten tor jest już zajęty w tej godzinie przez inną grupę. Wybierz inną godzinę, inny dzień albo drugi tor.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Cena za semestr nie wyświetla się na stronie</td>
                <td className="py-2.5">Uzupełnij <strong>Liczbę zajęć w semestrze</strong> w zakładce Grafik. Bez niej strona pokazuje tylko cenę za pojedyncze zajęcia.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Cena na stronie jest kilkukrotnie za wysoka</td>
                <td className="py-2.5">W cenniku wpisano cenę miesięczną lub semestralną zamiast <strong>ceny za jedne zajęcia</strong>. Popraw wartość w cenniku grupy.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Strona /grafik pokazuje „Harmonogram w przygotowaniu”</td>
                <td className="py-2.5">Nie ma jeszcze żadnej grupy w zakładce Grafik. Dodaj pierwszą grupę i jej terminy.</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 font-medium">Nie mogę zapisać grafiku — komunikat o nakładających się zajęciach</td>
                <td className="py-2.5">Dwie grupy mają ten sam tor o tej samej godzinie. Komunikat podaje dzień, godzinę i tor — popraw jeden z terminów.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-16 mb-8 border-t border-sand-200 pt-8 text-center">
        <Link
          href="/admin/cms"
          className="inline-flex items-center gap-2 rounded-xl bg-deep-700 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-deep-800"
        >
          ← Wróć do panelu CMS
        </Link>
      </div>
    </div>
  );
}
