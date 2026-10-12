"use client";

import React from "react";
import { Monitor, Grid3X3, Maximize2, Layers } from "lucide-react";

interface ScreenCanvasMetricsBarProps {
  widthM: number;
  heightM: number;
  fullCabinets: number;
  halfCabinets: number;
  pixelWidth: number;
  pixelHeight: number;
  areaSqM: number;
}

/**
 * Pasek metryk technicznych na dole podglądu ekranu LED:
 * 1. Wymiary w metrach
 * 2. Liczba kabinetów (całe + połówki)
 * 3. Rozdzielczość w pikselach (px)
 * 4. Powierzchnia w m²
 */
export function ScreenCanvasMetricsBar({
  widthM,
  heightM,
  fullCabinets,
  halfCabinets,
  pixelWidth,
  pixelHeight,
  areaSqM,
}: ScreenCanvasMetricsBarProps) {
  const totalCabinets = fullCabinets + halfCabinets;

  return (
    <div className="z-10 mt-5 w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-mono">
      {/* 1. Wymiary w metrach */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 shadow-sm flex items-center gap-2">
        <Maximize2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-slate-400">Wymiary:</span>
        <strong className="text-white font-bold">
          {widthM.toFixed(1)}m × {heightM.toFixed(1)}m
        </strong>
      </div>

      {/* 2. Liczba kabinetów */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 shadow-sm flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
        <span className="text-slate-400">Kabinety:</span>
        <strong className="text-white font-bold">{totalCabinets} szt.</strong>
        <span className="text-[11px] text-slate-500 font-sans">
          ({fullCabinets} całych{halfCabinets > 0 ? ` + ${halfCabinets} połówek` : ""})
        </span>
      </div>

      {/* 3. Rozdzielczość w pikselach */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 shadow-sm flex items-center gap-2">
        <Monitor className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span className="text-slate-400">Rozdzielczość:</span>
        <strong className="text-emerald-300 font-bold">
          {pixelWidth} × {pixelHeight} px
        </strong>
      </div>

      {/* 4. Powierzchnia w m² */}
      <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 shadow-sm flex items-center gap-2">
        <Grid3X3 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-slate-400">Powierzchnia:</span>
        <strong className="text-amber-300 font-bold">{areaSqM.toFixed(1)} m²</strong>
      </div>
    </div>
  );
}
