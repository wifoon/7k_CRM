"use client";

import { useState, useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";
import { useInventorySort } from "@/hooks/useInventorySort";
import { EquipmentItem } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Package, Wrench, RotateCcw, Trash2 } from "lucide-react";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryRow } from "./InventoryRow";
import { TablePagination } from "@/components/common/TablePagination";
import { ServiceActionModal } from "./ServiceActionModal";
import { EquipmentFormModal } from "./EquipmentFormModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import {
  FloatingBulkActionBar,
  BulkActionItem,
} from "@/components/common/FloatingBulkActionBar";

export function InventoryTable() {
  const {
    items,
    searchQuery,
    categoryFilter,
    statusFilter,
    moveToService,
    restoreFromService,
    deleteItem,
    deleteItems,
  } = useInventory();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [serviceAction, setServiceAction] = useState<
    "to_service" | "from_service"
  >("to_service");

  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filtrowanie (wyszukiwarka, kategoria, status)
  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      categoryFilter === "all" || item.categoryId === categoryFilter;

    let matchStatus = true;
    if (statusFilter === "dostepny") {
      matchStatus = item.availableQty > 0;
    } else if (statusFilter === "w_terenie") {
      const reserved = item.totalQty - item.availableQty - item.serviceQty;
      matchStatus = reserved > 0;
    } else if (statusFilter === "serwis") {
      matchStatus = item.serviceQty > 0;
    } else if (statusFilter === "alert") {
      matchStatus = item.availableQty <= Math.ceil(item.totalQty * 0.2);
    }

    return matchSearch && matchCat && matchStatus;
  });

  // Reset do strony 1 przy zmianie filtrów
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  // Sortowanie
  const { sortedItems, sortField, sortDirection, toggleSort } =
    useInventorySort(filtered);

  // Paginacja elementów
  const totalPages = Math.ceil(sortedItems.length / pageSize) || 1;
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Zaznaczanie wierszy na bieżącej stronie
  const allSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((i) => selectedIds.has(i.id));
  const toggleAll = () =>
    setSelectedIds(
      allSelected ? new Set() : new Set(paginatedItems.map((i) => i.id)),
    );
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  const openService = (
    item: EquipmentItem,
    action: "to_service" | "from_service",
  ) => {
    setSelectedItem(item);
    setServiceAction(action);
    setServiceModalOpen(true);
  };

  const openEdit = (item: EquipmentItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const [deleteTarget, setDeleteTarget] = useState<"bulk" | EquipmentItem | null>(null);

  const hasItemsInService = Array.from(selectedIds).some((id) => {
    const it = items.find((x) => x.id === id);
    return it && it.serviceQty > 0;
  });

  const hasAvailableItems = Array.from(selectedIds).some((id) => {
    const it = items.find((x) => x.id === id);
    return it && it.availableQty > 0;
  });

  const handleBatchService = () => {
    selectedIds.forEach((id) => {
      const it = items.find((x) => x.id === id);
      if (it && it.availableQty > 0) {
        moveToService(id, 1);
      }
    });
    setSelectedIds(new Set());
  };

  const handleBatchRestoreFromService = () => {
    selectedIds.forEach((id) => {
      const it = items.find((x) => x.id === id);
      if (it && it.serviceQty > 0) {
        restoreFromService(id, it.serviceQty);
      }
    });
    setSelectedIds(new Set());
  };

  const handleConfirmDelete = () => {
    if (deleteTarget === "bulk") {
      deleteItems(Array.from(selectedIds));
      setSelectedIds(new Set());
    } else if (deleteTarget) {
      deleteItem(deleteTarget.id);
      setSelectedIds((prev) => {
        const n = new Set(prev);
        n.delete(deleteTarget.id);
        return n;
      });
    }
    setDeleteTarget(null);
  };

  const bulkActions: BulkActionItem[] = [
    {
      id: "service",
      label: hasAvailableItems
        ? "Wyślij do serwisu"
        : "Brak dostępnych sztuk do serwisu",
      icon: <Wrench size={16} />,
      variant: "warning",
      disabled: !hasAvailableItems,
      onClick: handleBatchService,
    },
    {
      id: "restore",
      label: hasItemsInService
        ? "Przywróć z serwisu (całość)"
        : "Brak zaznaczonych pozycji w serwisie",
      icon: <RotateCcw size={16} />,
      variant: "success",
      disabled: !hasItemsInService,
      onClick: handleBatchRestoreFromService,
    },
    {
      id: "delete",
      label: "Usuń zaznaczone",
      icon: <Trash2 size={16} />,
      variant: "destructive",
      onClick: () => setDeleteTarget("bulk"),
    },
  ];

  return (
    <>
      <div className="w-full bg-[#0d121c] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl shadow-black/25">
        <Table className="w-full">
          <InventoryTableHeader
            allSelected={allSelected}
            onToggleAll={toggleAll}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={toggleSort}
            selectedCount={selectedIds.size}
          />
          <TableBody className="divide-y divide-slate-800/60">
            {paginatedItems.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-9 h-9 text-slate-700" />
                    <p className="text-xs text-slate-400 font-medium">
                      Brak pozycji spełniających kryteria.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item) => (
                <InventoryRow
                  key={item.id}
                  item={item}
                  allItems={items}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={() => toggleOne(item.id)}
                  onOpenService={openService}
                  onOpenEdit={openEdit}
                  onDelete={(item) => setDeleteTarget(item)}
                />
              ))
            )}
          </TableBody>
        </Table>

        {/* Dolna Paginacja Magazynowa (Zgodna z planerem robót) */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0d121c]/40">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedItems.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Pływająca belka akcji masowych (Floating Pill) */}
      <FloatingBulkActionBar
        selectedCount={selectedIds.size}
        totalCount={paginatedItems.length}
        onSelectAll={() =>
          setSelectedIds(new Set(paginatedItems.map((i) => i.id)))
        }
        onClearSelection={() => setSelectedIds(new Set())}
        actions={bulkActions}
      />

      {/* Modal potwierdzenia usunięcia */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget === "bulk"
            ? "Usuń zaznaczone pozycje"
            : `Usuń pozycję ${deleteTarget?.name || ""}`
        }
        count={deleteTarget === "bulk" ? selectedIds.size : 1}
      />

      {/* Modale */}
      {selectedItem && (
        <ServiceActionModal
          isOpen={serviceModalOpen}
          onClose={() => setServiceModalOpen(false)}
          item={selectedItem}
          action={serviceAction}
        />
      )}
      {selectedItem && (
        <EquipmentFormModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          itemToEdit={selectedItem}
        />
      )}
    </>
  );
}
