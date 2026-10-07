/**
 * jobCalc.ts – Zliczanie zapotrzebowania magazynowego (BOM) zlecenia
 * Czyste funkcje łączące silniki screenCalc, trussCalc oraz stan magazynu.
 */

import { screenToCases } from './screenCalc';
import { solveGoalpost, solveTrussSections } from './trussCalc';
import {
  Job,
  LedSystem,
  ConstructionMapping,
  MountingPreset,
  EquipmentItem,
} from '@/lib/mockData';

export interface BOMItem {
  equipmentId: string;
  equipmentName: string;
  categoryId: string;
  unit: string;
  requiredQty: number;
  availableQty: number;          // Stan aktualnie wolny w magazynie
  effectiveAvailableQty: number; // Stan wolny + sprzęt zarezerwowany przez TO zlecenie
  isOverbooked: boolean;         // Czy brakuje w magazynie
  sources: string[];             // Skąd wynika to zapotrzebowanie (np. "Ekran Główny (Dioda)")
}

export interface JobCalculationSummary {
  items: BOMItem[];
  totalCases: number;
  totalTrussM: number;
  totalScreens: number;
  totalHoists: number;
  hasOverbooking: boolean;
  overbookedCount: number;
}

/**
 * Oblicza pełne zestawienie sprzętu na realizację (Bill of Materials)
 * z inteligentną ochroną przed fałszywym overbookingiem podczas edycji.
 */
export function calculateJobBOM(params: {
  job: Job;
  ledSystems: LedSystem[];
  constructionMapping: ConstructionMapping;
  mountingPresets: MountingPreset[];
  inventory: EquipmentItem[];
  existingJobBeforeEdit?: Job | null;
}): JobCalculationSummary {
  const { job, ledSystems, constructionMapping, mountingPresets, inventory, existingJobBeforeEdit } = params;

  // Mapa zapotrzebowania: equipmentId -> { requiredQty, sources }
  const demandMap = new Map<string, { qty: number; sources: string[] }>();

  const addDemand = (equipmentId: string | undefined, qty: number, source: string) => {
    if (!equipmentId || qty <= 0) return;
    const current = demandMap.get(equipmentId) || { qty: 0, sources: [] };
    current.qty += qty;
    if (!current.sources.includes(source)) {
      current.sources.push(source);
    }
    demandMap.set(equipmentId, current);
  };

  let totalCases = 0;
  let totalTrussM = 0;
  let totalHoists = 0;

  // 1. Przelicz ekrany LED i konstrukcje
  job.screens.forEach((screen) => {
    const system = ledSystems.find((s) => s.id === screen.systemId);
    if (!system) return;

    const fullItem = inventory.find((i) => i.id === system.fullItemId);
    const halfItem = system.halfItemId ? inventory.find((i) => i.id === system.halfItemId) : null;

    if (!fullItem) return;

    const fullW = fullItem.attributes?.widthCm || 50;
    const fullH = fullItem.attributes?.heightCm || 100;
    const halfH = halfItem?.attributes?.heightCm || 50;
    const cabPerCaseFull = fullItem.attributes?.cabinetsPerCase || 8;
    const cabPerCaseHalf = halfItem?.attributes?.cabinetsPerCase || 8;

    // Obliczenia diody LED
    const screenCalc = screenToCases({
      widthM: screen.widthM,
      heightM: screen.heightM,
      cabinetWidthCm: fullW,
      cabinetHeightCm: fullH,
      halfHeightCm: halfH,
      cabinetsPerCaseFull: cabPerCaseFull,
      cabinetsPerCaseHalf: cabPerCaseHalf,
      hangingBarLengthM: 0.5,
      matrixMode: screen.matrixMode || 'hybrid',
    });

    totalCases += screenCalc.casesTotalNeeded;

    // Dioda pełna
    if (screenCalc.casesFullNeeded > 0) {
      addDemand(
        fullItem.id,
        screenCalc.casesFullNeeded,
        `${screen.name} (Dioda pełna: ${screenCalc.fullCabinets} szt.)`
      );
    }

    // Dioda połówka
    if (screenCalc.casesHalfNeeded > 0 && halfItem) {
      addDemand(
        halfItem.id,
        screenCalc.casesHalfNeeded,
        `${screen.name} (Dioda połówki: ${screenCalc.halfCabinets} szt.)`
      );
    }

    // Hanging bar – automatycznie i wyłącznie dla bramki oraz kreski (nie dla eLek ani braku)
    const needsBars = screen.mountingType === 'bramka' || screen.mountingType === 'kreska';

    if (screenCalc.hangingBarsNeeded > 0 && system.hangingBarItemId && needsBars) {
      addDemand(
        system.hangingBarItemId,
        screenCalc.hangingBarsNeeded,
        `${screen.name} (Belki zawiesia: pokrycie ${screen.widthM}m ekranu)`
      );
    }

    // 2. Konstrukcje nośne
    if (screen.mountingType === 'bramka') {
      const gp = solveGoalpost(
        screen.widthM,
        screen.heightM,
        screen.hoistType || 'manual',
        screen.customTrussWidthM,
        screen.customTrussHeightM
      );
      totalTrussM += gp.beam.totalM + gp.posts.totalM * 2;
      totalHoists += gp.accessories.hoists;

      // Zliczanie odcinków krat
      const sectionCounts: Record<number, number> = { 2.0: 0, 1.5: 0, 1.0: 0, 0.5: 0 };
      gp.beam.sections.forEach((s) => (sectionCounts[s] = (sectionCounts[s] || 0) + 1));
      // 2 słupy
      gp.posts.sections.forEach((s) => (sectionCounts[s] = (sectionCounts[s] || 0) + 2));

      if (sectionCounts[2.0]) addDemand(constructionMapping.truss200Id, sectionCounts[2.0], `${screen.name} (Krata 2.0m)`);
      if (sectionCounts[1.5]) addDemand(constructionMapping.truss150Id, sectionCounts[1.5], `${screen.name} (Krata 1.5m)`);
      if (sectionCounts[1.0]) addDemand(constructionMapping.truss100Id, sectionCounts[1.0], `${screen.name} (Krata 1.0m)`);
      if (sectionCounts[0.5]) addDemand(constructionMapping.truss050Id, sectionCounts[0.5], `${screen.name} (Krata 0.5m)`);

      // Wciągarki dla bramki (zawsze 2 szt. na słupy bramki)
      const hoistId = screen.hoistType === 'electric'
        ? (constructionMapping.hoistElectricId || constructionMapping.hoistManualId)
        : constructionMapping.hoistManualId;
      addDemand(hoistId, gp.accessories.hoists, `${screen.name} (Wciągarki bramki)`);

      // Presety stałego osprzętu bramki
      const preset = mountingPresets.find((p) => p.type === 'bramka');
      preset?.items.forEach((item) => {
        const match = inventory.find((inv) => inv.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
        if (match) {
          addDemand(match.id, item.qty, `${screen.name} (Osprzęt bramki)`);
        }
      });
    } else if (screen.mountingType === 'kreska') {
      const beamWidth = screen.customTrussWidthM || screen.widthM;
      const beam = solveTrussSections(beamWidth);
      totalTrussM += beam.totalM;

      const sectionCounts: Record<number, number> = { 2.0: 0, 1.5: 0, 1.0: 0, 0.5: 0 };
      beam.sections.forEach((s) => (sectionCounts[s] = (sectionCounts[s] || 0) + 1));

      if (sectionCounts[2.0]) addDemand(constructionMapping.truss200Id, sectionCounts[2.0], `${screen.name} (Krata 2.0m belka)`);
      if (sectionCounts[1.5]) addDemand(constructionMapping.truss150Id, sectionCounts[1.5], `${screen.name} (Krata 1.5m belka)`);
      if (sectionCounts[1.0]) addDemand(constructionMapping.truss100Id, sectionCounts[1.0], `${screen.name} (Krata 1.0m belka)`);
      if (sectionCounts[0.5]) addDemand(constructionMapping.truss050Id, sectionCounts[0.5], `${screen.name} (Krata 0.5m belka)`);

      // Wciągarki dla kreski: TYLKO gdy są nasze z magazynu
      if (screen.hoistSource === 'warehouse') {
        const qty = screen.hoistQty || 2;
        totalHoists += qty;
        const hoistId = screen.hoistType === 'electric'
          ? (constructionMapping.hoistElectricId || constructionMapping.hoistManualId)
          : constructionMapping.hoistManualId;
        addDemand(hoistId, qty, `${screen.name} (Wciągarki kreski)`);

        // Ile wciągarek = tyle steelflexów!
        if (constructionMapping.steelflexId) {
          addDemand(constructionMapping.steelflexId, qty, `${screen.name} (Zawiesia Steelflex do wciągarek)`);
        }
        if (constructionMapping.shackleId) {
          addDemand(constructionMapping.shackleId, qty * 2, `${screen.name} (Szekle atestowane do wciągarek)`);
        }
      }

      const preset = mountingPresets.find((p) => p.type === 'kreska');
      preset?.items.forEach((item) => {
        const match = inventory.find((inv) => inv.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]));
        if (match) {
          addDemand(match.id, item.qty, `${screen.name} (Osprzęt belki)`);
        }
      });
    }

    // Blachy montażowe i usztywniające:
    // 1. eLki: ZAWSZE automatycznie do złapania e-lek do kabinetów
    // 2. Bramka / Kreska: gdy zaznaczono usePlates (wzmocnienie w plenerze)
    if (constructionMapping.platesId) {
      const cols = Math.max(1, Math.round(screen.widthM / 0.5));
      const fullRows = Math.max(1, Math.floor(screen.heightM / 1.0));

      if (screen.mountingType === 'elki') {
        const platesQty = Math.max(4, Math.ceil(cols / 2) * 2);
        addDemand(constructionMapping.platesId, platesQty, `${screen.name} (Blachy montażowe do e-lek)`);
      } else if ((screen.mountingType === 'bramka' || screen.mountingType === 'kreska') && screen.usePlates) {
        const approxPlates = Math.max(4, (cols - 1) * Math.max(1, fullRows - 1));
        addDemand(constructionMapping.platesId, approxPlates, `${screen.name} (Blachy usztywniające naroża)`);
      }
    }
  });

  // 3. Dodatkowy sprzęt ręczny
  job.customItems.forEach((ci) => {
    addDemand(ci.equipmentId, ci.qty, 'Sprzęt dodatkowy');
  });

  // 4. Oblicz wcześniej zarezerwowane ilości tego zlecenia (dla edycji bez overbookingu)
  const existingJobDemand = new Map<string, number>();
  if (existingJobBeforeEdit && existingJobBeforeEdit.id === job.id) {
    const prevBOM = calculateJobBOM({
      job: existingJobBeforeEdit,
      ledSystems,
      constructionMapping,
      mountingPresets,
      inventory,
      existingJobBeforeEdit: null,
    });
    prevBOM.items.forEach((item) => {
      existingJobDemand.set(item.equipmentId, item.requiredQty);
    });
  }

  // 5. Złóż ostateczną listę pozycji z weryfikacją dostępności
  const items: BOMItem[] = [];
  let overbookedCount = 0;

  demandMap.forEach((val, eqId) => {
    const invItem = inventory.find((i) => i.id === eqId);
    if (!invItem) return;

    const previouslyReservedByThisJob = existingJobDemand.get(eqId) || 0;
    const effectiveAvailableQty = invItem.availableQty + previouslyReservedByThisJob;
    const isOverbooked = val.qty > effectiveAvailableQty;

    if (isOverbooked) {
      overbookedCount++;
    }

    items.push({
      equipmentId: eqId,
      equipmentName: invItem.name,
      categoryId: invItem.categoryId,
      unit: invItem.unit,
      requiredQty: val.qty,
      availableQty: invItem.availableQty,
      effectiveAvailableQty,
      isOverbooked,
      sources: val.sources,
    });
  });

  return {
    items,
    totalCases,
    totalTrussM,
    totalScreens: job.screens.length,
    totalHoists,
    hasOverbooking: overbookedCount > 0,
    overbookedCount,
  };
}
