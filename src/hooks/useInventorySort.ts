import { useState, useMemo } from 'react';
import { EquipmentItem } from '@/lib/mockData';

export type SortField = 'name' | 'category' | 'inField' | 'availableQty' | 'totalQty' | 'status';
export type SortDirection = 'asc' | 'desc';

export function useInventorySort(items: EquipmentItem[]) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusPriority = (item: EquipmentItem): number => {
    if (item.availableQty === 0 && item.serviceQty < item.totalQty) return 1; // Brak
    if (item.availableQty <= Math.ceil(item.totalQty * 0.2)) return 2; // Niski stan
    if (item.serviceQty > 0) return 3; // Serwis
    return 4; // Dostępny
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'pl');
          break;
        case 'category':
          comparison = a.categoryId.localeCompare(b.categoryId, 'pl');
          break;
        case 'inField': {
          const aInField = Math.max(0, a.totalQty - a.availableQty - a.serviceQty);
          const bInField = Math.max(0, b.totalQty - b.availableQty - b.serviceQty);
          comparison = aInField - bInField;
          break;
        }
        case 'availableQty':
          comparison = a.availableQty - b.availableQty;
          break;
        case 'totalQty':
          comparison = a.totalQty - b.totalQty;
          break;
        case 'status':
          comparison = getStatusPriority(a) - getStatusPriority(b);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, sortField, sortDirection]);

  return {
    sortedItems,
    sortField,
    sortDirection,
    toggleSort,
  };
}
