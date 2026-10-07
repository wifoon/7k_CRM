"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  Minus,
} from "lucide-react";
import { SortField, SortDirection } from "@/hooks/useInventorySort";

interface InventoryTableHeaderProps {
  allSelected: boolean;
  onToggleAll: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  selectedCount?: number;
}

export function InventoryTableHeader({
  allSelected,
  onToggleAll,
  sortField,
  sortDirection,
  onSort,
  selectedCount = 0,
}: InventoryTableHeaderProps) {
  const isPartiallySelected = selectedCount > 0 && !allSelected;

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <ArrowUpDown
          size={12}
          className="opacity-0 group-hover/btn:opacity-60 transition-opacity ml-1.5 text-slate-400"
        />
      );
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={12} className="ml-1.5 text-blue-400" />
    ) : (
      <ArrowDown size={12} className="ml-1.5 text-blue-400" />
    );
  };

  return (
    <TableHeader>
      <TableRow className="border-b border-slate-800/80 bg-[#121824] h-[49px]">
        {/* Kwadratowy Checkbox */}
        <TableHead className="w-12 pl-6 py-3.5">
          <button
            type="button"
            onClick={onToggleAll}
            className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all cursor-pointer ${
              allSelected
                ? "bg-blue-600 border-blue-600 text-white"
                : isPartiallySelected
                  ? "bg-blue-600/70 border-blue-500 text-white"
                  : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
            }`}
          >
            {allSelected && <Check size={11} strokeWidth={3} />}
            {isPartiallySelected && <Minus size={11} strokeWidth={3} />}
          </button>
        </TableHead>

        {/* Sprzęt & Kod (zmniejszona szerokość o niecałą połowę) */}
        <TableHead className="py-3.5 w-[30%] min-w-[260px]">
          <button
            onClick={() => onSort("name")}
            className="group/btn flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            Sprzęt & Kod
            {renderSortIcon("name")}
          </button>
        </TableHead>

        {/* Kategoria */}
        <TableHead className="py-3.5 w-[16%] min-w-[140px]">
          <button
            onClick={() => onSort("category")}
            className="group/btn flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            Kategoria
            {renderSortIcon("category")}
          </button>
        </TableHead>

        {/* Status */}
        <TableHead className="py-3.5 w-[14%] min-w-[130px] text-center">
          <button
            onClick={() => onSort("status")}
            className="group/btn inline-flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            Status
            {renderSortIcon("status")}
          </button>
        </TableHead>

        {/* Dostępność / Stan */}
        <TableHead className="py-3.5 w-[22%] min-w-[220px]">
          <button
            onClick={() => onSort("availableQty")}
            className="group/btn flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            Dostępność / Stan
            {renderSortIcon("availableQty")}
          </button>
        </TableHead>

        {/* W terenie */}
        <TableHead className="py-3.5 w-[11%] min-w-[110px]">
          <button
            onClick={() => onSort("inField")}
            className="group/btn flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-white transition-colors cursor-pointer"
          >
            W terenie
            {renderSortIcon("inField")}
          </button>
        </TableHead>

        {/* Akcje */}
        <TableHead className="py-3.5 w-[7%] min-w-[90px] pr-6 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Akcje
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
