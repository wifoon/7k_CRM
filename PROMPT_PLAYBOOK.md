# 7K LED WMS – PLAYBOOK PROMPTÓW (PODEJŚCIE MOCK-FIRST)

> **Zasada Vibe Codingu (Mock-First)**:  
> **Nie zaczynamy od bazy danych!** Zaczynamy od żywego interfejsu i danych w pamięci (`mockData.ts`). Dzięki temu natychmiast widzisz aplikację w przeglądarce, testujesz ergonomię i zmieniasz zdanie bez bolesnych migracji SQL.  
> Dopiero gdy cały interfejs, kalkulatory i planer realizacji będą w 100% dopracowane, podpinamy Supabase jednym promptem!

---

## 📌 PROMPT 1: Szkielet Aplikacji, Ciemnoszary Design & Mock Data (Krok 1)

```text
Kontekst:
Rozpoczynamy budowę od zera systemu WMS/ERP dla techniki estradowej o nazwie "7K LED WMS" w oparciu o Next.js (App Router), TypeScript, Tailwind CSS oraz Shadcn UI.
Przeczytaj pliki .cursorrules, MASTER_PLAN.md oraz PROJECT_OVERVIEW.md.

Cel tego kroku:
Chcę od razu zobaczyć działający szkielet aplikacji na localhost:3000 z nowoczesnym ciemnoszarym designem oraz przygotowanym plikiem danych w pamięci (src/lib/mockData.ts).

Wymagania Wizualne (Design System):
1. Kolorystyka Dark Gray + Tech Blue (klasa Linear/Vercel):
   - Tło aplikacji: głęboki grafit / ciemnoszary (#090D16 / #0D111A).
   - Karty i panele: matowy ciemnoszary (#131A29 / #161F33) z delikatnym obramowaniem border-slate-800/80.
   - Akcenty: elektryczny błękit / tech blue (#2563EB / #3B82F6 z delikatną poświatą przycisków shadow-lg shadow-blue-600/25).
   - Subtelny glassmorphism (backdrop-blur-md) na nawigacji.
2. Struktura nawigacji:
   - Sidebar (boczne menu z zakładkami: Pulpit, Magazyn, Roboty, Ustawienia).
   - Topbar z nazwą aktywnej sekcji i wskaźnikami powiadomień.
3. Plik mockData.ts:
   - Początkowe dane w pamięci: kilka pozycji magazynowych (Dioda Dicolor P3.9 50x100 i połówka 50x50, kratownice 2m, 1.5m, 1m, 0.5m, wciągarki, okablowanie).
   - Pamiętaj: dioda operuje na skrzyniach (case) z polem cabinetsPerCase, a nie luzem!

Zadanie:
1. Przedstaw propozycję architektury layoutu i struktury mockData.ts.
2. Po mojej akceptacji wygeneruj kod, tak aby po uruchomieniu "npm run dev" aplikacja wyglądała profesjonalnie i pozwalała przełączać się między podstronami.
```

---

## 📌 PROMPT 2: Moduł Magazynu na Mockach (Design: Złoty Środek, Linear/Raycast)

```text
Kontekst:
Mamy działający szkielet aplikacji. Teraz budujemy podstronę /magazyn opartą o nasze mockData w pamięci podręcznej (stan lokalny / Zustand).

Wymagania Wizualne (Złoty Środek – Zero Natłoku Informacji):
1. Karty KPI na górze:
   - Tylko 3 minimalistyczne metryki w jednym rzędzie: "Wszystkich pozycji", "Sprzęt w terenie", "Braki / Niski stan".
   - Tło bg-[#131A29], obramowanie border-slate-800/80, zaokrąglenia rounded-2xl, czytelna typografia bez pstrokatych wielkich ikon.
2. Pasek Narzędzi (Toolbar):
   - Wyszukiwarka z lupą po lewej + 4-5 dyskretnych pigułek kategorii na środku + wyrazisty błękitny przycisk "+ Nowa pozycja" po prawej.
3. Przestronna, Odchudzona Tabela (Tylko 5 kluczowych kolumn, brak chaosu!):
   - Kolumna 1 "SPRZĘT": Wyraźna nazwa na górze (text-white font-medium), a pod spodem mały, stonowany kod SKU fontem monospace (text-xs text-slate-500 font-mono) - wzorzec Stripe/Linear.
   - Kolumna 2 "KATEGORIA": Dyskretny pill badge ze świecącą kropeczką w środku.
   - Kolumna 3 "STAN (DOSTĘPNE / RAZEM)": Czysty zapis np. "18" (zielona) / "24 case" (szara).
   - Kolumna 4 "STATUS": Pojedynczy, czytelny badge z kolorową kropką (Dostępny / Niski stan / Brak / Serwis).
   - Kolumna 5 "AKCJE": Dyskretne ikony edycji/menu widoczne na hoverze wiersza.
4. Oddech i Spacing:
   - Wiersze o wysokości py-3.5 lub py-4, tło bg-[#111622] z delikatnym borderem border-slate-800/80 i zaokrągleniami rounded-2xl.
5. Czysta architektura: logika filtrów i mutacji stanu w hooku useInventory. Żaden plik nie przekracza 150 linii.

Zadanie:
Przedstaw podział na komponenty i kod widoku magazynu według tego czystego, minimalistycznego standardu.
```

---

## 📌 PROMPT 3: Czyste Silniki Matematyczne: Ekrany & Kraty (Krok 3)

```text
Kontekst:
Mamy działający magazyn. Zanim przejdziemy do planowania imprez, tworzymy i testujemy serce matematyczne systemu w czystym TypeScript (src/utils/):

Wymagania Domenowe:
1. Silnik Ekranów (screenCalc.ts):
   - Wymiary W x H w metrach -> siatka kabinetów całych (50x100) i połówek (50x50) z krokiem 0.5m.
   - Zaokrąglanie w górę do pełnych skrzyń (Math.ceil) osobno dla modułów całych i połówek.
   - Liczenie powierzchni m2 oraz belek zawiesia (1 belka / 1m szerokości).
2. Silnik Kratownic (trussCalc.ts):
   - Zachłanny solver dobierający odcinki krat (2m, 1.5m, 1m, 0.5m) tak, by zminimalizować liczbę połączeń.
   - Reguła bramki: Słupy muszą być o 1.0 m wyższe niż ekran (zapas na czapkę wciągarki i zawiesia).
   - Automatyczny dobór stałego osprzętu (bazy, hokeje, czapki, pasy 5T, wciągarki).
3. 100% czyste funkcje z testem weryfikacyjnym Node.js dla ekranu 6x3.5m.

Zadanie:
Zaproponuj implementację obu algorytmów. Po zatwierdzeniu stwórz pliki i uruchom test weryfikacyjny.
```

---

## 📌 PROMPT 4: Ustawienia & Uniwersalność (Krok 4)

```text
Kontekst:
Tworzymy podstronę /ustawienia, która zarządza konfiguracjami systemów LED i mapowaniem kratownicy, aby w aplikacji nic nie było zaszyte na sztywno.

Wymagania:
Cztery zakładki w Ustawieniach:
1. "Systemy LED & Korelacje": UI do definiowania modeli ekranów (łączenie modułu głównego, połówki, przypisanie dedykowanego hanging bara, podgląd kolumny modułów z walidacją szerokości).
2. "Presety Montażowe": Konfiguracja domyślnego stałego osprzętu dla bramek i belek.
3. "Mapowanie Konstrukcji": Wybór, które pozycje z magazynu odpowiadają poszczególnym długościom krat i wciągarkom (z przyciskiem autowykrywania).
4. "Kategorie Magazynowe": Dodawanie i edycja kategorii.

Zadanie:
Zaproponuj strukturę komponentów widoku Ustawień. Po akceptacji wygeneruj kod.
```

---

## 📌 PROMPT 5: Rozkmina UX Nowego Planera Realizacji (Krok 5)

```text
Kontekst:
Przechodzimy do kluczowego modułu: podstrona /roboty (planowanie imprez, dobór ekranów LED i rezerwacja sprzętu).
W poprzedniej wersji układ 2-kolumnowy z sztywnym koszykiem nie był do końca satysfakcjonujący. Chcemy wspólnie znaleźć lepszy, bardziej ergonomiczny i przejrzysty UX!

Wymagania Biznesowe:
1. Rejestracja imprezy (nazwa, termin, lokalizacja).
2. Konfiguracja jednego lub wielu ekranów LED z wyborem montażu (bramka, kreska, eLki).
3. Automatyczne przeliczanie potrzebnych skrzyń diody, odcinków kratownic i osprzętu.
4. Kontrola dostępności na magazynie w czasie rzeczywistym i blokada overbookingu.
5. Inteligentna edycja zlecenia: funkcja getEffectiveAvailable nie blokuje własnego sprzętu podczas edycji.

Zadanie (Faza Burzy Mózgów):
Zanim napiszesz linijkę kodu:
1. Zaproponuj 2–3 różne koncepcje interfejsu dla tego modułu (np. nowoczesny wieloetapowy Wizard z podsumowaniem, modułowy planer kartowy, panel z wysuwanym podsumowaniem szufladowym Drawer itp.).
2. Wskaż wady i zalety każdego podejścia z punktu widzenia technika estradowego.
3. Gdy wybiorę najlepszy wariant, przejdziemy do implementacji na naszych mockach!
```

---

## 📌 PROMPT 6: Listy Załadunkowe (PDF / Excel) & Dashboard (Krok 6)

```text
Kontekst:
Ostatni szlif funkcjonalny przed bazą danych: generowanie dokumentacji magazynowej (Packing List / WZ) oraz podsumowanie KPI na Dashboardzie.

Wymagania:
1. Podgląd Listy Załadunkowej:
   - Grupowanie według kategorii (Dioda, Konstrukcja, Okablowanie, Osprzęt).
   - Godzina gotowości na rampie (np. 14:00) i pole na notatki techniczne.
   - Puste linie na odręczne podpisy magazyniera.
2. Eksporty:
   - Wektorowy PDF (jsPDF + autotable) z polskimi czcionkami.
   - Arkusz Excel (ExcelJS) o spójnym wyglądzie.
3. Dashboard:
   - Karty KPI zliczające sprzęt w terenie, aktywne realizacje i alerty braków.

Zadanie:
Zaproponuj optymalne generowanie PDF i Excela po stronie klienta i wygeneruj moduł.
```

---

## 📌 PROMPT 7: Podpięcie Bazy Danych Supabase (Krok 7 - Finał)

```text
Kontekst:
Cała aplikacja, jej interfejs, kalkulatory i planer realizacji są w 100% przetestowane i działają doskonale na danych mockData. Teraz, znając dokładną strukturę obiektów, podpinamy prawdziwą bazę danych Supabase!

Wymagania:
1. Na podstawie naszych TypeScriptowych typów i mockData wygeneruj skrypt SQL tworzący tabele w Supabase (categories, equipment z JSONB, screen_systems, construction_mappings, mounting_presets, jobs, job_items) wraz z danymi początkowymi (SEED).
2. Przygotuj warstwę serwisową (src/services/equipmentService.ts, jobService.ts) izolującą zapytania Supabase od UI (Wzorzec Repozytorium).
3. Podepnij pobieranie i mutacje danych za pomocą TanStack Query w miejsce stanu lokalnego.

Zadanie:
Przedstaw skrypt migracji SQL oraz plan bezbolesnej podmiany mockData na zapytania Supabase.
```
