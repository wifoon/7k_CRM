# 🎨 DESIGN GUIDELINES & UI SPECIFICATION (PIVORA BENTO STANDARD)

> **Dla kogo jest ten dokument:**
> Ten plik to **kompletna specyfikacja architektury wizualnej, siatki, anatomii kart i mikro-UX** stworzona na bazie wzorca nowoczesnego dashboardu klasy premium (układ modułowy Bento Grid). 
> Łączy on **przestrzenny, modularny układ ze zdjęcia** z naszą paletą **Dark Graphite (`#090D16` / `#161b22`) i Electric Tech Blue (`#2563EB`)**.

---

## 1. Dlaczego Ten Interfejs Wygląda Świetnie? (Zasady Kluczowe)

Analizując wzorzec ze zdjęcia, jego wysoka jakość wynika z 6 konkretnych mechanizmów:

1. **Bento Grid (Asymetryczna Siatka Modułowa)**:
   - Zamiast monotonnych, równych prostokątów, dashboard dzieli się na logiczne strefy o różnej szerokości i wysokości (np. szeroki wykres 8 kolumn + boczny kalendarz 4 kolumny).
   - Każdy moduł to osobna „wyspa” informacyjna z własnym nagłówkiem i akcjami.
2. **Jednolity Standard Zaokrągleń (Border Radius Scale)**:
   - **Główne Karty / Panele Bento**: `rounded-xl` (12px) – spójnie we wszystkich widokach (Magazyn, Roboty, Studio Ekranu).
   - **Kafelki opcji / Przyciski / Inputy / Steppery**: `rounded-lg` (8px).
   - **Wewnętrzne badge / Pigułki metryk**: `rounded-md` (6px) lub `rounded-full` (dla wskaźników z kropką).
   - **Mikro-indeksy / Tagi (np. #1)**: `rounded` (4px).
3. **Płaskie Karty z Mikroskopijną Ramką (Zero Ciężkich Cieni)**:
   - Separacja kart nie opiera się na rozlanym, brudnym cieniu, lecz na **precyzyjnej obwódce 1px** (`border border-slate-800/80`) i minimalnej różnicy odcieni między tłem (`#090D16`) a kartą (`#161b22`).
4. **Wyraźna Hierarchia Wartości (Skala Skupienia)**:
   - Najważniejsza liczba ma wielkość `text-2xl` lub `text-3xl font-black`.
   - Etykieta jest mała (`text-xs font-semibold`), stonowana (`text-slate-400`).
   - Pigułka trendu (`+22%`, `↑ 2%`) znajduje się tuż obok liczby, dając natychmiastowy kontekst bez czytania całego ekranu.
5. **Segmented Controls zamiast Tradycyjnych Dropdownów**:
   - Przełączniki widoków (np. `1D | 1W | 1M | 6M | 1Y | ALL` lub `Status | Sources | Qualification`) to wbudowane w kartę pigułki, w których aktywna opcja ma wyraziste tło i subtelny cień.
6. **Mikroelementy Kontekstowe (Pills, Dots, Avatars, Badges)**:
   - Ikony narzędziowe zamknięte w dyskretnych kółkach/zaokrąglonych boksach (`p-2 rounded-xl`).
   - Awatary ułożone w stos (`-space-x-2`) z licznikiem `+7`.
   - Trzy kropki (`···`) w prawym górnym rogu każdej karty dające dostęp do menu akcji.

---

## 2. Globalny Układ Aplikacji (App Shell Anatomy)

Układ dzieli się na dwa główne obszary: **Lewy Sidebar (Fixed)** oraz **Główny Canvas Roboczy (Scrollable)**.

```
┌─────────────────────────┬────────────────────────────────────────────────────────┐
│ SIDEBAR (260px)         │ TOPBAR (Tytuł + Search AI + Notification + Actions)   │
│                         ├────────────────────────────────────────────────────────┤
│ • Logo + Collapse (<<)  │ 4 KAFELKI KPI (Leads, CLV, Conversion, Revenue)       │
│ • User Switcher Pill    ├─────────────────────────────┬──────────────────────────┤
│ • Menu Główne           │ GŁÓWNY WYKRES TRENDU        │ WIDŻET KALENDARZA /      │
│ • Grupy zwijane (Favs)  │ (Revenue + Selector 1Y)     │ SPOTKAŃ (Google Meet)    │
│ • Mini Card (Magazyn %) ├──────────────┬──────────────┴───────────┬──────────────┤
│ • Stopka (Settings)     │ WIDŻET A     │ WIDŻET B (Mapa / Region) │ WIDŻET C     │
└─────────────────────────┴──────────────┴──────────────────────────┴──────────────┘
```

---

## 3. Szczegółowa Anatomia Elementów

### A. Lewy Panel Boczny (Sidebar)

1. **Nagłówek Brandu**:
   - Logo (zmiękczony gradientowy kształt) + Nazwa aplikacji + podtytuł platformy (`text-xs text-slate-400`).
   - Przycisk zwijania sidebara (`<<`) po prawej stronie.
2. **Karta Przełącznika Użytkownika / Organizacji (User Switcher Pill)**:
   - Dyskretny boks (`bg-slate-800/50 border border-slate-700/60 rounded-xl p-2.5 mx-3 mb-4`).
   - Awatar użytkownika + adres email / nazwa firmy (`text-xs font-semibold`) + pionowy chevron (`⇅`).
3. **Nawigacja Główna (Icon + Label + Counter)**:
   - Element aktywny: Tło o miękkim zaokrągleniu (`bg-blue-600/15 text-blue-300 font-semibold border-l-2 border-blue-500`).
   - Element nieaktywny: `text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-xl px-3 py-2.5`.
   - Liczniki ilościowe: Dyskretny badge po prawej (`text-xs font-mono text-slate-500`).
4. **Zwijane Sekcje Menu ("Favorites", "Projekty")**:
   - Nagłówek sekcji z małą strzałką (`v`), tytułem i szybkimi akcjami po prawej (`···` oraz `+`).
5. **Dolny Widżet Statusowy (np. Stan Zajętości / Pamięć)**:
   - Karta umieszczona na dole sidebara przed stopką.
   - Posiada pasek postępu (segmentowany lub ciągły) z wartością procentową (`90%`).
   - Przycisk szybkiej akcji: `Upgrade / Rozszerz ->` z zaokrągleniem `rounded-xl`.
6. **Stopka Sidebara**:
   - Ustawienia (`Settings >`) oraz Centrum Pomocy (`Help Center >`) ze strzałkami prowadzącymi.

---

### B. Górny Pasek Narzędziowy (Topbar)

1. **Lewa strona: Tytuł i Stan Świeżości Danych**:
   - Ikona sekcji + Duży tytuł strony (`Dashboard`, `text-2xl font-bold text-white`).
   - Wskaźnik świeżości bezpośrednio pod lub obok tytułu: zielona fajka `✓ Last updated now` (`text-xs text-emerald-400`).
2. **Środek / Prawa strona: Narzędzia i Przyciski Akcji**:
   - **Pole Wyszukiwarki ("Search AI Mode")**: Zaokrąglona pigułka `rounded-xl` z ikoną lupy, placeholderem i skrótem klawiszowym (`⌘K`).
   - **Przyciski Narzędziowe (Ikony w boksach)**:
     - Dzwonek powiadomień z czerwonym licznikiem `12` w prawym górnym rogu.
     - Poczta / wiadomości.
     - Ikona udostępniania (`Share`).
     - Wszystkie w spójnym rozmiarze `w-10 h-10 rounded-xl border border-slate-700/60 bg-[#161b22] flex items-center justify-center`.
   - **Kolekcja Przycisków Akcji (Hierarchy of Buttons)**:
     - Przycisk Tertiary/Ghost: `Customize Widget` z ikoną ołówka/suwaków.
     - Przycisk Secondary Outline: `Imports v` z ikoną pobierania i strzałką dropdown.
     - Przycisk **Primary Electric Blue**: `Exports v` w pełnym kolorze `#2563EB` z poświatą `shadow-lg shadow-blue-600/25` i ikoną akcji.

---

### C. Kafelki Wskaźników KPI (Górny Rząd)

Układ 4 lub 5 kolumn w jednym rzędzie:

1. **Anatomia Kafelka KPI**:
   - **Góra**: Ikona w miękkim bąblu po lewej (`p-2.5 rounded-xl bg-blue-500/10 text-blue-400`) + Nazwa metryki (`Leads`, `CLV`, `Conversion Rate`, `Revenue`) + Ikona informacyjna `(i)` po prawej stronie.
   - **Dół**:
     - Ogromna liczba: `text-2xl font-black text-white tracking-tight tabular-nums`.
     - Pigułka trendu wpięta bezpośrednio obok:
       - Wzrost: `text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1`.
       - Spadek: `text-rose-400 bg-rose-500/10 border border-rose-500/20 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1`.
     - Tekst kontekstowy: `vs last week` lub `vs last month` (`text-[11px] text-slate-500 ml-1.5`).

---

### D. Główny Wykres i Kontrolki Czasowe (Centerpiece)

1. **Wielofunkcyjny Nagłówek Wykresu**:
   - Dropdown wyboru metryki: `Revenue ⇅` (`text-sm font-semibold text-slate-300`).
   - Wartość główna: `$32,209` (`text-xl font-bold text-white`) + pigułka zmiany `+22% vs last month`.
   - **Pigułkowy Przełącznik Zakresu (Segmented Control)** w prawym górnym rogu:
     - Kontener: `bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 inline-flex items-center gap-1`.
     - Przyciski: `1D`, `1W`, `1M`, `6M`, `1Y`, `ALL`.
     - Aktywny przycisk: `bg-blue-600 text-white font-bold rounded-lg px-2.5 py-1 text-xs shadow-sm`.
     - Nieaktywne przyciski: `text-slate-400 hover:text-white px-2.5 py-1 text-xs font-medium`.
2. **Stylistyka Słupków Wykresu**:
   - Zaokrąglone górne krawędzie słupków (`rounded-t-lg`).
   - Dyskretna linia przerywana łącząca punkty szczytowe (`stroke-dasharray="3 3"`).
   - Oś X i Y w ultra-stonowanym odcieniu (`text-[10px] font-mono text-slate-500`).

---

### E. Widżet Kalendarza i Zdarzeń (Prawy Boczny Moduł)

1. **Mini-Kalendarz Miesięczny**:
   - Pasek nagłówka z przełączaniem miesięcy: `< Październik 2025 >`.
   - Dni tygodnia w nagłówku: `Pn, Wt, Śr, Czw, Pt, So, Nd` (`text-[10px] text-slate-500 font-bold uppercase`).
   - Dni miesiąca w siatce 7 kolumn.
   - **Aktywny/Wybrany dzień**: Wyróżniony pełnym zaokrąglonym kółkiem w kolorze akcentu (`bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30`).
2. **Lista Nadchodzących Zdarzeń (Event Cards pod kalendarzem)**:
   - Każde zdarzenie to oddzielna zaokrąglona sub-karta (`bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 mb-2 flex items-center justify-between`).
   - Lewa strona:
     - Tytuł zdarzenia (`text-xs font-bold text-white`).
     - Grupa awatarów uczestników (`flex -space-x-1.5 overflow-hidden`).
   - Prawa strona:
     - Godzina (`9:00 am - 10:00 am`, `text-[10px] text-slate-400`).
     - Pigułka platformy: `On Google Meet >` lub `On Slack >` (`text-[10px] font-semibold text-slate-300 bg-slate-700/60 px-2 py-0.5 rounded-lg`).

---

### F. Dolne Karty Analityczne (Dolny Rząd Bento)

1. **Karta Statusów / Pipeline (np. Leads Management)**:
   - Segmented Tabs na górze: `[Status] [Sources] [Qualification]` w zaokrąglonej ramce.
   - Wiersze postępu: Nazwa etapu (`Qualified`, `Contacted`, `Lost`, `Won`) po lewej, a po prawej miękki, zaokrąglony pasek postępu (`h-3 rounded-full bg-blue-500/80`).
2. **Karta Geograficzna / Magazynowa (Top Country / Sprzęt w terenie)**:
   - Dyskretny podrys wektorowy w tle karty.
   - Lista rankingowa: Pozycja (`1`, `2`, `3`) + Ikona/Flaga + Nazwa + Wartość procentowa wyjustowana do prawej (`48%`, `33%`).
   - Dolny przycisk tekstowy: `Zobacz więcej →` (`text-xs font-semibold text-blue-400 hover:text-blue-300`).
3. **Karta Udziału Kategorii (Retention / Wykres Wielosegmentowy)**:
   - Słupki pionowe złożone z kilku odcieni (stacked bar chart z zaokrągleniami u góry).
   - Legenda z kolorowymi kropkami: `• Moduły 50x100  • Połówki 50x50  • Osprzęt`.

---

## 4. Przetłumaczenie Układu na Naszą Paletę (Dark Graphite + Electric Blue)

Poniższa tabela to bezpośrednie mapowanie wzorca ze zdjęcia na tokeny Tailwind w naszym projekcie:

| Element interfejsu ze zdjęcia | Klasa Tailwind w naszym Dark CRM | Wartość Hex / Wygląd |
| :--- | :--- | :--- |
| **Główne tło aplikacji** | `bg-[#090D16]` | Ciemny grafit o głębokim nasyceniu |
| **Powierzchnia kart (Bento Box)** | `bg-[#161b22]` | Matowy grafit o ton jaśniejszy |
| **Sub-karty / Wewnętrzne panele** | `bg-slate-900/60` | Przyciemniony wkład wewnątrz karty |
| **Obramowania kart i separatorów** | `border border-slate-700/60` | Cienka, precyzyjna linia 1px |
| **Główny akcent (Wybór, Primary Btn)** | `bg-blue-600 hover:bg-blue-500 text-white` | Elektryczny błękit (`#2563EB`) z blaskiem |
| **Poświata przycisków akcji** | `shadow-lg shadow-blue-600/25` | Miękki neonowy glow pod akcją |
| **Kontenery ikon (Icon Badges)** | `bg-blue-500/10 text-blue-400` | Prześwitujący błękitny bąbel |
| **Pigułki trendu dodatniego** | `text-emerald-400 bg-emerald-500/10 border-emerald-500/20` | Szmaragdowa pigułka |
| **Pigułki trendu ujemnego** | `text-rose-400 bg-rose-500/10 border-rose-500/20` | Karminowa pigułka |
| **Segmented Control (Tło przełącznika)** | `bg-slate-800/80 border-slate-700/60` | Kapsuła przełącznika widoków |
| **Typografia główna (Nagłówki, KPI)** | `text-white font-bold tracking-tight` | Czysta biel, bez szarości |
| **Typografia liczb i danych** | `font-mono tabular-nums` | Monospace o stałej szerokości cyfr |
| **Etykiety pomocnicze** | `text-slate-400 text-xs font-semibold` | Chłodny szary, wysoki kontrast |

---

## 5. Podsumowanie Wymagań dla Modelu LLM

Gdy model LLM buduje dowolny ekran w tej aplikacji, musi spełnić te 5 zasad konstrukcyjnych:

1. **Każdy ekran to Bento Grid**: Używaj `grid grid-cols-12 gap-4`, dzieląc przestrzeń na karty o proporcjach 8+4 lub 4+4+4.
2. **Promienie `rounded-2xl` (16px) na kartach i `rounded-xl` (12px) na przyciskach/inputach**: Żadnych ostrych rogów.
3. **Karty muszą mieć nagłówek z 3 elementami**: Ikona w bąblu po lewej + Tytuł + Narzędzie kontekstowe po prawej (`···`, przełącznik lub `(i)`).
4. **Wskaźniki KPI zawsze z pigułką trendu**: Nigdy sama liczba – zawsze duża cyfra + kolorowa pigułka `%` + mały tekst porównawczy.
5. **Segmented Controls zamiast selectów**: Gdzie tylko możliwe (zakresy dat, filtry statusów, zakładki), stosuj poziome pigułki przełączników wewnątrz karty.
