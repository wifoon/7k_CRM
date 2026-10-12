/**
 * screenCalc.ts – Silnik obliczeniowy ekranów LED
 * 100% czyste funkcje, zero zależności frameworkowych.
 */

export type ScreenMatrixMode = 'hybrid' | 'full_only' | 'half_only';
export type CabinetRowType = 'full' | 'half';

export interface ScreenCalcInput {
  widthM: number;
  heightM: number;
  cabinetWidthCm: number;
  cabinetHeightCm: number;
  halfHeightCm: number;
  cabinetsPerCaseFull: number;
  cabinetsPerCaseHalf: number;
  hangingBarLengthM?: number;
  matrixMode?: ScreenMatrixMode;
  customRows?: CabinetRowType[];
  resolutionX?: number;
  resolutionYFull?: number;
  resolutionYHalf?: number;
}

export interface ScreenCalcResult {
  columns: number;
  fullRows: number;
  halfRows: number;
  totalRows: number;
  rows: CabinetRowType[];
  fullCabinets: number;
  halfCabinets: number;
  reinforcementPlates: number;
  casesFullNeeded: number;
  casesHalfNeeded: number;
  casesTotalNeeded: number;
  areaSqM: number;
  hangingBarsNeeded: number;
  pixelWidth: number;
  pixelHeight: number;
  matrixMode: ScreenMatrixMode;
  isHybrid: boolean;
  widthM: number;
  heightM: number;
}

/**
 * Oblicza siatkę kabinetów, zapotrzebowanie na skrzynie i belki zawiesia.
 * Obsługuje: Hybrydę (100+50cm), Tylko pełne (100cm) oraz Tylko połówki (50cm).
 * Reguła: operujemy na SKRZYNIACH, nigdy luzem. Math.ceil jest absolutnie kluczowy.
 */
export function screenToCases(input: ScreenCalcInput): ScreenCalcResult {
  const {
    widthM,
    heightM,
    cabinetWidthCm,
    cabinetHeightCm,
    halfHeightCm,
    cabinetsPerCaseFull,
    cabinetsPerCaseHalf,
    hangingBarLengthM = 0.5,
    matrixMode = 'hybrid',
    customRows,
  } = input;

  const cabinetWidthM = cabinetWidthCm / 100;
  const cabinetHeightM = cabinetHeightCm / 100;
  const halfHeightM = halfHeightCm / 100;

  // Liczba kolumn (oś X)
  const columns = Math.max(1, Math.round(widthM / cabinetWidthM));

  // Domyślny lub zdefiniowany przez użytkownika rozkład rzędów
  const rows: CabinetRowType[] =
    customRows && customRows.length > 0
      ? [...customRows]
      : generateDefaultRows(heightM, cabinetHeightM, halfHeightM, matrixMode);

  const fullRows = rows.filter((r) => r === "full").length;
  const halfRows = rows.filter((r) => r === "half").length;

  // Łączna liczba klocków
  const fullCabinets = columns * fullRows;
  const halfCabinets = columns * halfRows;

  // Zaokrąglanie w górę do pełnych skrzyń
  const casesFullNeeded = fullCabinets > 0 ? Math.ceil(fullCabinets / cabinetsPerCaseFull) : 0;
  const casesHalfNeeded = halfCabinets > 0 ? Math.ceil(halfCabinets / cabinetsPerCaseHalf) : 0;
  const casesTotalNeeded = casesFullNeeded + casesHalfNeeded;

  // Rzeczywista powierzchnia
  const actualHeightM = fullRows * cabinetHeightM + halfRows * halfHeightM;
  const actualWidthM = columns * cabinetWidthM;
  const areaSqM = Math.round(actualWidthM * actualHeightM * 100) / 100;

  // Belki zawiesia: 1 belka co hangingBarLengthM szerokości
  const hangingBarsNeeded = Math.ceil(actualWidthM / hangingBarLengthM);

  const totalRows = rows.length;
  const reinforcementPlates = calculateReinforcementPlates(columns, totalRows);

  // Rozdzielczość w pikselach
  const resX = input.resolutionX ?? 128;
  const resYFull = input.resolutionYFull ?? 256;
  const resYHalf = input.resolutionYHalf ?? 128;
  const pixelWidth = columns * resX;
  const pixelHeight = fullRows * resYFull + halfRows * resYHalf;

  return {
    columns,
    fullRows,
    halfRows,
    totalRows,
    rows,
    fullCabinets,
    halfCabinets,
    reinforcementPlates,
    casesFullNeeded,
    casesHalfNeeded,
    casesTotalNeeded,
    areaSqM,
    hangingBarsNeeded,
    pixelWidth,
    pixelHeight,
    matrixMode,
    isHybrid: fullRows > 0 && halfRows > 0,
    widthM: actualWidthM,
    heightM: actualHeightM,
  };
}

/**
 * Generuje domyślny układ rzędów na podstawie wysokości i trybu matrycy.
 */
export function generateDefaultRows(
  heightM: number,
  cabinetHeightM = 1.0,
  halfHeightM = 0.5,
  matrixMode: ScreenMatrixMode = "hybrid"
): CabinetRowType[] {
  if (matrixMode === "half_only") {
    return Array<CabinetRowType>(Math.max(1, Math.round(heightM / halfHeightM))).fill("half");
  }
  if (matrixMode === "full_only") {
    return Array<CabinetRowType>(Math.max(1, Math.round(heightM / cabinetHeightM))).fill("full");
  }
  const fullCount = Math.floor(heightM / cabinetHeightM);
  const remainder = Math.round((heightM - fullCount * cabinetHeightM) * 100) / 100;
  const hasHalf = remainder >= halfHeightM - 0.001;
  const list: CabinetRowType[] = Array<CabinetRowType>(Math.max(1, fullCount)).fill("full");
  if (hasHalf) list.push("half");
  return list;
}

/**
 * Inteligentne przełączanie / podział rzędu na płótnie:
 * - Pełny (1.0m) -> dzieli na dwie połówki (0.5m + 0.5m)
 * - Połówka (0.5m) obok innej połówki -> scala w cały (1.0m)
 */
export function toggleRowSplit(rows: CabinetRowType[], idx: number): CabinetRowType[] {
  const target = rows[idx];
  if (!target) return rows;
  const next = [...rows];
  if (target === "full") {
    next.splice(idx, 1, "half", "half");
    return next;
  }
  if (idx + 1 < next.length && next[idx + 1] === "half") {
    next.splice(idx, 2, "full");
    return next;
  }
  if (idx - 1 >= 0 && next[idx - 1] === "half") {
    next.splice(idx - 1, 2, "full");
    return next;
  }
  next[idx] = "full";
  return next;
}

/**
 * Oblicza liczbę blach usztywniających (łączeń krzyżowych / narożnikowych) dla siatki ekranu LED.
 * Zgodnie ze standardem estradowym: blachy montowane są na wewnętrznych skrzyżowaniach 4 naroży modułów.
 * Wzór: (kolumny - 1) * (łączna_liczba_rzędów - 1).
 * Przykład: 6x3.5m (12 kolumn, 3 pełne + 1 połówka = 4 rzędy) -> 11 * 3 = 33 blachy.
 */
export function calculateReinforcementPlates(columns: number, totalRows: number): number {
  if (columns <= 1 || totalRows <= 1) return 0;
  return (columns - 1) * (totalRows - 1);
}

export function formatScreenReport(r: ScreenCalcResult): string {
  return [
    `Ekran: ${r.widthM}m × ${r.heightM}m (${r.areaSqM} m²) [Tryb: ${r.matrixMode}]`,
    `Siatka: ${r.columns} kol. × (${r.fullRows} rz. pełnych + ${r.halfRows} rz. połówek = ${r.totalRows} rzędów)`,
    `Kabinety: ${r.fullCabinets} pełnych + ${r.halfCabinets} połówek`,
    `Skrzynie pełne:  ceil(${r.fullCabinets} / cab/case) = ${r.casesFullNeeded} skrzyń`,
    `Skrzynie połówki: ceil(${r.halfCabinets} / cab/case) = ${r.casesHalfNeeded} skrzyń`,
    `Razem skrzyń: ${r.casesTotalNeeded}`,
    `Belki zawiesia: ${r.hangingBarsNeeded} szt.`,
    `Blachy usztywniające: ${r.reinforcementPlates} szt. (${Math.max(0, r.columns - 1)} × ${Math.max(0, r.totalRows - 1)})`,
  ].join('\n');
}
