import { create } from 'zustand';
import { EquipmentItem, mockEquipment } from '@/lib/mockData';

export type InventoryStatusFilter = 'all' | 'dostepny' | 'w_terenie' | 'serwis' | 'alert';

interface InventoryState {
  items: EquipmentItem[];
  searchQuery: string;
  categoryFilter: string;
  statusFilter: InventoryStatusFilter;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: InventoryStatusFilter) => void;
  addItem: (item: Omit<EquipmentItem, 'id'>) => void;
  updateItem: (id: string, updated: Partial<EquipmentItem>) => void;
  moveToService: (id: string, qty: number) => void;
  restoreFromService: (id: string, qty: number) => void;
  deleteItem: (id: string) => void;
  deleteItems: (ids: string[]) => void;
}

export const useInventory = create<InventoryState>((set) => ({
  items: mockEquipment,
  searchQuery: '',
  categoryFilter: 'all',
  statusFilter: 'all',
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  
  addItem: (item) => set((state) => {
    const newItem = { ...item, id: `eq-${Date.now()}` } as EquipmentItem;
    return { items: [...state.items, newItem] };
  }),
  
  updateItem: (id, updated) => set((state) => ({
    items: state.items.map(item => item.id === id ? { ...item, ...updated } : item)
  })),

  deleteItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  deleteItems: (ids) => set((state) => {
    const idsSet = new Set(ids);
    return {
      items: state.items.filter(item => !idsSet.has(item.id))
    };
  }),

  moveToService: (id, qty) => set((state) => ({
    items: state.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          availableQty: Math.max(0, item.availableQty - qty),
          serviceQty: item.serviceQty + qty
        };
      }
      return item;
    })
  })),

  restoreFromService: (id, qty) => set((state) => ({
    items: state.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          availableQty: item.availableQty + qty,
          serviceQty: Math.max(0, item.serviceQty - qty)
        };
      }
      return item;
    })
  })),
}));
