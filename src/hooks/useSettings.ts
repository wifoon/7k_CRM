import { create } from 'zustand';
import {
  LedSystem,
  ConstructionMapping,
  MountingPreset,
  Category,
  GearPreset,
  ScreenPreset,
  mockLedSystems,
  mockConstructionMapping,
  mockMountingPresets,
  mockCategories,
  mockGearPresets,
  mockScreenPresets,
  EquipmentItem,
} from '@/lib/mockData';

interface SettingsState {
  ledSystems: LedSystem[];
  constructionMapping: ConstructionMapping;
  mountingPresets: MountingPreset[];
  categories: Category[];
  gearPresets: GearPreset[];
  screenPresets: ScreenPreset[];

  // Screen Presets (Formaty i proporcje ekranów)
  addScreenPreset: (preset: Omit<ScreenPreset, 'id'>) => void;
  updateScreenPreset: (id: string, preset: Partial<ScreenPreset>) => void;
  deleteScreenPreset: (id: string) => void;

  // LED Systems
  addLedSystem: (system: Omit<LedSystem, 'id'>) => void;
  updateLedSystem: (id: string, system: Partial<LedSystem>) => void;
  deleteLedSystem: (id: string) => void;

  // Construction Mapping
  updateConstructionMapping: (mapping: Partial<ConstructionMapping>) => void;
  autoDetectConstructionMapping: (inventory: EquipmentItem[]) => void;

  // Mounting Presets
  addMountingPreset: (preset: Omit<MountingPreset, 'id'>) => void;
  updateMountingPreset: (id: string, preset: Partial<MountingPreset>) => void;
  deleteMountingPreset: (id: string) => void;

  // Gear Presets (Dodatkowy sprzęt)
  addGearPreset: (preset: Omit<GearPreset, 'id'>) => void;
  updateGearPreset: (id: string, preset: Partial<GearPreset>) => void;
  deleteGearPreset: (id: string) => void;

  // Categories
  addCategory: (category: Category) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  ledSystems: mockLedSystems,
  constructionMapping: mockConstructionMapping,
  mountingPresets: mockMountingPresets,
  categories: mockCategories,
  gearPresets: mockGearPresets,
  screenPresets: mockScreenPresets,

  addScreenPreset: (preset) =>
    set((state) => ({
      screenPresets: [
        ...state.screenPresets,
        { ...preset, id: `sp-${Date.now()}` },
      ],
    })),

  updateScreenPreset: (id, preset) =>
    set((state) => ({
      screenPresets: state.screenPresets.map((p) =>
        p.id === id ? { ...p, ...preset } : p
      ),
    })),

  deleteScreenPreset: (id) =>
    set((state) => ({
      screenPresets: state.screenPresets.filter((p) => p.id !== id),
    })),

  addGearPreset: (preset) =>
    set((state) => ({
      gearPresets: [
        ...state.gearPresets,
        { ...preset, id: `preset-${Date.now()}` },
      ],
    })),

  updateGearPreset: (id, preset) =>
    set((state) => ({
      gearPresets: state.gearPresets.map((p) =>
        p.id === id ? { ...p, ...preset } : p
      ),
    })),

  deleteGearPreset: (id) =>
    set((state) => ({
      gearPresets: state.gearPresets.filter((p) => p.id !== id),
    })),

  addLedSystem: (system) =>
    set((state) => ({
      ledSystems: [
        ...state.ledSystems,
        { ...system, id: `sys-${Date.now()}` },
      ],
    })),

  updateLedSystem: (id, system) =>
    set((state) => ({
      ledSystems: state.ledSystems.map((s) =>
        s.id === id ? { ...s, ...system } : s
      ),
    })),

  deleteLedSystem: (id) =>
    set((state) => ({
      ledSystems: state.ledSystems.filter((s) => s.id !== id),
    })),

  updateConstructionMapping: (mapping) =>
    set((state) => ({
      constructionMapping: { ...state.constructionMapping, ...mapping },
    })),

  autoDetectConstructionMapping: (inventory) =>
    set((state) => {
      const mapping: ConstructionMapping = { ...state.constructionMapping };

      inventory.forEach((item) => {
        // Detect trusses by category & lengthM attribute
        if (item.categoryId === 'truss') {
          const len = item.attributes?.lengthM;
          if (len === 2.0 && !mapping.truss200Id) mapping.truss200Id = item.id;
          else if (len === 1.5 && !mapping.truss150Id) mapping.truss150Id = item.id;
          else if (len === 1.0 && !mapping.truss100Id) mapping.truss100Id = item.id;
          else if (len === 0.5 && !mapping.truss050Id) mapping.truss050Id = item.id;
        }

        // Detect hoists
        if (item.categoryId === 'hoist') {
          const lowerName = item.name.toLowerCase();
          if (lowerName.includes('ręcz') || lowerName.includes('man')) {
            if (!mapping.hoistManualId) mapping.hoistManualId = item.id;
          } else if (lowerName.includes('elektr') || lowerName.includes('siln')) {
            if (!mapping.hoistElectricId) mapping.hoistElectricId = item.id;
          }
        }
      });

      return { constructionMapping: mapping };
    }),

  addMountingPreset: (preset) =>
    set((state) => ({
      mountingPresets: [
        ...state.mountingPresets,
        { ...preset, id: `preset-${Date.now()}` },
      ],
    })),

  updateMountingPreset: (id, preset) =>
    set((state) => ({
      mountingPresets: state.mountingPresets.map((p) =>
        p.id === id ? { ...p, ...preset } : p
      ),
    })),

  deleteMountingPreset: (id) =>
    set((state) => ({
      mountingPresets: state.mountingPresets.filter((p) => p.id !== id),
    })),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategory: (id, category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...category } : c
      ),
    })),

  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
}));
