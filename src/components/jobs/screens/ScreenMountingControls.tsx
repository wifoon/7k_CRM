"use client";

import React from "react";
import { JobScreenConfig } from "@/lib/mockData";
import {
  Construction,
  Minus,
  Layers,
  Ban,
  Zap,
  Wrench,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { calculateReinforcementPlates } from "@/utils/screenCalc";

interface ScreenMountingControlsProps {
  mountingType: JobScreenConfig["mountingType"];
  hoistType: "manual" | "electric";
  widthM: number;
  heightM: number;
  customTrussWidthM?: number;
  customTrussHeightM?: number;
  hoistSource?: "none" | "warehouse";
  hoistQty?: number;
  usePlates?: boolean;
  onChangeMountingType: (type: JobScreenConfig["mountingType"]) => void;
  onChangeHoistType: (type: "manual" | "electric") => void;
  onChangeCustomTrussWidthM: (w: number | undefined) => void;
  onChangeCustomTrussHeightM: (h: number | undefined) => void;
  onChangeHoistSource?: (source: "none" | "warehouse") => void;
  onChangeHoistQty?: (qty: number) => void;
  onChangeUsePlates?: (val: boolean) => void;
}

export function ScreenMountingControls({
  mountingType,
  hoistType,
  widthM,
  heightM,
  customTrussWidthM,
  customTrussHeightM,
  hoistSource = "none",
  hoistQty = 2,
  usePlates,
  onChangeMountingType,
  onChangeHoistType,
  onChangeCustomTrussWidthM,
  onChangeCustomTrussHeightM,
  onChangeHoistSource,
  onChangeHoistQty,
  onChangeUsePlates,
}: ScreenMountingControlsProps) {
  const minPostHeight = Math.round((heightM + 1.0) * 10) / 10;
  const currentBeamWidth = customTrussWidthM ?? widthM;
  const currentPostHeight = customTrussHeightM ?? minPostHeight;

  const cols = Math.max(1, Math.round(widthM / 0.5));
  const fullRows = Math.floor(heightM / 1.0);
  const halfRows = heightM % 1.0 >= 0.5 ? 1 : 0;
  const totalRows = fullRows + halfRows;
  const reinforcementPlatesQty = calculateReinforcementPlates(cols, totalRows);

  const isCustomBeam = customTrussWidthM !== undefined && customTrussWidthM !== widthM;
  const isCustomPost = customTrussHeightM !== undefined && customTrussHeightM !== minPostHeight;

  const stepBeam = (delta: number) => {
    const next = Math.max(1.0, Math.round((currentBeamWidth + delta) * 2) / 2);
    onChangeCustomTrussWidthM(next === widthM ? undefined : next);
  };

  const stepPost = (delta: number) => {
    const next = Math.max(1.0, Math.round((currentPostHeight + delta) * 2) / 2);
    onChangeCustomTrussHeightM(next === minPostHeight ? undefined : next);
  };

  const MOUNTING_OPTIONS = [
    {
      type: "bramka" as const,
      icon: Construction,
      label: "Bramka",
      desc: `Słupy ${currentPostHeight.toFixed(1)}m`,
    },
    {
      type: "kreska" as const,
      icon: Minus,
      label: "Kreska",
      desc: "Belka podwieszana",
    },
    {
      type: "elki" as const,
      icon: Layers,
      label: "eLki",
      desc: "Podłogowa / Stacking",
    },
    {
      type: "brak" as const,
      icon: Ban,
      label: "Brak",
      desc: "Sama dioda LED",
    },
  ];

  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Construction className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Konstrukcja Nośna & Montaż</h3>
        </div>
      </div>

      {/* Wybór sposobu montażu */}
      <div className="grid grid-cols-2 gap-2.5">
        {MOUNTING_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = mountingType === opt.type;
          const isBrak = opt.type === "brak";

          let selectedClasses = "bg-amber-500/10 border-amber-500/80 text-white ring-1 ring-amber-500/40 shadow-lg shadow-amber-500/10";
          let dotClasses = "bg-amber-400 shadow-sm shadow-amber-400";
          let iconColor = isSelected ? "text-amber-400" : "text-slate-400";

          if (isBrak && isSelected) {
            selectedClasses = "bg-slate-800/80 border-slate-600 text-slate-200 ring-1 ring-slate-500/40 shadow-sm";
            dotClasses = "bg-slate-400 shadow-sm shadow-slate-400";
            iconColor = "text-slate-300";
          }

          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onChangeMountingType(opt.type)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? selectedClasses
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                {isSelected && (
                  <span className={`w-2 h-2 rounded-full ${dotClasses}`} />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">{opt.label}</span>
                <span className="text-[10px] text-slate-500 block truncate">{opt.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dostosowanie wymiarów kratownicy (Bramka / Kreska) */}
      {(mountingType === "bramka" || mountingType === "kreska") && (
        <div className="pt-3 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal size={13} className="text-amber-400" />
              Wymiary kratownicy (dostosowanie)
            </span>
            {(isCustomBeam || isCustomPost) && (
              <button
                type="button"
                onClick={() => {
                  onChangeCustomTrussWidthM(undefined);
                  onChangeCustomTrussHeightM(undefined);
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={10} /> Dopasuj do ekranu
              </button>
            )}
          </div>

          {/* Długość belki poziomej */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label className="text-slate-300 text-xs">Belka pozioma kraty</Label>
              <span className="font-mono text-[11px] text-slate-400">
                {currentBeamWidth > widthM
                  ? `+${(currentBeamWidth - widthM).toFixed(1)}m szersza niż ekran`
                  : currentBeamWidth < widthM
                  ? `⚠️ krótsza niż ekran`
                  : `równa szerokości ekranu`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepBeam(-0.5)}
                className="h-8 w-8 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                -
              </button>
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={currentBeamWidth}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || widthM;
                    onChangeCustomTrussWidthM(val === widthM ? undefined : val);
                  }}
                  className="h-8 text-center font-mono text-xs pr-6 rounded-lg"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
                  m
                </span>
              </div>
              <button
                type="button"
                onClick={() => stepBeam(0.5)}
                className="h-8 w-8 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Wysokość słupów bramki */}
          {mountingType === "bramka" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <Label className="text-slate-300 text-xs">Słupy pionowe bramki</Label>
                <span className="font-mono text-[11px] text-slate-400">
                  {currentPostHeight < minPostHeight ? (
                    <span className="text-rose-400">⚠️ za nisko (min. {minPostHeight}m)</span>
                  ) : currentPostHeight > minPostHeight ? (
                    <span className="text-amber-400">
                      +{(currentPostHeight - heightM).toFixed(1)}m nad ekranem
                    </span>
                  ) : (
                    <span>standard: {minPostHeight}m (+1.0m bufor)</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepPost(-0.5)}
                  className="h-8 w-8 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    step="0.5"
                    min="1.0"
                    value={currentPostHeight}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || minPostHeight;
                      onChangeCustomTrussHeightM(val === minPostHeight ? undefined : val);
                    }}
                    className="h-8 text-center font-mono text-xs pr-6 rounded-lg"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
                    m
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => stepPost(0.5)}
                  className="h-8 w-8 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Podopcje dla Bramki: Wciągarki (stałe 2 szt.) */}
      {mountingType === "bramka" && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2 animate-in fade-in duration-150">
          <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Wciągarki bramki (2 szt. na słupy)
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeHoistType("manual")}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                hoistType === "manual"
                  ? "bg-blue-600/20 border-blue-500 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Wrench size={13} className="text-blue-400" />
              <span>Ręczna 1T (2 szt.)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeHoistType("electric")}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                hoistType === "electric"
                  ? "bg-amber-600/20 border-amber-500 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Zap size={13} className="text-amber-400" />
              <span>Elektryczna D8+ (2 szt.)</span>
            </button>
          </div>
        </div>
      )}

      {/* Podopcje dla Kreski: Wciągarki obiektowe vs własne z magazynu (+ Steelflexy) */}
      {mountingType === "kreska" && (
        <div className="pt-2 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-150">
          <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Wciągarki do podwieszenia belki
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeHoistSource?.("none")}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                hoistSource === "none"
                  ? "bg-blue-600/20 border-blue-500 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xs font-bold block">Obiektowe / Scena</span>
              <span className="text-[10px] text-slate-500 block truncate">
                Są na obiekcie (brak w magazynie)
              </span>
            </button>
            <button
              type="button"
              onClick={() => onChangeHoistSource?.("warehouse")}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                hoistSource === "warehouse"
                  ? "bg-amber-600/20 border-amber-500 text-white"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-xs font-bold block">Własne z magazynu</span>
              <span className="text-[10px] text-slate-500 block truncate">
                Wciągarki + Steelflexy
              </span>
            </button>
          </div>

          {/* Konfiguracja własnych wciągarek i zawiesi Steelflex */}
          {hoistSource === "warehouse" && (
            <div className="space-y-2.5 pt-1 bg-slate-900/40 border border-slate-800/90 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Liczba punktów (wciągarek):</span>
                <div className="flex items-center gap-1.5">
                  {[2, 3, 4].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => onChangeHoistQty?.(qty)}
                      className={`h-7 px-2.5 rounded-md text-xs font-mono font-bold transition-all cursor-pointer ${
                        hoistQty === qty
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {qty} szt.
                    </button>
                  ))}
                </div>
              </div>

              {/* Informacja: ile wciągarek = tyle steelflexów */}
              <div className="text-[11px] font-mono text-blue-300 bg-blue-950/40 border border-blue-500/30 rounded-md px-2.5 py-1 flex items-center justify-between">
                <span>Zawiesia Steelflex:</span>
                <strong className="text-white">{hoistQty} szt. (1:1 z wciągarkami)</strong>
              </div>

              {/* Typ wciągarki */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onChangeHoistType("manual")}
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    hoistType === "manual"
                      ? "bg-blue-600/20 border-blue-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Wrench size={12} className="text-blue-400" />
                  <span>Ręczne 1T</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeHoistType("electric")}
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    hoistType === "electric"
                      ? "bg-amber-600/20 border-amber-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <Zap size={12} className="text-amber-400" />
                  <span>Elektryczne D8+</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blachy montażowe dla eLek (zawsze w zestawie) */}
      {mountingType === "elki" && (
        <div className="pt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">Blachy do łączenia e-lek:</span>
            <span className="font-mono text-emerald-400 font-semibold text-[11px]">
              W zestawie (automatycznie)
            </span>
          </div>
        </div>
      )}

      {/* Blachy usztywniające (Outdoor / Wiatr) dla Bramki i Kreski */}
      {(mountingType === "bramka" || mountingType === "kreska") && (
        <div className="pt-2 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label htmlFor="plates-switch" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Blachy usztywniające (Outdoor / Wiatr)
                </Label>
                {usePlates && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 px-1.5 font-mono text-blue-400 border-blue-500/30 bg-blue-500/10"
                  >
                    {reinforcementPlatesQty} szt. ({Math.max(0, cols - 1)} × {Math.max(0, totalRows - 1)})
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Wzmocnienie łączeń naroży kabinetów przy silnym wietrze
              </p>
            </div>
            <Switch
              id="plates-switch"
              checked={!!usePlates}
              onCheckedChange={(val) => onChangeUsePlates?.(val)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
