"use client";

import { useMemo } from "react";
import { JobCalculationSummary } from "@/utils/jobCalc";
import { JobCustomItem, EquipmentItem } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ShoppingCart, AlertTriangle, ArrowRight, Trash2 } from "lucide-react";
import { JobBOMBaseSection } from "./JobBOMBaseSection";
import { JobBOMCustomItemRow } from "./JobBOMCustomItemRow";

interface JobBOMCartPanelProps {
  bomSummary: JobCalculationSummary | null;
  customItems: JobCustomItem[];
  inventory: EquipmentItem[];
  onSetQty: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCustomItems?: () => void;
  onNext: () => void;
}

export function JobBOMCartPanel({
  bomSummary,
  customItems,
  inventory,
  onSetQty,
  onRemoveItem,
  onClearCustomItems,
  onNext,
}: JobBOMCartPanelProps) {
  const { ledItems, trussItems } = useMemo(() => {
    if (!bomSummary) return { ledItems: [], trussItems: [] };
    const led = bomSummary.items.filter(
      (i) =>
        i.categoryId === "led" ||
        i.sources.some((s) => s.toLowerCase().includes("dioda")),
    );
    const truss = bomSummary.items.filter(
      (i) =>
        (i.categoryId === "truss" ||
          i.categoryId === "hoist" ||
          i.sources.some(
            (s) =>
              s.toLowerCase().includes("krata") ||
              s.toLowerCase().includes("wciąg") ||
              s.toLowerCase().includes("bramk") ||
              s.toLowerCase().includes("belk"),
          )) &&
        !i.sources.some((s) => s.includes("Sprzęt dodatkowy")),
    );
    return { ledItems: led, trussItems: truss };
  }, [bomSummary]);

  const totalPositions = bomSummary?.items.length || 0;
  const hasOverbooking = bomSummary?.hasOverbooking || false;

  return (
    <div className="bg-[#121824] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl sticky top-20">
      {/* ─── HEADER KOSZYKA ─── */}
      <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-[#0e131d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              Koszyk Zlecenia
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {totalPositions} pozycji w zestawieniu
            </span>
          </div>
        </div>
        {hasOverbooking && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5" />
            Braki ({bomSummary?.overbookedCount})
          </span>
        )}
      </div>

      {/* ─── LISTA POZYCJI ─── */}
      <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-800/60">
        {/* 1. Baza Zlecenia – Zwinięty Holder z Metryką */}
        <JobBOMBaseSection
          ledItems={ledItems}
          trussItems={trussItems}
          bomSummary={bomSummary}
        />

        {/* 2. Sprzęt Dodatkowy – Wyróżniona sekcja Electric Tech Blue */}
        <div>
          <div className="px-5 py-2.5 bg-gradient-to-r from-blue-950/40 via-[#0e1526] to-[#0e131d] border-b border-blue-500/20 flex items-center justify-between text-xs font-bold text-blue-400 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">Sprzęt Dodatkowy</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-xs shadow-blue-500/20">
                {customItems.length}
              </span>
            </div>
            {customItems.length > 0 && onClearCustomItems && (
              <button
                type="button"
                onClick={onClearCustomItems}
                className="text-xs font-medium text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Wyczyść cały sprzęt dodatkowy"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wyczyść</span>
              </button>
            )}
          </div>

          {customItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm bg-gradient-to-b from-[#0b101d] to-[#090d18]">
              Brak dodatkowego sprzętu. Dodaj pozycje z katalogu magazynu.
            </div>
          ) : (
            <div className="divide-y divide-blue-950/40 bg-gradient-to-b bg-[#0a0e16]">
              {customItems.map((ci) => {
                const inv = inventory.find((i) => i.id === ci.equipmentId);
                return (
                  <JobBOMCustomItemRow
                    key={ci.equipmentId}
                    customItem={ci}
                    inventoryItem={inv}
                    onSetQty={onSetQty}
                    onRemoveItem={onRemoveItem}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── DOLNE METRYKI I PRZYCISK ─── */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0e131d] space-y-3">
        <div className="grid grid-cols-2 gap-2 text-center font-mono py-2 border-y border-slate-800/50">
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium block">
              Diody
            </span>
            <strong className="text-sm font-bold text-white">
              {bomSummary?.totalCases || 0} case
            </strong>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-medium block">
              Kraty
            </span>
            <strong className="text-sm font-bold text-sky-300">
              {bomSummary?.totalTrussM || 0} m
            </strong>
          </div>
        </div>

        <Button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold h-9 gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <span>Dalej: Podsumowanie</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
