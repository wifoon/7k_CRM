# 7K LED WMS – Opis Funkcjonalny i Biznesowy Aplikacji

> **Dla kogo jest ten dokument?**  
> Ten dokument jest przeznaczony dla sztucznej inteligencji (oraz osób rozwijających projekt), aby natychmiast zrozumieć **co ta aplikacja robi, jak działa w praktyce, jakie problemy rozwiązuje i jaki jest jej ostateczny cel**, bez zagłębiania się w strukturę pojedynczych plików kodu.

---

## 1. Główny Cel i Misja Projektu

Aplikacja **7K** to system zarządzania magazynem i realizacjami (WMS / ERP) stworzony specjalnie dla **branży techniki estradowej, multimediów i wypożyczalni sprzętu eventowego (AV Rental)**.

W firmach obsługujących eventy (koncerty, targi, konferencje, gale) największym wyzwaniem jest:
1. **Szybkie i bezbłędne planowanie ekranów diodowych LED** – ekrany składa się z małych modułów (kabinetów), pakowanych po kilka sztuk do dużych skrzyń transportowych (flight case). Człowiek łatwo może pomylić się przy ręcznym liczeniu, ile skrzyń potrzeba, szczególnie gdy łączy się moduły o różnych wysokościach.
2. **Kalkulacja konstrukcji nośnych (Rigging & Truss)** – ekran waży od kilkuset kilogramów do kilku ton i musi na czymś wisieć lub stać. Zbudowanie bramki z kratownicy aluminiowej wymaga dokładnego doboru modułowych odcinków kraty (2m, 1.5m, 1m, 0.5m), wciągarek i osprzętu zabezpieczającego.
3. **Rezerwacja sprzętu bez overbookingu** – magazyn ma ograniczoną liczbę skrzyń i krat. System musi pilnować na bieżąco, czy na dany termin nie obiecujemy klientowi sprzętu, który już wyjechał na inny event.
4. **Dokumenty załadunkowe dla magazynu** – generowanie czytelnych list załadunkowych (WZ / Packing List) w PDF i Excelu z podaną godziną gotowości na rampie i miejscem na notatki magazyniera.

---

## 2. Podstawowe Koncepcje i Logika Domenowa

Aby zrozumieć system, należy poznać kluczowe zasady rządzące tą branżą:

### A. Magazyn operuje na SKRZYNIACH (Case), a nie pojedynczych klockach
- Dioda LED nie leży na półkach luzem. Znajduje się w dedykowanych skrzyniach transportowych na kołach (flight case).
- Typowa skrzynia mieści zazwyczaj **8 modułów (kabinetów)**.
- Jeśli do zbudowania ekranu potrzeba np. 36 modułów, magazynier musi wydać **5 pełnych skrzyń** ($5 \times 8 = 40$ kabinetów, w tym 4 jako zapas serwisowy). System zawsze rezerwuje pełne skrzynie.

### B. Ekrany Hybrydowe (łączenie całych kabinetów i połówek)
- Standardowy kabinet diody LED ma wymiary **50 cm szerokości i 100 cm wysokości** (moduł pełny).
- Oznacza to, że wysokość ekranu ze standardowych kabinetów rośnie co 1 metr (1m, 2m, 3m, 4m itd.).
- W praktyce klienci bardzo często potrzebują ekranów o wysokościach pośrednich, np. **2.5 m, 3.5 m, 4.5 m** (np. pod format 16:9).
- W tym celu stosuje się **moduły połówkowe o wymiarach 50×50 cm**.
- **Zasada hybrydy w aplikacji**:
  - Dół (lub góra) ekranu to jeden rząd modułów 50×50 cm, a reszta to moduły 50×100 cm.
  - Moduły pełne i połówkowe mają **osobne skrzynie transportowe**.
  - Aplikacja automatycznie wylicza: ile potrzeba skrzyń modułów całych, a ile skrzyń modułów połówkowych.

### C. Belki Zawiesia (Hanging Bary)
- Aby powiesić ekran LED na kratownicy, u góry ekranu montuje się specjalne atestowane belki zawiesia (Hanging bary).
- Każda belka ma zazwyczaj 0.5 m lub 1.0 m szerokości.
- Zasada: na każdy 1 metr szerokości ekranu potrzebny jest 1 metr belek zawiesia (np. dla ekranu o szerokości 6 m potrzeba 6 sztuk belek 1-metrowych).

### D. Konstrukcje z Kratownicy (Bramki, Kreski, eLki)
Ekran musi być zainstalowany na konstrukcji. W aplikacji rozróżniamy trzy podstawowe typy:
1. **Bramka (Goalpost)** – wolnostojąca konstrukcja składająca się z belki poziomej opartej na dwóch pionowych słupach (wieżach) postawionych na ciężkich stalowych bazach/wózkach. Na szczycie słupów montuje się wyciągarki (ręczne lub elektryczne), na których podnosi się belkę z ekranem.
   - **Kluczowa zasada wysokości bramki**: Słupy bramki muszą być zawsze **o 1 metr wyższe niż wysokość ekranu**. Zapas ten jest technicznie niezbędny na tzw. „czapkę” (bloczek głowicy wciągarki na szczycie słupa), zawiesia stalowe oraz bufor pozwalający podnieść ekran na odpowiednią wysokość nad scenę.
2. **Kreska** – pojedyncza pozioma belka kratownicy podwieszana do sufitu hali/konstrukcji dachu za pomocą wciągarek lub zawiesi stalowych.
3. **eLki (Ground Support dolny)** – podpory montowane bezpośrednio do dołu ekranu, gdy ekran stoi na podłodze sceny (zamiast wisieć).

### E. Algorytm Doboru Odcinków Kratownicy
- W magazynie kratownice występują w modularnych długościach: **2.0 m, 1.5 m, 1.0 m oraz 0.5 m**.
- Gdy ekran ma np. 6 metrów szerokości, algorytm musi ułożyć belkę z jak najmniejszej liczby odcinków (zasada: im dłuższe odcinki, tym mniej pinów/łączeń, większa sztywność i szybszy montaż).
- Przykładowo dla 6 m belka składa się z: $3 \times 2.0\text{ m}$. Dla 4.5 m z: $2 \times 2.0\text{ m} + 1 \times 0.5\text{ m}$ lub $2.0\text{ m} + 1.5\text{ m} + 1.0\text{ m}$.

---

## 3. Co Oferują Poszczególne Moduły Aplikacji?

### 1. Pulpit Główny (Dashboard)
- Przejrzysty panel z kluczowymi wskaźnikami:
  - Ile realizacji jest aktualnie w toku.
  - Ile łącznie sprzętu znajduje się poza magazynem (w terenie).
  - Ostrzeżenia o sprzęcie, którego zostało mało ($\le 20\%$ stanu).
  - Informacja o sprzęcie uszkodzonym (w serwisie).
- Szybki rzut oka na najbliższy harmonogram wyjazdów.

### 2. Magazyn (Inventory)
- Pełna baza posiadanego sprzętu z podziałem na kategorie (Dioda, Konstrukcja, Okablowanie, Realizacja itp.).
- **Zarządzanie stanami**: stan całkowity, stan dostępny, stan w serwisie.
- **Wprowadzanie sprzętu diodowego**: podaje się gabaryty modułu, pojemność skrzyni oraz **wskazuje moduł powiązany (połówkę)**.
- **Obieg serwisowy**: uszkodzoną skrzynię lub element można jednym kliknięciem przenieść do serwisu – wówczas system automatycznie zdejmuje go ze stanu dostępnego, więc technicy nie zarezerwują go na żadne zlecenie. Po naprawie sprzęt wraca do stanu wolnego.
- Filtry, wyszukiwarka na żywo, sortowanie kolumn oraz zbiorcza zmiana kategorii.

### 3. Zarządzanie Realizacjami / Robotami (Jobs)
- Rejestr zleceń ze statusem: *W trakcie* (aktywne rezerwacje) lub *Zakończone* (sprzęt zwolniony z powrotem do magazynu).
- **Planowanie Realizacji / Zleceń**:
  - Rejestracja imprezy (nazwa, termin, lokalizacja).
  - Dodawanie jednego lub wielu ekranów LED oraz konstrukcji nośnych.
  - Szybkie dobieranie dodatkowego sprzętu (procesory obrazu, okablowanie zasilające i sygnałowe).
  - **Dynamiczne zliczanie zapotrzebowania i kontrola magazynu**:
    - System natychmiast wie, ile łącznie sprzętu z magazynu potrzeba na całą realizację.
    - Badanie dostępności w czasie rzeczywistym i ochrona przed overbookingiem (czerwone alerty przy próbie zarezerwowania ponad stan).
    - **Inteligentna edycja zlecenia**: Gdy edytujesz istniejące zlecenie, system wie, jaki sprzęt to zlecenie już miało zarezerwowany, i nie traktuje go jako "zajęty przez kogoś innego" – zapobiega to sztucznym błędom braku sprzętu podczas edycji.
  - *Uwaga projektowa dla UX:* Sam sposób prezentacji procesu planowania (czy to w formie wieloetapowego kreatora, kart, czy planera) ma zostać wypracowany wspólnie z AI w fazie analitycznej, tak aby uniknąć przeładowania informacjami i zapewnić maksymalną przejrzystość.

### 4. Konfigurator Ekranu LED (LedScreenModal)
- Najważniejsze narzędzie optymalizacyjne w aplikacji:
  1. Użytkownik wybiera model ekranu (zdefiniowany w ustawieniach lub z magazynu).
  2. Wpisuje pożądane wymiary (np. szerokość 5 m, wysokość 3 m) lub klika jeden z gotowych kafelków (np. 4×2.5m, 6×3.5m, 8×4.5m).
  3. System w ułamku sekundy:
     - Oblicza optymalną siatkę modułów (z dokładnością do centymetra).
     - Decyduje, czy potrzebne są połówki (system hybrydowy).
     - Oblicza liczbę potrzebnych skrzyń transportowych modułów pełnych i połówkowych.
     - Sprawdza, czy w magazynie jest tyle wolnych skrzyń.
     - Pyta o sposób podwieszenia/postawienia (Bramka / Kreska / eLki / powiązanie z istniejącą konstrukcją).
     - Jeśli wybrano bramkę, automatycznie dobiera odpowiednią wysokość słupów (wysokość ekranu + 1 metr).

### 5. Konfigurator Konstrukcji (ConstructionModal)
- Pozwala precyzyjnie przejrzeć i zmodyfikować zestawienie kratownicy pod dany ekran lub jako osobną konstrukcję:
  - Zestawienie odcinków belki poziomej.
  - Zestawienie odcinków słupów pionowych.
  - Wybór rodzaju wciągarek: łańcuchowe ręczne (np. 1T) lub elektryczne silnikowe.
  - Automatyczne dołożenie niezbędnych akcesoriów: wózków jezdnych, stóp, czapek na słupy, odciągów pasowych z napinaczami, zawiesi stalowych i wkrętarki akumulatorowej do skręcania pinów.

### 6. Generator List Załadunkowych (Packing List / WZ)
- Podgląd dokumentu magazynowego przed wyjazdem transportu na imprezę:
  - Grupowanie sprzętu według kategorii (Dioda, Konstrukcja, Okablowanie, Osprzęt).
  - Możliwość dostosowania nazwy pozycji pod wydruk oraz korekty ilości.
  - Dodawanie własnych uwag technicznych do poszczególnych pozycji.
  - Wybór godziny gotowości sprzętu na rampie (np. `14:00`).
  - Dodawanie pustych wierszy do ręcznego uzupełnienia długopisem przez magazyniera przy załadunku tira.
  - **Eksport do wektorowego PDF** (zoptymalizowany pod wydruk A4, polskie znaki).
  - **Eksport do arkusza Excel (.xlsx)** z zachowaniem formatowania, kolorów nagłówków i tabel.

### 7. Ustawienia i Uniwersalność Systemu (Settings)
Aplikacja została zaprojektowana tak, aby nie była ograniczona do jednej konkretnej firmy czy jednego producenta ekranów. W ustawieniach użytkownik konfiguruje:
- **Systemy LED & Korelacje**:
  - Można zdefiniować dowolny model ekranu (Dicolor, Absen, Unilumin, Infiled, Roe itp.).
  - Można określić, które moduły z magazynu tworzą zestaw hybrydowy (moduł główny 50×100 + połówka 50×50).
  - Można przypisać dedykowany model belki zawiesia (Hanging Bar) do danego modelu ekranu.
  - Można wybrać, czy połówka ma znajdować się na dole, czy na górze ekranu.
  - Dostępny jest graficzny podgląd kolumny modułów z walidacją, czy szerokości modułów do siebie pasują.
- **Presety Montażowe**:
  - Konfiguracja domyślnego stałego osprzętu dodawanego do każdej bramki, kreski czy eLek (np. ile pasów, ile czapek, jakie bazy).
- **Mapowanie Konstrukcji**:
  - Powiązanie algorytmów z faktycznymi pozycjami krat w magazynie (które ID w magazynie to krata 2m, 1.5m, 1m, 0.5m oraz wciągarka).
  - Przycisk inteligentnego autowykrywania z magazynu.
- **Kategorie Magazynowe**:
  - Dodawanie, zmiana nazw i usuwanie kategorii z zabezpieczeniem przed skasowaniem kategorii będących w użyciu.

---

## 4. Przykładowy Scenariusz Użycia (User Story)

Oto jak wygląda typowy proces pracy w aplikacji krok po kroku:

1. **Wprowadzenie zlecenia**: Kierownik projektu klika *Nowa Robota*, wpisuje nazwę: `Gala Jubileuszowa 2026`, wybiera termin i lokalizację.
2. **Dodanie ekranu**: Klika *Dodaj Ekran LED*, wpisuje nazwę `Ekran Główny`, wybiera model `Dicolor P3.9`, podaje wymiar `6.0 × 3.5 m` i wybiera montaż `Bramka (wciągarka ręczna)`.
3. **Magia obliczeń**:
   - System natychmiast wylicza, że ekran 6×3.5m to $12 \times 7 = 84$ kabinety (w tym 36 całych i 12 połówek na kolumnę).
   - Przelicza to na 5 skrzyń modułów całych i 2 skrzynie modułów połówkowych (łącznie 7 skrzyń diody).
   - Dobiera 6 sztuk belek zawiesia (hanging barów).
   - Dobiera belkę bramki o długości 6m (3 odcinki kraty 2m) oraz dwa słupy o wysokości 4.5m (wysokość ekranu 3.5m + 1m zapasu na czapkę).
   - Dobiera 2 wciągarki ręczne, 2 wózki bazowe, 2 czapki, 4 pasy odciągowe 5T i zestaw śrub/pinów.
4. **Weryfikacja dostępności**: Prawa kolumna kreatora natychmiast pokazuje cały ten sprzęt jako zielony (dostępny) i rezerwuje go z magazynu.
5. **Dobicie okablowania**: Użytkownik w wyszukiwarce picker'a wpisuje `prąd` i klika dodanie rozdzielnicy 32A oraz dwóch bębnów kablowych.
6. **Zapis i wyjazd**: Klika *Zatwierdź i zarezerwuj*. Sprzęt zostaje oficjalnie zablokowany w magazynie na termin imprezy.
7. **Wydruk dla magazynu**: Koordynator klika ikonę listy załadunkowej przy nowej robocie, wpisuje godzinę gotowości `12:00` i pobiera elegancki plik PDF, który przekazuje magazynierom na halę.

---

## 5. Standard Wizualny i Filozofia UI/UX (Piękny, Nowoczesny CRM)

Tworzymy oprogramowanie klasy **najlepszych współczesnych narzędzi B2B (Linear, Raycast, Supabase, Stripe)**. Obowiązuje reguła **Złotego Środka**:
- **Zero natłoku informacyjnego:** Nie upychamy 10 kolumn w tabeli ani 3 linijek tekstu w jednej komórce. Łączymy powiązane dane (np. dyskretny kod SKU pod nazwą sprzętu, czytelny zapis `18 / 24 case`).
- **Przestrzeń i oddech:** Wiersze tabeli mają wysokość `py-3.5` do `py-4`, a karty i panele posiadają zaokrąglenia `rounded-2xl` z eleganckim ciemnym tłem `#111622` i obramowaniem `border-slate-800/80`.
- **Kolorystyka:** Głęboki grafit (`#090D16`) z wyrazistym, elektrycznym błękitem (`#2563EB`) na przyciskach i aktywnych stanach.
- **Hierarchia:** Najważniejsze cyfry (dostępny stan, alert braku) rzucają się w oczy, a drugorzędne dane są stonowane szarością.

---

## 6. Podsumowanie dla Kolejnego AI – Co Trzeba Wiedzieć Przy Dalszym Rozwoju?

Jeśli pracujesz nad dalszym rozwojem tej aplikacji, pamiętaj o fundamentalnych zasadach:
- **Twórz piękny, nowoczesny interfejs:** Używaj atomów Shadcn UI, fontu Inter/Geist, subtelnego glassmorphismu i przestronnych układów bez wizualnego śmietnika.
- **Zawsze zachowuj automatyczne przeliczanie:** Użytkownik nie powinien musieć ręcznie liczyć skrzyń, metrów kwadratowych czy belek kratownicy – to system ma robić za niego na podstawie wpisanych metrów.
- **Nigdy nie rozbijaj skrzyń na pojedyncze klocki:** W branży eventowej operuje się skrzyniami (`case`). Jeśli do ekranu brakuje 1 modułu, i tak trzeba zabrać cały dodatkowy case.
- **Pilnuj zasady wysokości bramki:** Słupy bramki to zawsze co najmniej wysokość ekranu + 1 metr na czapkę i wciągarkę.
- **Elastyczność i uniwersalność:** Żadne modele diody ani kratownic nie mogą być wpisane „na sztywno” w kodzie – wszystko musi wynikać ze zdefiniowanych systemów w Ustawieniach i aktualnego stanu magazynu.
