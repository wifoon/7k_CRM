# 7K LED WMS – MASTER PLAN ARCHITEKTONICZNY (NEXT.JS + SUPABASE)

> **Strategia Technologiczna**:  
> - **Framework**: Next.js (App Router, Server Actions, React 19).  
> - **UI & Design**: Tailwind CSS + Shadcn UI (dostępne komponenty Radix w `src/components/ui/`).  
> - **Baza Danych**: Supabase (PostgreSQL z obsługą `JSONB`).  
> - **Strategia Przenośności (No Vendor Lock-in)**: Warstwa dostępu do danych (Data Access Layer / Service Layer) całkowicie oddziela bazę od UI. Jeśli w przyszłości zechcesz przenieść się z Supabase na własny serwer PostgreSQL, Neon czy AWS RDS, zmieniasz tylko pliki w `src/services/` bez ruszania interfejsu!  
> - **Stan Aplikacji**: **Zustand** (dla interaktywnego kreatora ekranu i koszyka na żywo) + **TanStack Query** (dla cache i danych serwerowych).

---

## 1. Elastyczny Schemat Bazy Danych (PostgreSQL / Supabase)

Dzięki wykorzystaniu kolumn typu `JSONB` w PostgreSQL schemat jest w 100% uniwersalny i nie wymaga zmian przy dodawaniu nowych typów sprzętu (np. oświetlenie, nagłośnienie, konstrukcje zadaszeń):

```sql
-- 1. Kategorie sprzętu
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  required_attributes JSONB DEFAULT '[]'::jsonb
);

-- 2. Pozycje magazynowe (Uniwersalna encja)
CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT REFERENCES categories(id),
  total_qty INTEGER NOT NULL DEFAULT 0,
  available_qty INTEGER NOT NULL DEFAULT 0,
  service_qty INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'case', -- 'case' | 'szt.' | 'kpl.'
  location TEXT,
  status TEXT NOT NULL DEFAULT 'dostepny', -- 'dostepny' | 'niski_stan' | 'brak' | 'serwis'
  sku TEXT,
  attributes JSONB DEFAULT '{}'::jsonb, -- cabinet_w, cabinet_h, cabinets_per_case, weight itp.
  relations JSONB DEFAULT '{}'::jsonb,  -- partner_item_id, hanging_bar_id
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Uniwersalne Systemy LED (Zdefiniowane w Ustawieniach)
CREATE TABLE screen_systems (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'hybrid', -- 'hybrid' | 'single'
  full_item_id BIGINT REFERENCES equipment(id),
  half_item_id BIGINT REFERENCES equipment(id),
  hanging_bar_item_id BIGINT REFERENCES equipment(id),
  half_position TEXT NOT NULL DEFAULT 'bottom', -- 'bottom' | 'top'
  description TEXT
);

-- 4. Mapowanie Konstrukcji i Presety Osprzętu
CREATE TABLE construction_mappings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  mapping JSONB NOT NULL DEFAULT '{}'::jsonb -- truss20Id, truss15Id, truss10Id, truss05Id, hoistManualId, hoistElectricId, hangingBarId
);

CREATE TABLE mounting_presets (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL, -- 'bramka' | 'kreska' | 'elki'
  items JSONB NOT NULL DEFAULT '[]'::jsonb -- lista stałego osprzętu (bazy, hokeje, czapki, pasy)
);

-- 5. Zlecenia / Roboty
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'w_trakcie', -- 'w_trakcie' | 'zakonczone'
  screens JSONB DEFAULT '[]'::jsonb,        -- konfiguracje ekranów LED
  constructions JSONB DEFAULT '[]'::jsonb,  -- konfiguracje konstrukcji
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Pozycje zarezerwowane na zlecenie
CREATE TABLE job_items (
  id BIGSERIAL PRIMARY KEY,
  job_id TEXT REFERENCES jobs(id) ON DELETE CASCADE,
  equipment_id BIGINT REFERENCES equipment(id),
  qty INTEGER NOT NULL,
  is_auto BOOLEAN DEFAULT false -- czy pozycja pochodzi z automatu kalkulatora, czy z ręki
);
```

---

## 2. Kolejność Realizacji: 7 Kroków (Podejście Mock-First)

```text
KROK 1: Next.js Boilerplate, Ciemnoszary Shell & Mock Data
   ↓
KROK 2: Moduł Magazynu na Mockach (Tabela, Filtry, Obieg Serwisowy)
   ↓
KROK 3: Czyste Silniki Matematyczne: Ekrany & Kratownice (Testy Jednostkowe)
   ↓
KROK 4: Ustawienia: Systemy LED & Mapowanie Konstrukcji
   ↓
KROK 5: Moduł Robót – Rozkmina UX Nowego Planera (Burza mózgów z AI)
   ↓
KROK 6: Listy Załadunkowe, Eksporty PDF/Excel & Dashboard
   ↓
KROK 7: Podpięcie Bazy Danych Supabase (Podmiana Mocków na Bazy SQL)
```

---

### KROK 1: Shell Aplikacji, Shadcn UI & Mock Data w Pamięci
- **Cel**: Odpalenie w 3 minuty żywej, działającej aplikacji na `localhost:3000` z ciemnoszarym motywem i gotowymi danymi testowymi.
- **Design System & Kolorystyka**:
  - **Tło aplikacji**: Głęboki grafit / ciemnoszary (`#090D16` / `#0D111A` / `slate-950`).
  - **Karty i panele**: Ciemnoszary mat (`#131A29` / `#161F33` / `slate-900/85`) z delikatnym obramowaniem (`border-slate-800/80` lub `border-blue-500/15`).
  - **Główny akcent (Primary)**: **Elektryczny Błękit / Tech Blue** (`#2563EB` / `#3B82F6` / `blue-600`) z delikatną niebieską poświatą przycisków (`shadow-lg shadow-blue-600/25`) i fokusach.
  - **Akcenty statusowe**: Szmaragdowy dla dostępności (`emerald-400`), bursztynowy dla niskiego stanu (`amber-400`), czerwony dla overbookingu (`rose-400`), purpurowy dla serwisu (`purple-400`).
  - **Efekty głębi**: Subtelny `backdrop-blur-md bg-slate-950/80` na nawigacji i oknach dialogowych.
- **Początkowe dane (`src/lib/mockData.ts`)**:
  - Tablice obiektów w pamięci: sprzęt (dioda Dicolor w skrzyniach, kratownice, wciągarki, kable), kategorie, wstępne systemy LED.
- **Struktura routingu Next.js App Router**:
  - `src/app/layout.tsx` (główny layout z motywem i nawigacją).
  - `src/app/page.tsx` (przekierowanie na `/dashboard`).
  - `src/app/dashboard/page.tsx`, `/magazyn/page.tsx`, `/roboty/page.tsx`, `/ustawienia/page.tsx`.

---

### KROK 2: Moduł Magazynu na Mockach (Design: Złoty Środek, Linear/Raycast)
- **Cel**: Piękny, przestronny magazyn bez natłoku informacji (Złoty Środek).
- **Zasady UX i Tabela (Odchudzona do 5 kluczowych kolumn)**:
  - **Eliminacja natłoku**: Zakaz tworzenia 10 wąskich kolumn czy wpychania 3 linijek tekstu do jednej komórki.
  - **Kolumny tabeli**:
    1. *Sprzęt*: Wyraźna nazwa, a pod spodem stonowany, mały kod SKU fontem monospace (`text-xs text-slate-500 font-mono`).
    2. *Kategoria*: Czysty, elegancki pill badge ze świecącą kropeczką.
    3. *Stan (Dostępne / Razem)*: Czytelny zapis `18` / `24 case` (zielona liczba dostępna, szara suma).
    4. *Status*: Pojedynczy, czytelny badge z kolorową kropką (Dostępny / Niski stan / Brak / Serwis).
    5. *Akcje*: Dyskretne ikony edycji/menu widoczne na hoverze wiersza.
  - **Przestrzeń (Oddech)**: Wiersze o wysokości `py-3.5` lub `py-4`, zaokrąglone narożniki tabeli `rounded-2xl`, subtelne tło `bg-[#111622]` z obramowaniem `border-slate-800/80`.
  - **Górne Karty KPI**: 3 minimalistyczne kafelki w jednym rzędzie (Wszystkie pozycje, Sprzęt w terenie, Braki/Niski stan) z dużą, elegancką typografią.
- **Funkcjonalności**:
  - Wyszukiwarka z lupą + dyskretne pigułki kategorii.
  - Formularz dodawania i edycji sprzętu (dla diody: wymiary kabinetu, liczba na skrzynię, powiązanie połówkowe).
  - Modal obiegu serwisowego (przenoszenie uszkodzonych skrzyń i ich przywracanie).
- **Separacja logiki**: Stan i filtry w hooku `useInventory`.

---

### KROK 3: Niezależne Silniki Matematyczne (Pure Math)
- **Cel**: Bezbłędna matematyka ekranów i kratownic odseparowana od widoków Reacta.
- **Pliki**:
  - `src/utils/screenCalc.ts`:
    - `screenToCases` (pojedynczy moduł).
    - `screenToHybridCases` (łączenie 50×100 z 50×50 cm z krokiem 0.5m).
    - `getScreenModelOptions` (synteza modeli z magazynu).
  - `src/utils/trussCalc.ts`:
    - `solveTrussSections` (zachłanny algorytm dla belek i słupów 2m, 1.5m, 1m, 0.5m).
    - Reguła wysokości bramki: $\text{Wysokość słupów} = \text{Wysokość ekranu} + 1.0\text{ m}$.
    - `calcMountingItems` (generowanie BOM osprzętu z bezpiecznym fallbackiem `resolveEqId`).
- **Weryfikacja**: Czysty skrypt testowy Node.js dla ekranu 6×3.5m.

---

### KROK 4: Ustawienia i Uniwersalność (Slice: Settings)
- **Cel**: Wyeliminowanie jakiegokolwiek sztywnego kodu – wszystko edytowalne z poziomu UI.
- **Zakładki w `/ustawienia`**:
  1. **Systemy LED & Korelacje**: Zarządzanie modelami, parowanie połówki, wybór dedykowanego Hanging Bara.
  2. **Presety Montażowe**: Stały osprzęt dla bramek i belek.
  3. **Mapowanie Konstrukcji**: Połączenie długości krat z pozycjami w magazynie.
  4. **Kategorie Magazynowe**: Dodawanie i edycja kategorii.

---

### KROK 5: Moduł Robót – Rozkmina UX Nowego Planera (Slice: Jobs Engine)
- **Cel**: Zbudowanie intuicyjnego, nieprzytłaczającego planera imprez i rezerwacji sprzętu.
- **Burza mózgów z AI (Faza Analityczna)**:
  - Zamiast nielubianego, sztywnego 2-kolumnowego koszyka, AI proponuje 2–3 różne podejścia do UX (np. wieloetapowy kreator typu Wizard, interaktywny planer modułowy, układ kartowy, szuflada podsumowania itp.).
  - Użytkownik wybiera najwygodniejszy wariant, który następnie wdrażamy na danych mockData.
- **Niezmienna logika domenowa**:
  - Rezerwacja w pełnych skrzyniach diody (osobno moduły całe i połówki).
  - Automatyczny dobór krat i reguła +1m dla bramki.
  - Wykrywanie overbookingu na żywo i funkcja `getEffectiveAvailable` przy edycji.

---

### KROK 6: Listy Załadunkowe, Eksporty i Dashboard
- **Cel**: Narzędzia do fizycznej realizacji na hali magazynowej oraz podsumowanie KPI.
- **Listy załadunkowe**:
  - Podgląd WZ z godziną gotowości i uwagami technicznymi.
  - Eksport wektorowego PDF z polskimi znakami (`jspdf` + `jspdf-autotable`).
  - Eksport arkusza kalkulacyjnego Excel (`exceljs`).
- **Pulpit (`/dashboard`)**:
  - Podpięcie danych analitycznych (sprzęt w terenie, alerty braków, aktywne realizacje).

---

### KROK 7: Podpięcie Bazy Danych Supabase (Podmiana Mocków)
- **Cel**: Zastąpienie danych w pamięci trwałą bazą danych PostgreSQL w Supabase.
- **Dlaczego na samym końcu?**
  - Cały interfejs, pola, struktury i formularze są już sprawdzone w boju na żywym ekranie.
  - Generujemy skrypt SQL dokładnie pod działający model.
  - Wdrażamy warstwę `src/services/` (Wzorzec Repozytorium) i podmieniamy stan lokalny na `TanStack Query`. Zero niespodzianek, zero mozolnych migracji w trakcie wymyślania UI!

---

## 3. Zasada Przenośności (Jak bezboleśnie zmienić bazę danych w przyszłości?)

Aplikacja stosuje **Wzorzec Repozytorium (Repository Pattern)**:
1. Komponenty UI **nigdy** nie wywołują bezpośrednio `supabase.from('equipment')`.
2. Komponenty korzystają wyłącznie z funkcji w `src/services/` (np. `getEquipment()`, `createJob()`, `updateStock()`).
3. Jeśli za rok zechcesz zmienić Supabase na PostgreSQL na własnym serwerze (np. przez Prisma lub Drizzle) – **podmieniasz tylko implementację w katalogu `src/services/`**. Cały interfejs, hooki Zustand, kalkulatory i walidacje pozostają w 100% nienaruszone.
