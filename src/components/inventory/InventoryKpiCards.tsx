"use client";

import { useMemo } from "react";
import {
  ArrowDownToLine,
  TrendingUp,
  Wrench,
  AlertTriangle,
} from "lucide-react";
import { EquipmentItem } from "@/lib/mockData";
import { useInventory } from "@/hooks/useInventory";

interface InventoryKpiCardsProps {
  items: EquipmentItem[];
}

export function InventoryKpiCards({ items }: InventoryKpiCardsProps) {
  const { statusFilter, setStatusFilter } = useInventory();

  const totalQty = useMemo(
    () => items.reduce((acc, i) => acc + i.totalQty, 0),
    [items],
  );
  const availableQty = useMemo(
    () => items.reduce((acc, i) => acc + i.availableQty, 0),
    [items],
  );
  const serviceQty = useMemo(
    () => items.reduce((acc, i) => acc + i.serviceQty, 0),
    [items],
  );
  const inFieldQty = Math.max(0, totalQty - availableQty - serviceQty);

  const lowStockCount = items.filter(
    (i) => i.availableQty > 0 && i.availableQty <= Math.ceil(i.totalQty * 0.2),
  ).length;
  const outOfStockCount = items.filter((i) => i.availableQty === 0).length;
  const alertCount = lowStockCount + outOfStockCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Na magazynie (Dostępne) */}
      <button
        type="button"
        onClick={() =>
          setStatusFilter(statusFilter === "dostepny" ? "all" : "dostepny")
        }
        className={`bg-[#121824] border rounded-xl p-4.5 text-left transition-all cursor-pointer ${
          statusFilter === "dostepny"
            ? "border-blue-500/60 ring-1 ring-blue-500/30 bg-blue-950/20"
            : "border-slate-800/80 hover:border-slate-700/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <ArrowDownToLine className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            Dostępne
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {availableQty}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Na Magazynie
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            Fizycznie wolne skrzynie / szt.
          </span>
        </div>
      </button>

      {/* 2. W terenie (Na realizacjach) */}
      <button
        type="button"
        onClick={() =>
          setStatusFilter(statusFilter === "w_terenie" ? "all" : "w_terenie")
        }
        className={`bg-[#121824] border rounded-xl p-4.5 text-left transition-all cursor-pointer ${
          statusFilter === "w_terenie"
            ? "border-blue-500/60 ring-1 ring-blue-500/30 bg-blue-950/20"
            : "border-slate-800/80 hover:border-slate-700/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            W trasie
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {inFieldQty}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            W Terenie (Zlecenia)
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            Zarezerwowane na realizacjach
          </span>
        </div>
      </button>

      {/* 3. W serwisie */}
      <button
        type="button"
        onClick={() =>
          setStatusFilter(statusFilter === "serwis" ? "all" : "serwis")
        }
        className={`bg-[#121824] border rounded-xl p-4.5 text-left transition-all cursor-pointer ${
          statusFilter === "serwis"
            ? "border-blue-500/60 ring-1 ring-blue-500/30 bg-blue-950/20"
            : "border-slate-800/80 hover:border-slate-700/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            Naprawy
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {serviceQty}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            W Serwisie
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            {serviceQty > 0 ? "Wyłączone z rezerwacji" : "Wszystko sprawne"}
          </span>
        </div>
      </button>

      {/* 4. Niski stan / Braki */}
      <button
        type="button"
        onClick={() =>
          setStatusFilter(statusFilter === "alert" ? "all" : "alert")
        }
        className={`bg-[#121824] border rounded-xl p-4.5 text-left transition-all cursor-pointer ${
          statusFilter === "alert"
            ? "border-blue-500/60 ring-1 ring-blue-500/30 bg-blue-950/20"
            : "border-slate-800/80 hover:border-slate-700/80"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded-full font-mono">
            Alerty
          </span>
        </div>
        <div className="mt-3">
          <span className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
            {alertCount}
          </span>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Niski Stan / Braki
          </p>
          <span className="text-[11px] text-slate-500 block mt-1 font-mono">
            {alertCount > 0
              ? `${outOfStockCount} braków • ${lowStockCount} niski stan`
              : "Stany w normie"}
          </span>
        </div>
      </button>
    </div>
  );
}
