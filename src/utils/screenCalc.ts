/**
 * screenCalc.ts – Silnik obliczeniowy ekranów LED
 * 100% czyste funkcje, zero zależności frameworkowych.
 */

export type ScreenMatrixMode = 'hybrid' | 'full_only' | 'half_only';

export interface ScreenCalcInput {
  widthM: number;         // Szerokość ekranu w metrach
  heightM: number;        // Wysokość ekranu w metrach
  cabinetWidthCm: number; // Szerokość kabinetu w cm (np. 50)
  cabinetHeightCm: number;// Wysokość pełnego kabinetu w cm (np. 100)
  halfHeightCm: number;   // Wysokość połówki w cm (np. 50)
  cabinetsPerCaseFull: number; // Klocków na skrzynię – pełne
  cabinetsPerCaseHalf: number; // Klocków na skrzynię – połówki
  hangingBarLengthM?: number;  // Długość jednej belki (default: 0.5m)
  matrixMode?: ScreenMatrixMode; // Tryb budowy: 'hybrid' | 'full_only' | 'half_only'
}

export interface ScreenCalcResult {
  // Siatka
  columns: number;
  fullRows: number;
  halfRows: number;

  // Kabinety
  fullCabinets: number;
  halfCabinets: number;

  // Skrzynie (zaokrąglone w górę – kluczowa reguła domenowa)
  casesFullNeeded: number;
  casesHalfNeeded: number;
  casesTotalNeeded: number;

  // Powierzchnia i belki
  areaSqM: number;
  hangingBarsNeeded: number;

  // Diagnostyka
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
  } = input;

  const cabinetWidthM = cabinetWidthCm / 100;
  const cabinetHeightM = cabinetHeightCm / 100;
  const halfHeightM = halfHeightCm / 100;

  // Liczba kolumn (oś X)
  const columns = Math.max(1, Math.round(widthM / cabinetWidthM));

  let fullRows = 0;
  let halfRows = 0;

  if (matrixMode === 'half_only') {
    // Cały ekran zbudowany z małych modułów (np. 50x50)
    fullRows = 0;
    halfRows = Math.max(1, Math.round(heightM / halfHeightM));
  } else if (matrixMode === 'full_only') {
    // Tylko moduły pełne (np. 50x100), zaokrąglamy rzędy do pełnych metrów
    fullRows = Math.max(1, Math.round(heightM / cabinetHeightM));
    halfRows = 0;
  } else {
    // Hybryda: pełne rzędy 100cm + opcjonalny 1 rząd połówki 50cm
    fullRows = Math.floor(heightM / cabinetHeightM);
    const remainder = Math.round((heightM - fullRows * cabinetHeightM) * 100) / 100;
    halfRows = remainder >= halfHeightM - 0.001 ? 1 : 0;
    if (fullRows === 0 && halfRows === 0) {
      fullRows = 1; // Zabezpieczenie minimalnego rozmiaru
    }
  }

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

  return {
    columns,
    fullRows,
    halfRows,
    fullCabinets,
    halfCabinets,
    casesFullNeeded,
    casesHalfNeeded,
    casesTotalNeeded,
    areaSqM,
    hangingBarsNeeded,
    matrixMode,
    isHybrid: fullRows > 0 && halfRows > 0,
    widthM: actualWidthM,
    heightM: actualHeightM,
  };
}

/**
 * Zwraca czytelny raport tekstowy dla debugowania i logów.
 */
export function formatScreenReport(r: ScreenCalcResult): string {
  const lines = [
    `Ekran: ${r.widthM}m × ${r.heightM}m (${r.areaSqM} m²) [Tryb: ${r.matrixMode}]`,
    `Siatka: ${r.columns} kol. × (${r.fullRows} rz. pełnych + ${r.halfRows} rz. połówek)`,
    `Kabinety: ${r.fullCabinets} pełnych + ${r.halfCabinets} połówek`,
    `Skrzynie pełne:  ceil(${r.fullCabinets} / cab/case) = ${r.casesFullNeeded} skrzyń`,
    `Skrzynie połówki: ceil(${r.halfCabinets} / cab/case) = ${r.casesHalfNeeded} skrzyń`,
    `Razem skrzyń: ${r.casesTotalNeeded}`,
    `Belki zawiesia: ${r.hangingBarsNeeded} szt.`,
  ];
  return lines.join('\n');
}
