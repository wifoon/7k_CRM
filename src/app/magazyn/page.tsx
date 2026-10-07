"use client";

import { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { InventoryKpiCards } from '@/components/inventory/InventoryKpiCards';
import { InventoryToolbar } from '@/components/inventory/InventoryToolbar';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { EquipmentFormModal } from '@/components/inventory/EquipmentFormModal';

export default function MagazynPage() {
  const { items, searchQuery, setSearchQuery, categoryFilter, setCategoryFilter } = useInventory();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 space-y-5 w-full max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cztery Kafelki Stanów (Dostępne, W terenie, W serwisie, Niski stan) */}
      <InventoryKpiCards items={items} />

      {/* 2. Pasek Narzędzi w odróżniającym się kolorze (Wyszukiwarka + Kategorie w jednej linii) */}
      <InventoryToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* 3. Główna Tabela Magazynu (Kwadratowe checkboxy, liczba kabinetów, 1-klikowy serwis) */}
      <InventoryTable />

      {/* Modal dodawania nowego sprzętu */}
      <EquipmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
