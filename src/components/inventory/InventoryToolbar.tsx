"use client";

import { Search, Plus, X } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getCategoryColorDef } from "@/utils/categoryColors";
import { InventoryFilterPopover } from "./InventoryFilterPopover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InventoryToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onOpenAddModal: () => void;
}

export function InventoryToolbar({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onOpenAddModal,
}: InventoryToolbarProps) {
  const { categories } = useSettings();

  return (
    <div className="bg-[#121824] border border-slate-700/70 rounded-xl p-3 shadow-lg shadow-black/20 flex items-center justify-between gap-3 flex-wrap">
      {/* Lewa strona: Wyszukiwarka + Kategorie w TEJ SAMEJ LINII */}
      <div className="flex items-center gap-3 flex-1 min-w-[300px] flex-wrap">
        {/* Wyszukiwarka z placeholderem: Szukaj po nazwie... */}
        <div className="relative w-full sm:w-64">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj po nazwie..."
            className="w-full pl-9 pr-8 h-9"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Separator pionowy */}
        <div className="hidden sm:block h-6 w-px bg-slate-700/60" />

        {/* Dynamiczne pigułki kategorii z kolorami w tej samej linii */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setCategoryFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              categoryFilter === "all"
                ? "bg-blue-600/25 border-blue-500/70 text-blue-300 shadow-sm"
                : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Wszystkie
          </button>
          {categories.map((cat) => {
            const isSelected = categoryFilter === cat.id;
            const colorDef = getCategoryColorDef(cat.color);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryFilter(cat.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap border ${
                  isSelected
                    ? `${colorDef.bg} ${colorDef.text} ${colorDef.border} font-semibold ring-1 ring-inset ring-current`
                    : "bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colorDef.dot}`} />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prawa strona: Popover filtrów + Dodaj pozycję */}
      <div className="flex items-center gap-2.5 shrink-0">
        <InventoryFilterPopover
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />

        <Button onClick={onOpenAddModal} className="gap-2 shrink-0">
          <Plus size={15} />
          <span>Dodaj sprzęt</span>
        </Button>
      </div>
    </div>
  );
}
