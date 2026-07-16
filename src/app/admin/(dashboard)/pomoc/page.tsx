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

export default function PomocPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="text-[1.5rem] font-bold text-sand-900">
          Instrukcja obsługi panelu administratora
        </h1>
        <p className="mt-2 text-[14px] text-sand-500 leading-relaxed">
          Panel administratora pozwala zarządzać treściami na stronie internetowej klubu UKS Fala.
          W menu bocznym po lewej stronie znajdują się cztery zakładki CMS.
        </p>
      </div>

      {/* Spis treści */}
      <div className="mb-12 rounded-xl border border-sand-200 bg-white p-6">
        <p className="text-[12px] font-bold uppercase tracking-wider text-sand-500 mb-3">Spis treści</p>
        <nav className="space-y-1.5">
          <a href="#grafik" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">1. Grafik — Terminarz zajęć</a>
          <a href="#grafik-dodaj" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium pl-4">Dodawanie grupy</a>
          <a href="#grafik-terminy" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium pl-4">Ustawianie terminów treningów</a>
          <a href="#grafik-cennik" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium pl-4">Ustawianie cennika</a>
          <a href="#grafik-usuwanie" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium pl-4">Usuwanie grupy</a>
          <a href="#aktualnosci" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">2. Aktualności</a>
          <a href="#osiagniecia" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">3. Osiągnięcia</a>
          <a href="#trenerzy" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">4. Trenerzy</a>
          <a href="#wylogowanie" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">Wylogowanie</a>
          <a href="#problemy" className="block text-[14px] text-deep-600 hover:text-deep-800 font-medium">Najczęstsze problemy</a>
        </nav>
      </div>

      {/* 1. Grafik */}
      <Section id="grafik" title="1. Grafik — Terminarz zajęć">
        <div className="rounded-xl border border-coral-200 bg-coral-50 px-5 py-4 mb-6">
          <p className="text-[14px] text-coral-700 font-semibold">
            ⚡ To najważniejsza sekcja CMS. Tutaj definiujesz grupy treningowe, ich godziny i cennik.
            Dane są wyświetlane na podstronie /zajecia oraz w harmonogramie na stronie głównej.
          </p>
        </div>

        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          W zakładce <strong>Grafik</strong> widzisz listę wszystkich grup. Każdy wiersz pokazuje: numer grupy w kolorowym kółku, nazwę grupy, przedział wiekowy, dni tygodnia z ilością terminów oraz cennik.
          Masz dwie akcje: ikona ✏️ do edycji grupy i ikona 🗑️ do usunięcia.
        </p>

        <SubSection title="Dodawanie grupy" id="grafik-dodaj">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij przycisk <strong>Dodaj grupę</strong> (niebieski przycisk po prawej)</li>
            <li>W oknie formularza wypełnij pola:</li>
          </ol>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="text-left py-2 pr-4 font-bold text-sand-600">Pole w formularzu</th>
                  <th className="text-left py-2 font-bold text-sand-600">Co wpisać</th>
                </tr>
              </thead>
              <tbody className="text-sand-700">
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Nazwa grupy *</td>
                  <td className="py-2">np. „Krewetki” lub „Grupa początkująca”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Numer *</td>
                  <td className="py-2">Krótki numer, np. „01” — wyświetla się w kolorowym kółku przy grupie</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Przedział wiekowy *</td>
                  <td className="py-2">np. „3–5 lat” lub „12–14 lat”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Kolejność sortowania</td>
                  <td className="py-2">Liczba. Niższa wartość = grupa wyżej na liście na stronie</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Kolor grupy</td>
                  <td className="py-2">Wybierz klikając jeden z kolorowych przycisków (Błękitny, Granatowy, Koralowy itd.)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SubSection>

        <SubSection title="Ustawianie terminów treningów" id="grafik-terminy">
          <p className="text-[14px] text-sand-700 leading-relaxed mb-2">
            W tej samej formatce, poniżej pól podstawowych, znajduje się sekcja <strong>Terminy treningów</strong>.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Widzisz tabelkę: wiersze to godziny (od 15:30 do 19:30), kolumny to dni tygodnia (<strong>Pon</strong>, <strong>Wt</strong>, <strong>Śr</strong>, <strong>Czw</strong>, <strong>Pt</strong>, <strong>Niedz</strong>)</li>
            <li>Kliknij komórkę, aby dodać termin — komórka zmieni kolor na koralowy</li>
            <li>Kliknij ponownie, aby usunąć termin — komórka wróci do jasnego koloru</li>
            <li>Pod tabelką widoczny jest licznik: <strong>„Zaznaczono: X”</strong></li>
          </ol>
          <div className="mt-3 rounded-xl border border-pool-200 bg-pool-50 px-4 py-3">
            <p className="text-[13px] text-pool-700">
              💡 <strong>Wskazówka:</strong> Jeśli grupa trenuje dwa razy w tygodniu (np. we wtorek o 16:00 i czwartek o 17:00),
              zaznacz dwie komórki. Dla każdego treningu dodajesz osobny termin.
            </p>
          </div>
          <p className="mt-2 text-[13px] text-sand-500">
            Jeśli jakaś komórka jest zajęta przez inną grupę, zobaczysz w niej skróconą nazwę tej grupy i nie będziesz mógł jej kliknąć.
          </p>
        </SubSection>

        <SubSection title="Ustawianie cennika" id="grafik-cennik">
          <p className="text-[14px] text-sand-700 leading-relaxed mb-2">
            Poniżej terminów znajduje się sekcja <strong>Cennik (zł / miesiąc)</strong>.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Po wybraniu terminów automatycznie pojawią się pola: <strong>1× / tydzień</strong>, <strong>2× / tydzień</strong> itd. — tyle, ile masz unikalnych dni treningowych</li>
            <li>Obok każdej częstotliwości wpisz cenę w złotych (samo pole liczbowe, dopisek „zł” jest obok)</li>
            <li>Jeśli dana częstotliwość nie jest dostępna — zostaw pole puste</li>
          </ol>
          <div className="mt-3 rounded-xl border border-sand-200 bg-sand-50 px-4 py-3">
            <p className="text-[13px] text-sand-600">
              📝 <strong>Przykład:</strong> Jeśli grupa kosztuje 120 zł miesięcznie przy 2 treningach tygodniowo,
              wpisz liczbę <strong>120</strong> w polu <strong>2× / tydzień</strong>. Pole <strong>1× / tydzień</strong> możesz zostawić puste albo też podać inną cenę.
            </p>
          </div>
        </SubSection>

        <SubSection title="Usuwanie grupy" id="grafik-usuwanie">
          <ul className="list-disc list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij ikonę kosza 🗑️ przy grupie na liście</li>
            <li>Pojawi się okno potwierdzenia z pytaniem „Czy na pewno chcesz usunąć grupę…?”</li>
            <li>Kliknij <strong>Usuń grupę</strong>, aby potwierdzić</li>
          </ul>
          <div className="mt-3 rounded-xl border border-coral-200 bg-coral-50 px-4 py-3">
            <p className="text-[13px] text-coral-700">
              ⚠️ <strong>Tej operacji nie można cofnąć.</strong> Wraz z grupą usunięte zostaną wszystkie jej terminy i cennik.
            </p>
          </div>
        </SubSection>
      </Section>

      {/* 2. Aktualności */}
      <Section id="aktualnosci" title="2. Aktualności">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Tutaj zarządzasz wpisami widocznymi na stronie głównej (sekcja „Co nowego w naszym klubie”) i podstronie /aktualnosci.
          Każdy wpis ma własny adres z tytułem w linku.
        </p>
        <div className="rounded-xl border border-pool-200 bg-pool-50 px-4 py-3 mb-4">
          <p className="text-[13px] text-pool-700">
            💡 <strong>Ważne:</strong> Na stronie głównej automatycznie wyświetla się <strong>4 najnowsze</strong> opublikowane aktualności.
            Na podstronie /aktualnosci znajduje się pełna lista wszystkich wpisów (z paginacją — 9 na stronę).
          </p>
        </div>

        <SubSection title="Dodawanie wpisu">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij <strong>Dodaj aktualność</strong></li>
            <li>Wypełnij pola:</li>
          </ol>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="text-left py-2 pr-4 font-bold text-sand-600">Pole</th>
                  <th className="text-left py-2 font-bold text-sand-600">Opis</th>
                </tr>
              </thead>
              <tbody className="text-sand-700">
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Tytuł *</td>
                  <td className="py-2">Nagłówek wpisu, np. „Rusza sezon 2026: zapisy do grup treningowych”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Opis krótki *</td>
                  <td className="py-2">Krótki tekst wyświetlany na kafelku na stronie głównej (maks. 2–3 zdania)</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Treść *</td>
                  <td className="py-2">Pełna treść wpisu — to co użytkownik zobaczy po kliknięciu „Czytaj dalej”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Zdjęcia</td>
                  <td className="py-2">Kliknij pole z „+”, wybierz zdjęcie z komputera. Możesz dodać kilka. Kliknij w miniaturkę, aby usunąć.</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Data publikacji</td>
                  <td className="py-2">Data i godzina wyświetlana przy wpisie. Domyślnie ustawiona na bieżący moment.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Opublikowany</td>
                  <td className="py-2">Zaznacz ✓ aby wpis był widoczny na stronie. Odznacz aby ukryć (szkic).</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] text-sand-700">3. Kliknij <strong>Dodaj</strong></p>
        </SubSection>

        <SubSection title="Edycja i usuwanie">
          <ul className="list-disc list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij ikonę ✏️ przy wpisie, aby go edytować — otworzy się formularz <strong>Edytuj aktualność</strong></li>
            <li>Kliknij ikonę 🗑️, aby usunąć — wymaga potwierdzenia w oknie <strong>Usuń aktualność</strong></li>
            <li>Na liście widzisz status: zielony „Opublikowany” lub szary „Szkic”</li>
          </ul>
        </SubSection>
      </Section>

      {/* 3. Osiągnięcia */}
      <Section id="osiagniecia" title="3. Osiągnięcia">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Działa identycznie jak Aktualności, z tymi samymi polami (<strong>Tytuł</strong>, <strong>Opis krótki</strong>, <strong>Treść</strong>, <strong>Zdjęcia</strong>, <strong>Data publikacji</strong>, <strong>Opublikowany</strong>).
        </p>
        <div className="rounded-xl border border-pool-200 bg-pool-50 px-4 py-3 mb-4">
          <p className="text-[13px] text-pool-700">
            💡 <strong>Ważne:</strong> Na stronie głównej automatycznie wyświetlają się <strong>3 najnowsze</strong> opublikowane osiągnięcia.
            Na podstronie /osiagniecia znajduje się pełna lista wszystkich wpisów (z paginacją — 9 na stronę).
          </p>
        </div>
        <div className="rounded-xl border border-sand-200 bg-sand-50 px-4 py-3">
          <p className="text-[13px] text-sand-600">
            📌 <strong>Różnica:</strong> Osiągnięcia są wyświetlane na stronie głównej w ciemnej (granatowej) sekcji „Nasze sukcesy i medale”,
            ze stylizowaną ikoną pucharu zamiast zdjęcia w tle kafelka.
          </p>
        </div>
        <p className="mt-4 text-[14px] text-sand-700">
          Przyciski: <strong>Dodaj osiągnięcie</strong>, <strong>Edytuj osiągnięcie</strong>, <strong>Usuń osiągnięcie</strong>.
        </p>
      </Section>

      {/* 4. Trenerzy */}
      <Section id="trenerzy" title="4. Trenerzy">
        <p className="text-[14px] text-sand-700 leading-relaxed mb-4">
          Zarządzanie kadrą trenerską wyświetlaną na stronie głównej (pierwsze 3 osoby) i podstronie /trenerzy (wszyscy).
        </p>

        <SubSection title="Dodawanie trenera">
          <ol className="list-decimal list-inside space-y-2 text-[14px] text-sand-700 leading-relaxed">
            <li>Kliknij <strong>Dodaj trenera</strong></li>
            <li>Wypełnij pola:</li>
          </ol>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="border-b border-sand-200">
                  <th className="text-left py-2 pr-4 font-bold text-sand-600">Pole</th>
                  <th className="text-left py-2 font-bold text-sand-600">Opis</th>
                </tr>
              </thead>
              <tbody className="text-sand-700">
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Imię i nazwisko *</td>
                  <td className="py-2">Pełne imię i nazwisko trenera, np. „Bartosz Krawczak”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Rola / stanowisko *</td>
                  <td className="py-2">Funkcja, np. „Trener główny / Prezes klubu”</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Opis *</td>
                  <td className="py-2">Krótki opis doświadczenia i specjalizacji trenera</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Zdjęcia</td>
                  <td className="py-2">Kliknij „+”, aby dodać zdjęcie trenera. Jeśli nie dodasz — wyświetlą się inicjały (pierwsze litery imienia i nazwiska).</td>
                </tr>
                <tr className="border-b border-sand-100">
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Kolejność</td>
                  <td className="py-2">Liczba. Niższa wartość = trener wyżej na liście. Podpowiedź: „Niższa liczba = wyższa pozycja”</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono font-medium whitespace-nowrap">Opublikowany</td>
                  <td className="py-2">Zaznacz ✓ aby trener był widoczny na stronie</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[14px] text-sand-700">3. Kliknij <strong>Dodaj</strong></p>
        </SubSection>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[13px] text-amber-700">
            ⚠️ <strong>Ważne:</strong> O kolejności wyświetlania decyduje pole <strong>Kolejność</strong>.
            Niższa liczba = wyższa pozycja. Na stronie głównej pokazuje się tylko <strong>3 pierwszych</strong> opublikowanych trenerów
            (czyli trzech z najniższymi wartościami Kolejności).
            Na podstronie /trenerzy znajduje się pełna lista. Aby zmienić, kto jest widoczny na stronie głównej,
            zmień wartości w polu <strong>Kolejność</strong> — np. ustaw 0 dla najważniejszego trenera, 1 dla drugiego itd.
          </p>
        </div>
      </Section>

      {/* Wylogowanie */}
      <Section id="wylogowanie" title="Wylogowanie">
        <p className="text-[14px] text-sand-700 leading-relaxed">
          Kliknij przycisk <strong>Wyloguj</strong> w prawym górnym rogu ekranu, aby bezpiecznie zakończyć pracę.
          Zawsze wylogowuj się po zakończeniu pracy, zwłaszcza na współdzielonym komputerze.
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
                <td className="py-2.5">Odśwież stronę klawiszem F5. Jeśli nie pomaga, wyczyść pamięć przeglądarki (Ctrl+Shift+R).</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Zdjęcie nie chce się dodać</td>
                <td className="py-2.5">Sprawdź rozmiar pliku (maks. ~5 MB). Dozwolone formaty: JPG, PNG, WebP.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Wpis / trener / grupa nie wyświetla się na stronie</td>
                <td className="py-2.5">Sprawdź, czy pole <strong>Opublikowany</strong> jest zaznaczone. Odśwież stronę F5.</td>
              </tr>
              <tr className="border-b border-sand-100">
                <td className="py-2.5 pr-6 font-medium">Nie mogę dodać cennika — pola się nie pokazują</td>
                <td className="py-2.5">Sekcja Cennik wyświetla się dopiero po zaznaczeniu przynajmniej jednego terminu treningu. Najpierw wybierz terminy.</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-6 font-medium">Komórka w terminarzu jest zablokowana</td>
                <td className="py-2.5">Oznacza to, że ten termin jest już zajęty przez inną grupę. Wybierz inną godzinę lub dzień.</td>
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
