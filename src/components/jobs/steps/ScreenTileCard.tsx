"use client";

import { JobScreenConfig } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ScreenTileCardProps {
  screen: JobScreenConfig;
  index: number;
  systemName?: string;
  onEdit: (screen: JobScreenConfig) => void;
  onRemove: (id: string) => void;
}

export function ScreenTileCard({
  screen,
  index,
  systemName = "Dicolor P3.9 Hybryda",
  onEdit,
  onRemove,
}: ScreenTileCardProps) {
  const area = (screen.widthM * screen.heightM).toFixed(1);
  const cols = Math.round(screen.widthM / 0.5);
  const fullRows = Math.floor(screen.heightM / 1.0);
  const hasHalf = screen.heightM % 1.0 >= 0.5;
  const fullCases = Math.ceil((cols * fullRows) / 8);
  const halfCases = hasHalf ? Math.ceil(cols / 8) : 0;
  const totalCases = fullCases + halfCases;
  const totalCabinets = cols * fullRows + (hasHalf ? cols : 0);
  const goalpostH = (screen.heightM + 1.0).toFixed(1);

  return (
    <div className="bg-[#121824] border border-slate-800/80 hover:border-slate-700/90 rounded-xl p-5 space-y-4 transition-all shadow-sm flex flex-col justify-between">
      <div className="space-y-3.5">
        {/* ─── GÓRNY PASEK: WYRÓŻNIONY SYSTEM/MODEL KABINETU I AKCJE ─── */}
        <div className="flex items-center justify-between gap-2">
          {/* Wyeksponowany model diody */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] animate-pulse" />
            <span className="truncate max-w-[210px]">{systemName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(screen)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-white rounded-lg"
              title="Edytuj ekran"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(screen.id)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 rounded-lg"
              title="Usuń ekran"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ─── NAZWA EKRANU & INDEKS ─── */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
            #{index + 1}
          </span>
          <h4 className="text-base font-bold text-white tracking-tight truncate">
            {screen.name}
          </h4>
        </div>

        {/* ─── HERO METRYKA: GŁÓWNY WYRÓŻNIONY ROZMIAR I METRAŻ ─── */}
        <div className="bg-[#0d121c] border border-slate-800/90 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">
              Wymiary Ekranu
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight flex items-baseline gap-1.5">
              <span>{screen.widthM}</span>
              <span className="text-slate-500 font-normal">×</span>
              <span>{screen.heightM}</span>
              <span className="text-sm font-semibold text-slate-400 font-sans ml-0.5">
                m
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">
              Metraż
            </span>
            <div className="text-base font-black font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-md">
              {area} m²
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-1">
              {totalCabinets} kabinetów
            </span>
          </div>
        </div>

        {/* ─── 2 KOLUMNY ZAPOTRZEBOWANIA (BEZ HANGING BARÓW) ─── */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Skrzynie Diody */}
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800/70 font-mono">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans font-semibold">
              Skrzynie (Case)
            </span>
            <strong className="text-base font-bold text-white mt-0.5 block">
              {totalCases} case
            </strong>
            <span className="text-[11px] text-slate-400 block truncate">
              {fullCases}W {halfCases > 0 ? `+ ${halfCases}P` : ""}
            </span>
          </div>

          {/* Konstrukcja Nośna */}
          <div className="p-3 rounded-lg bg-[#0d121c] border border-slate-800/70">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
              Konstrukcja
            </span>
            <strong
              className={`text-sm font-bold mt-1 block truncate ${
                screen.mountingType === "brak"
                  ? "text-slate-500 font-normal"
                  : "text-amber-300"
              }`}
            >
              {screen.mountingType === "bramka"
                ? `Bramka ${goalpostH}m`
                : screen.mountingType === "kreska"
                  ? "Kreska"
                  : screen.mountingType === "elki"
                    ? "eLki"
                    : "Brak konstrukcji"}
            </strong>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              {screen.mountingType === "bramka"
                ? "+1m bufora"
                : screen.mountingType === "brak"
                  ? "Sama dioda"
                  : "Standard"}
            </span>
          </div>
        </div>
      </div>

      {/* ─── DOLNY PASEK ─── */}
      <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 font-mono">
          Siatka: {cols} kol. × {fullRows + (hasHalf ? 0.5 : 0)} w.
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(screen)}
          className="h-7 px-2.5 text-xs border-slate-800 hover:border-slate-700 text-blue-400 hover:text-blue-300 rounded-lg gap-1"
        >
          Konfiguruj &gt;
        </Button>
      </div>
    </div>
  );
}
