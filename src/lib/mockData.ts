export type EquipmentUnit = 'case' | 'szt.' | 'kpl.';
export type EquipmentStatus = 'dostepny' | 'niski_stan' | 'brak' | 'serwis';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  categoryId: string;
  totalQty: number;
  availableQty: number;
  serviceQty: number;
  unit: EquipmentUnit;
  status: EquipmentStatus;
  attributes: {
    cabinetsPerCase?: number;
    widthCm?: number;
    heightCm?: number;
    resolutionX?: number; // Rozdzielczość w poziomie (px)
    resolutionY?: number; // Rozdzielczość w pionie (px)
    lengthM?: number;
    weightKg?: number;
  };
  relations?: {
    halfItemId?: string;
    hangingBarId?: string;
  };
}

export const mockCategories: Category[] = [
  { id: 'led', name: 'Ekrany LED', color: 'purple' },
  { id: 'truss', name: 'Konstrukcje (Truss)', color: 'sky' },
  { id: 'hoist', name: 'Wciągarki', color: 'amber' },
  { id: 'cabling', name: 'Okablowanie', color: 'emerald' },
  { id: 'accessories', name: 'Akcesoria', color: 'slate' },
];


export const mockEquipment: EquipmentItem[] = [
  {
    id: 'eq-led-dic-p39-full',
    name: 'Dicolor P3.9 50x100',
    categoryId: 'led',
    totalQty: 10,
    availableQty: 10,
    serviceQty: 0,
    unit: 'case',
    status: 'dostepny',
    attributes: {
      cabinetsPerCase: 8,
      widthCm: 50,
      heightCm: 100,
      resolutionX: 128,
      resolutionY: 256,
      weightKg: 13,
    },
    relations: {
      halfItemId: 'eq-led-dic-p39-half',
      hangingBarId: 'eq-acc-hbar-dic-50',
    },
  },
  {
    id: 'eq-led-dic-p39-half',
    name: 'Dicolor P3.9 50x50 (Połówka)',
    categoryId: 'led',
    totalQty: 4,
    availableQty: 4,
    serviceQty: 0,
    unit: 'case',
    status: 'dostepny',
    attributes: {
      cabinetsPerCase: 8,
      widthCm: 50,
      heightCm: 50,
      resolutionX: 128,
      resolutionY: 128,
      weightKg: 7.5,
    },
  },
  {
    id: 'eq-truss-q39-200',
    name: 'Kratownica Q39 2.0m',
    categoryId: 'truss',
    totalQty: 24,
    availableQty: 24,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      lengthM: 2.0,
      weightKg: 15,
    },
  },
  {
    id: 'eq-truss-q39-150',
    name: 'Kratownica Q39 1.5m',
    categoryId: 'truss',
    totalQty: 12,
    availableQty: 12,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      lengthM: 1.5,
      weightKg: 12,
    },
  },
  {
    id: 'eq-truss-q39-100',
    name: 'Kratownica Q39 1.0m',
    categoryId: 'truss',
    totalQty: 16,
    availableQty: 16,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      lengthM: 1.0,
      weightKg: 8.5,
    },
  },
  {
    id: 'eq-truss-q39-050',
    name: 'Kratownica Q39 0.5m',
    categoryId: 'truss',
    totalQty: 8,
    availableQty: 8,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      lengthM: 0.5,
      weightKg: 5,
    },
  },
  {
    id: 'eq-hoist-man-1t',
    name: 'Wciągarka Ręczna 1T (Łańcuch 10m)',
    categoryId: 'hoist',
    totalQty: 12,
    availableQty: 12,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 20,
    },
  },
  {
    id: 'eq-acc-hbar-dic-50',
    name: 'Hanging Bar Dicolor 50cm',
    categoryId: 'accessories',
    totalQty: 20,
    availableQty: 20,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 3,
    },
  },
  {
    id: 'eq-hoist-elec-d8',
    name: 'Wciągarka Elektryczna D8+ 500kg',
    categoryId: 'hoist',
    totalQty: 8,
    availableQty: 8,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 28,
    },
  },
  {
    id: 'eq-rig-steelflex-2m',
    name: 'Zawiesie stalowe Steelflex 2m 2T',
    categoryId: 'accessories',
    totalQty: 16,
    availableQty: 16,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 2.5,
    },
  },
  {
    id: 'eq-rig-shackle-325',
    name: 'Szekla atestowana 3.25T',
    categoryId: 'accessories',
    totalQty: 30,
    availableQty: 30,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 0.7,
    },
  },
  {
    id: 'eq-acc-plates',
    name: 'Blachy usztywniające / montażowe',
    categoryId: 'accessories',
    totalQty: 100,
    availableQty: 100,
    serviceQty: 0,
    unit: 'szt.',
    status: 'dostepny',
    attributes: {
      weightKg: 0.3,
    },
  },
];

// ─── Settings Types ───────────────────────────────────────────────────────────

export interface LedSystem {
  id: string;
  name: string;
  fullItemId: string;
  halfItemId?: string;
  hangingBarItemId?: string;
  halfPosition: 'bottom' | 'top';
}

export interface ConstructionMapping {
  truss200Id?: string;
  truss150Id?: string;
  truss100Id?: string;
  truss050Id?: string;
  hoistManualId?: string;
  hoistElectricId?: string;
  steelflexId?: string;
  shackleId?: string;
  platesId?: string;
}

export interface MountingPreset {
  id: string;
  label: string;
  type: 'bramka' | 'kreska' | 'elki';
  items: { name: string; qty: number }[];
}

// ─── Settings Mock Data ───────────────────────────────────────────────────────

export const mockLedSystems: LedSystem[] = [
  {
    id: 'sys-dicolor-p39',
    name: 'Dicolor P3.9',
    fullItemId: 'eq-led-dic-p39-full',
    halfItemId: 'eq-led-dic-p39-half',
    hangingBarItemId: 'eq-acc-hbar-dic-50',
    halfPosition: 'bottom',
  },
];

export const mockConstructionMapping: ConstructionMapping = {
  truss200Id: 'eq-truss-q39-200',
  truss150Id: 'eq-truss-q39-150',
  truss100Id: 'eq-truss-q39-100',
  truss050Id: 'eq-truss-q39-050',
  hoistManualId: 'eq-hoist-man-1t',
  hoistElectricId: 'eq-hoist-elec-d8',
  steelflexId: 'eq-rig-steelflex-2m',
  shackleId: 'eq-rig-shackle-325',
  platesId: 'eq-acc-plates',
};

export const mockMountingPresets: MountingPreset[] = [
  {
    id: 'preset-bramka-standard',
    label: 'Bramka standardowa',
    type: 'bramka',
    items: [
      { name: 'Baza / Wózek stalowy', qty: 2 },
      { name: 'Czapka głowicy wciągarki', qty: 2 },
      { name: 'Zastrzał Hokej', qty: 4 },
      { name: 'Odciąg pasowy 5T', qty: 4 },
    ],
  },
  {
    id: 'preset-kreska-standard',
    label: 'Kreska (podwieszana)',
    type: 'kreska',
    items: [
      { name: 'Zawiesie stalowe', qty: 4 },
      { name: 'Łańcuch bezpieczeństwa', qty: 4 },
    ],
  },
];

export interface GearPreset {
  id: string;
  name: string;
  description?: string;
  items: { equipmentId: string; qty: number }[];
}

export const mockGearPresets: GearPreset[] = [
  {
    id: 'preset-video',
    name: 'Reżyserka Video',
    description: 'Procesor VX600 + Switcher',
    items: [{ equipmentId: 'eq-acc-hbar-dic-50', qty: 2 }],
  },
  {
    id: 'preset-power',
    name: 'Zasilanie 32A',
    description: 'Rozdzielnica + Siła 32A',
    items: [{ equipmentId: 'eq-truss-q39-050', qty: 2 }],
  },
  {
    id: 'preset-cables',
    name: 'Kros Kablowy',
    description: 'Bębny SDI 50m + HDMI',
    items: [{ equipmentId: 'eq-truss-q39-100', qty: 2 }],
  },
];

export interface ScreenPreset {
  id: string;
  label: string;
  w: number;
  h: number;
  ratio: string;
}

export const mockScreenPresets: ScreenPreset[] = [
  { id: 'sp-1', label: '4.0 × 2.5m', w: 4.0, h: 2.5, ratio: '16:10' },
  { id: 'sp-2', label: '6.0 × 3.5m', w: 6.0, h: 3.5, ratio: '16:9' },
  { id: 'sp-3', label: '8.0 × 4.5m', w: 8.0, h: 4.5, ratio: '16:9' },
  { id: 'sp-4', label: '10.0 × 5.5m', w: 10.0, h: 5.5, ratio: '16:9' },
  { id: 'sp-5', label: '12.0 × 4.0m', w: 12.0, h: 4.0, ratio: '3:1' },
];

// ─── Job Types ────────────────────────────────────────────────────────────────

export interface JobScreenConfig {
  id: string;
  name: string;
  systemId: string;
  matrixMode?: 'hybrid' | 'full_only' | 'half_only';
  widthM: number;
  heightM: number;
  mountingType: 'brak' | 'bramka' | 'kreska' | 'elki';
  hoistType?: 'manual' | 'electric';
  hoistSource?: 'none' | 'warehouse'; // Dla kreski: 'none' (obiektowe) | 'warehouse' (z magazynu ze steelflexami)
  hoistQty?: number; // Liczba wciągarek (= liczba steelflexów)
  usePlates?: boolean; // Blachy usztywniające (automatycznie dla eLek, opcjonalnie dla bramki/kreski)
  needsHangingBars?: boolean;
  customTrussWidthM?: number;
  customTrussHeightM?: number;
}

export interface JobCustomItem {
  equipmentId: string;
  qty: number;
}

export interface Job {
  id: string;
  name: string;
  date: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  location: string;
  status: 'w_trakcie' | 'zakonczone';
  screens: JobScreenConfig[];
  customItems: JobCustomItem[];
  organizerName?: string;
  organizerPhone?: string;
  notes?: string;
  createdAt: string;
}

// ─── Jobs Mock Data ───────────────────────────────────────────────────────────

export const mockJobs: Job[] = [
  {
    id: 'job-gala-2026',
    name: 'Gala Jubileuszowa Orlen 2026',
    date: '2026-10-18',
    startDate: '2026-10-18',
    endDate: '2026-10-19',
    startTime: '19:00',
    location: 'EXPO XXI Warszawa, Hala 1',
    status: 'w_trakcie',
    organizerName: 'Agencja Live (Piotr Wiśniewski)',
    organizerPhone: '+48 501 234 567',
    screens: [
      {
        id: 'scr-1',
        name: 'Ekran Główny Scena',
        systemId: 'sys-dicolor-p39',
        widthM: 6.0,
        heightM: 3.5,
        mountingType: 'bramka',
        hoistType: 'manual',
      },
      {
        id: 'scr-2',
        name: 'Boczny Outfill Prawy',
        systemId: 'sys-dicolor-p39',
        widthM: 3.5,
        heightM: 2.0,
        mountingType: 'elki',
      },
    ],
    customItems: [
      { equipmentId: 'eq-acc-hbar-dic-50', qty: 12 },
    ],
    notes: 'Wjazd bramą techniczną B. Próby reżyserskie od 16:00.',
    createdAt: '2026-10-05T12:00:00Z',
  },
  {
    id: 'job-konferencja-med',
    name: 'Kongres Medycyny Estetycznej',
    date: '2026-10-22',
    startDate: '2026-10-22',
    endDate: '2026-10-24',
    startTime: '09:00',
    location: 'Hilton Warsaw City',
    status: 'w_trakcie',
    organizerName: 'Polskie Towarzystwo Medyczne',
    organizerPhone: '+48 602 889 123',
    screens: [
      {
        id: 'scr-3',
        name: 'Dioda Centralna Audytorium',
        systemId: 'sys-dicolor-p39',
        widthM: 5.0,
        heightM: 3.0,
        mountingType: 'kreska',
        hoistType: 'manual',
      },
    ],
    customItems: [],
    notes: 'Winda towarowa ma limit 1800 kg. Uważać na parkiet w foyer.',
    createdAt: '2026-10-05T14:30:00Z',
  },
  {
    id: 'job-festiwal-swiatel',
    name: 'Festiwal Światła & Video Mapping',
    date: '2026-10-12',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    startTime: '20:30',
    location: 'Tauron Arena Kraków',
    status: 'zakonczone',
    organizerName: 'KBF Kraków',
    organizerPhone: '+48 791 445 678',
    screens: [
      {
        id: 'scr-4',
        name: 'Totemy Sceniczne P+L',
        systemId: 'sys-dicolor-p39',
        widthM: 2.0,
        heightM: 4.0,
        mountingType: 'bramka',
        hoistType: 'manual',
      },
    ],
    customItems: [],
    notes: 'Zrealizowane bez uwag. Sprzęt rozładowany na magazynie głównym.',
    createdAt: '2026-09-28T10:00:00Z',
  },
];
