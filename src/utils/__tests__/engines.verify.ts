/**
 * Skrypt weryfikacyjny silników matematycznych 7K LED WMS
 * Uruchom: npx tsx src/utils/__tests__/engines.verify.ts
 *
 * Scenariusz testowy: Ekran Dicolor P3.9 6m × 3.5m, bramka z wciągarkami ręcznymi
 */

import { screenToCases, formatScreenReport } from '../screenCalc';
import { solveGoalpost, formatGoalpostReport } from '../trussCalc';

// ─── KONFIGURACJA TESTU ───────────────────────────────────────────────────────

const SCREEN_INPUT = {
  widthM: 6,
  heightM: 3.5,
  cabinetWidthCm: 50,
  cabinetHeightCm: 100,
  halfHeightCm: 50,
  cabinetsPerCaseFull: 8,
  cabinetsPerCaseHalf: 8,
  hangingBarLengthM: 0.5,
};

// ─── POMOCNIK ASERCJI ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(label: string, actual: unknown, expected: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`    Oczekiwano: ${JSON.stringify(expected)}`);
    console.error(`    Otrzymano:  ${JSON.stringify(actual)}`);
    failed++;
  }
}

// ─── TEST 1: SILNIK EKRANÓW ───────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════');
console.log('  7K LED WMS – Weryfikacja Silników Matematycznych');
console.log('══════════════════════════════════════════════\n');

console.log('📺  TEST 1: screenToCases – Dicolor P3.9, 6 × 3.5m\n');
const screen = screenToCases(SCREEN_INPUT);
console.log(formatScreenReport(screen));
console.log('');

assert('columns = 12',           screen.columns,           12);
assert('fullRows = 3',           screen.fullRows,           3);
assert('halfRows = 1',           screen.halfRows,           1);
assert('fullCabinets = 36',      screen.fullCabinets,      36);
assert('halfCabinets = 12',      screen.halfCabinets,      12);
assert('casesFullNeeded = 5',    screen.casesFullNeeded,    5);   // ceil(36/8) = 5
assert('casesHalfNeeded = 2',    screen.casesHalfNeeded,    2);   // ceil(12/8) = 2
assert('casesTotalNeeded = 7',   screen.casesTotalNeeded,   7);
assert('areaSqM = 21',           screen.areaSqM,           21);
assert('hangingBarsNeeded = 12', screen.hangingBarsNeeded, 12);   // 6m / 0.5m
assert('isHybrid = true',        screen.isHybrid,           true);

// ─── TEST 2: SILNIK KRATOWNIC ─────────────────────────────────────────────────

console.log('\n🏗️   TEST 2: solveGoalpost – Bramka 6m × 3.5m (wciągarki ręczne)\n');
const goalpost = solveGoalpost(6, 3.5, 'manual');
console.log(formatGoalpostReport(goalpost));
console.log('');

assert('beam.totalM = 6',               goalpost.beam.totalM,           6);
assert('beam.sections = [2,2,2]',       goalpost.beam.sections,         [2, 2, 2]);
assert('beam.jointsCount = 2',          goalpost.beam.jointsCount,       2);
assert('posts.heightM = 4.5',           goalpost.posts.heightM,         4.5);
assert('posts.sections = [2,2,0.5]',    goalpost.posts.sections,        [2, 2, 0.5]);
assert('posts.jointsCount = 2',         goalpost.posts.jointsCount,      2);
assert('accessories.bases = 2',         goalpost.accessories.bases,      2);
assert('accessories.caps = 2',          goalpost.accessories.caps,       2);
assert('accessories.hockeys = 4',       goalpost.accessories.hockeys,    4);
assert('accessories.straps5T = 4',      goalpost.accessories.straps5T,   4);
assert('accessories.hoists = 2',        goalpost.accessories.hoists,     2);
assert('accessories.hoistType = manual',goalpost.accessories.hoistType, 'manual');

// ─── TEST 3: SOLVER EDGE CASES ────────────────────────────────────────────────

console.log('\n🔢  TEST 3: solveTrussSections – Przypadki brzegowe\n');
import { solveTrussSections } from '../trussCalc';

const t45 = solveTrussSections(4.5);
assert('4.5m = [2, 2, 0.5]',   t45.sections, [2, 2, 0.5]);

const t4 = solveTrussSections(4.0);
assert('4.0m = [2, 2]',        t4.sections,  [2, 2]);

const t35 = solveTrussSections(3.5);
assert('3.5m = [2, 1.5]',      t35.sections, [2, 1.5]);

const t3 = solveTrussSections(3.0);
assert('3.0m = [2, 1]',        t3.sections,  [2, 1]);

const t25 = solveTrussSections(2.5);
assert('2.5m = [2, 0.5]',      t25.sections, [2, 0.5]);

const t15 = solveTrussSections(1.5);
assert('1.5m = [1.5]',         t15.sections, [1.5]);

const t05 = solveTrussSections(0.5);
assert('0.5m = [0.5]',         t05.sections, [0.5]);

// ─── TEST 4: Ekran 4×2.5m (sprawdzenie połówek) ──────────────────────────────

console.log('\n📺  TEST 4: screenToCases – Ekran 4 × 2.5m\n');
const screen2 = screenToCases({ ...SCREEN_INPUT, widthM: 4, heightM: 2.5 });
console.log(formatScreenReport(screen2));
console.log('');

assert('columns = 8',           screen2.columns,           8);
assert('fullRows = 2',          screen2.fullRows,           2);
assert('halfRows = 1',          screen2.halfRows,           1);
assert('fullCabinets = 16',     screen2.fullCabinets,      16);
assert('halfCabinets = 8',      screen2.halfCabinets,       8);
assert('casesFullNeeded = 2',   screen2.casesFullNeeded,    2);  // ceil(16/8) = 2
assert('casesHalfNeeded = 1',   screen2.casesHalfNeeded,    1);  // ceil(8/8) = 1
assert('areaSqM = 10',          screen2.areaSqM,           10);
assert('hangingBarsNeeded = 8', screen2.hangingBarsNeeded,  8);  // 4m / 0.5m

// ─── PODSUMOWANIE ─────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════');
console.log(`  Wynik: ${passed} ✓ przeszło  |  ${failed} ✗ nie przeszło`);
console.log('══════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
}
