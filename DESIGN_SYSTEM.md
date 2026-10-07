# 7K LED WMS – Design System & Standard Typografii

Dokument określa wzorzec proporcji czcionek (Type Scale), kolorystyki i hierarchii wizualnej wyznaczony przez ekran **Pulpitu (`/dashboard`)**. Wszystkie widoki (Magazyn, Roboty, Ustawienia) muszą stosować poniższy kanon.

---

## 1. Skala Typografii (Type Scale & Ratio)

| Rola w Interfejsie | Klasa Tailwind | Rozmiar / Waga | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **Główny Tytuł Strony** | `text-2xl font-bold tracking-tight text-white` | 24px / Bold | Nagłówek widoku (`Pulpit`, `Magazyn`, `Roboty`) |
| **Podtytuł / Opis** | `text-sm text-slate-400` | 14px / Regular | Opis celu sekcji pod tytułem |
| **Tytuł Sekcji / Karty** | `text-lg font-bold tracking-tight text-white` | 18px / Bold | Nagłówki paneli, tabel, sekcji |
| **Wartość KPI (Duża)** | `text-4xl font-bold font-mono tabular-nums` | 36px / Bold Mono | Główne cyfry na kartach dashboardu |
| **Wartość KPI (Wstęga/Kompakt)** | `text-2xl font-bold font-mono tabular-nums` | 24px / Bold Mono | Liczby we wstędze operacyjnej magazynu |
| **Etykieta Metryki (Label)** | `text-sm font-medium text-slate-300` | 14px / Medium | Opis wskaźnika KPI (np. "Sprzęt w terenie") |
| **Podpis Metryki (Subtext)** | `text-xs text-slate-500` lub `text-sm text-slate-500` | 12-14px / Regular | Kontekst (np. "Fizycznie dostępne") |
| **Nazwa Sprzętu / Wiersza** | `text-sm font-semibold text-white` | 14px / SemiBold | Tytuł pozycji w tabeli magazynowej |
| **Kod SKU / Tag Techniczny** | `text-xs font-mono text-slate-400` | 12px / Medium Mono | Etykieta SKU w dyskretnym obrysie |
| **Nagłówki Kolumn Tabeli** | `text-xs font-semibold text-slate-400 uppercase tracking-wider` | 12px / SemiBold | Etykiety kolumn sortowalnych w tabeli |
| **Wartości Stanu (Ułamek)** | `text-sm font-mono font-bold` / `text-xs text-slate-400` | 14px / 12px Mono | Dostępne / Razem (np. **18** / 24 case) |
| **Badge / Pigułka Statusu** | `text-xs font-semibold px-2.5 py-1` | 12px / SemiBold | Status (Dostępny, Serwis, Niski stan) |

---

## 2. Standard Ikonografii i Elementów Akcji

- **Ikony w wierszach tabeli**: Minimalny rozmiar to `size={16}` (do `size={18}` dla kluczowych akcji). Przyciski z `p-1.5` lub `p-2` dla wygodnego klikania.
- **Ikony w metrykach operacyjnych**: `size={18}` w kontenerze `w-9 h-9` lub `w-10 h-10` z `rounded-xl`.
- **Wskaźnik postępu (Stock Bar)**: Wysokość `h-1.5` lub `h-2` dla wyraźnego kontrastu.

---

## 3. Kompozycja i Oddech (Breathing Room)

- **Marginesy boczne**: Widok roboczy magazynu powinien zachowywać estetyczny oddech od krawędzi okna (`p-6` lub `px-6 py-6`).
- **Separacja warstw**:
  - Tło robocze (Canvas): `#090D16` (Dark Graphite).
  - Pasek metryk / Kontener tabeli: `#121824` / `#111622` z obramowaniem `border border-slate-800/80`.
  - Wiersze tabeli nie zlewają się w jedną plamę – stosujemy subtelne linie `border-b border-slate-800/60`, z wyraźnym nagłówkiem `bg-[#0c1017]` i hoverem `hover:bg-slate-800/40`.
