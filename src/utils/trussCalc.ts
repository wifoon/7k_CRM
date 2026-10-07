/**
 * trussCalc.ts – Silnik obliczeniowy kratownic i bramek
 * 100% czyste funkcje, zero zależności frameworkowych.
 * Reguły domenowe są niezmienne – patrz PROJECT_OVERVIEW.md sekcja D & E.
 */

// Dostępne odcinki krat w metrach (posortowane malejąco – klucz zachłanności)
export const TRUSS_SECTIONS = [2.0, 1.5, 1.0, 0.5] as const;
export type TrussSection = (typeof TRUSS_SECTIONS)[number];

// Przerwa bramki nad ekranem (na czapkę wciągarki, zawiesia i bufor)
export const GOALPOST_HEIGHT_MARGIN_M = 1.0;

export type HoistType = 'manual' | 'electric';

export interface TrussBeam {
  sections: TrussSection[];  // Lista odcinków
  totalM: number;            // Łączna długość [m]
  jointsCount: number;       // Liczba złączy (sections.length - 1)
}

export interface GoalpostResult {
  beam: TrussBeam;            // Belka pozioma (= szerokość ekranu)
  posts: TrussBeam & {        // Słupy pionowe (2 szt.)
    heightM: number;          // Obliczona wysokość słupa
    screenHeightM: number;    // Wysokość ekranu
    marginM: number;          // Zapas ponad ekranem (+1m reguła)
  };
  accessories: GoalpostAccessories;
}

export interface GoalpostAccessories {
  bases: number;         // Bazy / Wózki stalowe
  caps: number;          // Czapki głowicy wciągarki
  hockeys: number;       // Zastrzały "hokej"
  straps5T: number;      // Odciągi pasowe 5T
  hoists: number;        // Wciągarki (ręczne lub elektryczne)
  hoistType: HoistType;
}

/**
 * Zachłanny solver odcinków kratownicy.
 * Minimalizuje liczbę złączy preferując jak najdłuższe odcinki.
 * Nigdy nie zwróci odcinka krótszego niż 0.5m.
 */
export function solveTrussSections(targetM: number): TrussBeam {
  const TOLERANCE = 0.001;
  let remaining = Math.round(targetM * 1000) / 1000;
  const sections: TrussSection[] = [];

  for (const section of TRUSS_SECTIONS) {
    while (remaining >= section - TOLERANCE) {
      sections.push(section);
      remaining = Math.round((remaining - section) * 1000) / 1000;
    }
  }

  // Zabezpieczenie – jeśli solver nie pokrył całości (błąd danych)
  if (remaining > TOLERANCE) {
    throw new Error(
      `Nie można złożyć belki ${targetM}m z dostępnych odcinków. Reszta: ${remaining}m`
    );
  }

  const totalM = sections.reduce((sum, s) => sum + s, 0);

  return {
    sections,
    totalM: Math.round(totalM * 1000) / 1000,
    jointsCount: Math.max(0, sections.length - 1),
  };
}

/**
 * Pełne obliczenie bramki (goalpost):
 * - belka pozioma na wysokość ekranu
 * - dwa słupy pionowe z regułą +1m
 * - stały osprzęt
 */
export function solveGoalpost(
  screenWidthM: number,
  screenHeightM: number,
  hoistType: HoistType = 'manual',
  customBeamWidthM?: number,
  customPostHeightM?: number,
): GoalpostResult {
  // Belka pozioma: niestandardowa lub domyślnie równa szerokości ekranu
  const beamWidth = customBeamWidthM !== undefined && customBeamWidthM > 0 ? customBeamWidthM : screenWidthM;
  const beam = solveTrussSections(beamWidth);

  // Reguła bramki: słupy MUSZĄ być wyższe o co najmniej 1.0m (lub niestandardowa wysokość)
  const defaultPostHeightM = Math.round((screenHeightM + GOALPOST_HEIGHT_MARGIN_M) * 10) / 10;
  const postHeightM = customPostHeightM !== undefined && customPostHeightM > 0 ? customPostHeightM : defaultPostHeightM;
  const postSections = solveTrussSections(postHeightM);

  const posts = {
    ...postSections,
    heightM: postHeightM,
    screenHeightM,
    marginM: Math.max(0, Math.round((postHeightM - screenHeightM) * 10) / 10),
  };

  // Stały osprzęt dla bramki dwusłupowej (2 słupy)
  const accessories: GoalpostAccessories = {
    bases: 2,      // Wózki / Bazy stalowe
    caps: 2,       // Czapki głowicy na szczycie słupów
    hockeys: 4,    // Zastrzały hokej (2 na każdy słup)
    straps5T: 4,   // Odciągi pasowe 5T (2 na każdy słup)
    hoists: 2,     // Jedna wciągarka na każdy słup
    hoistType,
  };

  return { beam, posts, accessories };
}

/**
 * Zwraca czytelny raport tekstowy dla debugowania i logów.
 */
export function formatGoalpostReport(r: GoalpostResult): string {
  const { beam, posts, accessories } = r;

  const formatSections = (b: TrussBeam) =>
    `[${b.sections.map(s => `${s}m`).join(' + ')}] = ${b.totalM}m (${b.jointsCount} złącz)`;

  const lines = [
    `--- BRAMKA ---`,
    `Belka pozioma (${beam.totalM}m): ${formatSections(beam)}`,
    `Słupy pionowe (${posts.heightM}m): ${formatSections(posts)}`,
    `  → Ekran: ${posts.screenHeightM}m + zapas: ${posts.marginM}m = ${posts.heightM}m`,
    `--- OSPRZĘT ---`,
    `  Bazy/Wózki:        ${accessories.bases} szt.`,
    `  Czapki:            ${accessories.caps} szt.`,
    `  Zastrzały hokej:   ${accessories.hockeys} szt.`,
    `  Odciągi 5T:        ${accessories.straps5T} szt.`,
    `  Wciągarki (${accessories.hoistType === 'manual' ? 'ręczne' : 'elektryczne'}): ${accessories.hoists} szt.`,
  ];
  return lines.join('\n');
}
