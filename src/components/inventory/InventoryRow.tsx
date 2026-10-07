"use client";

import { EquipmentItem } from "@/lib/mockData";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, Wrench, Pencil, Trash2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { getCategoryColorDef } from "@/utils/categoryColors";

interface InventoryRowProps {
  item: EquipmentItem;
  allItems: EquipmentItem[];
  isSelected: boolean;
  onToggleSelect: () => void;
  onOpenService: (
    item: EquipmentItem,
    action: "to_service" | "from_service",
  ) => void;
  onOpenEdit: (item: EquipmentItem) => void;
  onDelete?: (item: EquipmentItem) => void;
}

export function InventoryRow({
  item,
  isSelected,
  onToggleSelect,
  onOpenService,
  onOpenEdit,
  onDelete,
}: InventoryRowProps) {
  const { categories } = useSettings();
  const matchedCategory = categories.find((c) => c.id === item.categoryId);
  const colorDef = getCategoryColorDef(matchedCategory?.color);

  // Status i stany wyliczane dynamicznie
  const sQty = item.serviceQty;
  const inField = Math.max(0, item.totalQty - item.availableQty - sQty);
  const isFullService = sQty >= item.totalQty && item.totalQty > 0;
  const isOut = item.availableQty === 0 && !isFullService;
  const isLow =
    !isOut &&
    !isFullService &&
    item.availableQty <= Math.ceil(item.totalQty * 0.2);
  const pct =
    item.totalQty > 0
      ? Math.round((item.availableQty / item.totalQty) * 100)
      : 0;

  // Dioda LED: wyliczenie kabinetów (sztuk)
  const isLed =
    item.categoryId === "led" || Boolean(item.attributes?.cabinetsPerCase);
  const cabinetsPerCase = item.attributes?.cabinetsPerCase || 8;
  const availCabinets = item.availableQty * cabinetsPerCase;
  const totalCabinets = item.totalQty * cabinetsPerCase;

  const sku = item.id.replace("eq-", "").toUpperCase();

  return (
    <TableRow
      className={`border-b border-slate-800/60 transition-colors group ${
        isSelected
          ? "bg-blue-600/10 hover:bg-blue-600/15"
          : "hover:bg-slate-800/20"
      }`}
    >
      {/* Kwadratowy Checkbox (rounded-sm) */}
      <TableCell className="w-12 pl-6 py-3.5">
        <button
          type="button"
          onClick={onToggleSelect}
          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all cursor-pointer ${
            isSelected
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
          }`}
        >
          {isSelected && <Check size={11} strokeWidth={3} />}
        </button>
      </TableCell>

      {/* Sprzęt & Kod (zmniejszona szerokość o niecałą połowę) */}
      <TableCell className="py-3.5 w-[30%] min-w-[260px]">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold transition-colors ${isSelected ? "text-blue-300" : "text-white group-hover:text-blue-300"}`}
            >
              {item.name}
            </span>
            {sQty > 0 && (
              <button
                type="button"
                onClick={() => onOpenService(item, "from_service")}
                className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded inline-flex items-center gap-1 hover:bg-orange-500/25 transition-colors cursor-pointer"
                title={`W serwisie: ${sQty} ${item.unit}. Kliknij, aby zarządzać zwrotem`}
              >
                <Wrench size={10} />
                SERWIS: {sQty} {item.unit}
              </button>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono">SKU: {sku}</span>
        </div>
      </TableCell>

      {/* Kategoria */}
      <TableCell className="py-3.5 w-[16%] min-w-[140px]">
        <span
          className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md border ${colorDef.bg} ${colorDef.text} ${colorDef.border}`}
        >
          {matchedCategory?.name || item.categoryId}
        </span>
      </TableCell>

      {/* Status (Kapsułki) */}
      <TableCell className="py-3.5 w-[14%] min-w-[130px] text-center">
        {isFullService ? (
          <span className="inline-flex items-center text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            W serwisie
          </span>
        ) : isOut ? (
          <span className="inline-flex items-center text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            Brak
          </span>
        ) : isLow ? (
          <span className="inline-flex items-center text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            Niski stan
          </span>
        ) : inField > 0 ? (
          <span className="inline-flex items-center text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            W terenie
          </span>
        ) : (
          <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
            Dostępny
          </span>
        )}
      </TableCell>

      {/* Stan / Zapełnienie */}
      <TableCell className="py-3.5 w-[22%] min-w-[220px]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-24 bg-slate-800/80 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFullService
                    ? "bg-orange-500"
                    : isOut
                      ? "bg-rose-500"
                      : isLow
                        ? "bg-amber-400"
                        : "bg-cyan-500"
                }`}
                style={{ width: `${isFullService ? 100 : pct}%` }}
              />
            </div>
            {/* Niepogrubiona czcionka stanu */}
            <span className="text-xs font-normal font-mono text-slate-300 tabular-nums whitespace-nowrap">
              {item.availableQty} / {item.totalQty} {item.unit}
            </span>
          </div>

          {/* Pod ilością CASE: łączna ilość kabinetów na magazynie */}
          {isLed && (
            <span className="text-[11px] text-slate-400 font-mono pl-0.5">
              {availCabinets} kabinetów na stanie{" "}
              <span className="text-slate-500">({totalCabinets} łącznie)</span>
            </span>
          )}
        </div>
      </TableCell>

      {/* Kolumna: W terenie */}
      <TableCell className="py-3.5 w-[11%] min-w-[110px]">
        {inField > 0 ? (
          <span className="text-xs font-mono font-medium text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
            {inField} {item.unit}
          </span>
        ) : (
          <span className="text-xs font-mono text-slate-500 pl-2">—</span>
        )}
      </TableCell>

      {/* Akcje */}
      <TableCell className="py-3.5 w-[7%] min-w-[90px] pr-6 text-right">
        <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() =>
              onOpenService(item, sQty > 0 ? "from_service" : "to_service")
            }
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              sQty > 0
                ? "text-orange-400 hover:bg-orange-500/15"
                : "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
            }`}
            title="Obsługa serwisu (wyślij lub zwróć)"
          >
            <Wrench size={16} />
          </button>
          <button
            onClick={() => onOpenEdit(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Edytuj dane"
          >
            <Pencil size={16} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
              <MoreHorizontal size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#121824] border-slate-800 text-slate-300 min-w-[160px]"
            >
              <DropdownMenuItem
                onClick={() => onOpenService(item, "to_service")}
                className="hover:bg-slate-800 cursor-pointer text-xs"
              >
                <Wrench className="mr-2 h-4 w-4 text-orange-400" />
                Wyślij na serwis
              </DropdownMenuItem>
              {sQty > 0 && (
                <DropdownMenuItem
                  onClick={() => onOpenService(item, "from_service")}
                  className="hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer text-xs"
                >
                  <Wrench className="mr-2 h-4 w-4 text-emerald-400" />
                  Cofnij z serwisu (część lub całość)
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete?.(item)}
                className="hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer text-xs"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Usuń pozycję
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
