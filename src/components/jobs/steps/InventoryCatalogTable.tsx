"use client";

import { useState, useMemo } from "react";
import { EquipmentItem, JobCustomItem } from "@/lib/mockData";
import { CatalogTableRow } from "./CatalogTableRow";
import { CatalogPagination } from "./CatalogPagination";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Check,
  Minus,
} from "lucide-react";
import {
  FloatingBulkActionBar,
  BulkActionItem,
} from "@/components/common/FloatingBulkActionBar";

interface InventoryCatalogTableProps {
  inventory: EquipmentItem[];
  customItems: JobCustomItem[];
  searchQuery: string;
  selectedCat: string;
  stockFilter: "all" | "available_only";
  onAddItem: (id: string, qty: number) => void;
  onSetQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

type SortField = "name" | "category" | "available";
type SortOrder = "asc" | "desc";

export function InventoryCatalogTable({
  inventory,
  customItems,
  searchQuery,
  selectedCat,
  stockFilter,
  onAddItem,
  onSetQty,
  onRemoveItem,
}: InventoryCatalogTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder(field === "available" ? "desc" : "asc");
    }
    setCurrentPage(1);
  };

  const filteredItems = useMemo(() => {
    return inventory
      .filter((item) => {
        const matchesCat =
          selectedCat === "all" || item.categoryId === selectedCat;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || item.name.toLowerCase().includes(q);
        const matchesStock = stockFilter === "all" || item.availableQty > 0;
        return matchesCat && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") {
          cmp = a.name.localeCompare(b.name, "pl");
        } else if (sortField === "category") {
          cmp = a.categoryId.localeCompare(b.categoryId, "pl");
        } else if (sortField === "available") {
          cmp = a.availableQty - b.availableQty;
        }
        return sortOrder === "asc" ? cmp : -cmp;
      });
  }, [inventory, selectedCat, searchQuery, stockFilter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Zaznaczanie wielu
  const visibleIds = paginatedItems.map((i) => i.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const isPartiallySelected = selectedIds.size > 0 && !allVisibleSelected;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const hasItemsInCart = useMemo(() => {
    const cartIds = new Set(customItems.map((ci) => ci.equipmentId));
    return Array.from(selectedIds).some((id) => cartIds.has(id));
  }, [selectedIds, customItems]);

  const handleBulkAdd = () => {
    selectedIds.forEach((id) => onAddItem(id, 1));
    setSelectedIds(new Set());
  };

  const handleBulkRemoveFromCart = () => {
    selectedIds.forEach((id) => {
      if (customItems.some((ci) => ci.equipmentId === id)) {
        onRemoveItem(id);
      }
    });
    setSelectedIds(new Set());
  };

  const bulkActions: BulkActionItem[] = [
    {
      id: "add-to-job",
      label: "Dodaj do zlecenia (+1)",
      icon: <Plus size={16} />,
      variant: "primary",
      onClick: handleBulkAdd,
    },
    {
      id: "remove-from-job",
      label: hasItemsInCart
        ? "Usuń zaznaczone ze zlecenia"
        : "Brak zaznaczonych pozycji w zleceniu",
      icon: <Trash2 size={16} />,
      variant: "destructive",
      disabled: !hasItemsInCart,
      onClick: handleBulkRemoveFromCart,
    },
  ];

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown
          size={12}
          className="opacity-0 group-hover/btn:opacity-60 transition-opacity ml-1.5 text-slate-400"
        />
      );
    }
    return sortOrder === "asc" ? (
      <ArrowUp size={12} className="ml-1.5 text-blue-400" />
    ) : (
      <ArrowDown size={12} className="ml-1.5 text-blue-400" />
    );
  };

  return (
    <div className="w-full bg-[#0d121c] border border-slate-800/80 rounded-xl overflow-hidden shadow-xl shadow-black/25">
      {/* ─── TABELA MAGAZYNOWA (IDENTYCZNA JAK W MAGAZYNIE, TYLKO WĘŻSZA) ─── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="select-none">
            <tr className="border-b border-slate-800/80 bg-[#0e1422] h-[49px] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="w-12 pl-4 py-3.5 text-center">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all cursor-pointer ${
                    allVisibleSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isPartiallySelected
                        ? "bg-blue-600/70 border-blue-500 text-white"
                        : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
                  }`}
                  title={
                    allVisibleSelected
                      ? "Odznacz wszystkie"
                      : "Zaznacz wszystkie widoczne"
                  }
                >
                  {allVisibleSelected && <Check size={11} strokeWidth={3} />}
                  {isPartiallySelected && <Minus size={11} strokeWidth={3} />}
                </button>
              </th>
              <th
                onClick={() => handleSort("name")}
                className="py-3.5 px-3 cursor-pointer group/btn hover:text-white transition-colors"
              >
                <span className="inline-flex items-center">
                  Nazwa Sprzętu {renderSortIcon("name")}
                </span>
              </th>
              <th
                onClick={() => handleSort("category")}
                className="py-3.5 px-3 cursor-pointer group/btn hover:text-white transition-colors"
              >
                <span className="inline-flex items-center">
                  Kategoria {renderSortIcon("category")}
                </span>
              </th>
              <th
                onClick={() => handleSort("available")}
                className="py-3.5 px-3 text-center cursor-pointer group/btn hover:text-white transition-colors"
              >
                <span className="inline-flex items-center justify-center">
                  Stan Magazynu {renderSortIcon("available")}
                </span>
              </th>
              <th className="py-3.5 px-3 text-center">W Zleceniu</th>
              <th className="py-3.5 pr-4 pl-3 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {paginatedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-500 text-sm"
                >
                  Brak sprzętu odpowiadającego wybranym filtrom.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <CatalogTableRow
                  key={item.id}
                  item={item}
                  inCart={customItems.find((ci) => ci.equipmentId === item.id)}
                  isSelected={selectedIds.has(item.id)}
                  onToggleSelect={handleToggleSelect}
                  onAddItem={onAddItem}
                  onSetQty={onSetQty}
                  onRemoveItem={onRemoveItem}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─── DOLNA PAGINACJA MAGAZYNOWA ─── */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0d121c]/30">
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ─── PŁYWAJĄCA BELKA AKCJI MASOWYCH (FLOATING PILL) ─── */}
      <FloatingBulkActionBar
        selectedCount={selectedIds.size}
        totalCount={filteredItems.length}
        onSelectAll={() =>
          setSelectedIds(new Set(paginatedItems.map((i) => i.id)))
        }
        onClearSelection={() => setSelectedIds(new Set())}
        actions={bulkActions}
      />
    </div>
  );
}
