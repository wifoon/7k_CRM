"use client";

import React from "react";
import { JobScreenConfig } from "@/lib/mockData";

interface ScreenPreviewCanvasProps {
  widthM: number;
  heightM: number;
  mountingType: JobScreenConfig["mountingType"];
  screenName: string;
  customTrussWidthM?: number;
  customTrussHeightM?: number;
}

export function ScreenPreviewCanvas({
  widthM,
  heightM,
  mountingType,
  screenName,
  customTrussWidthM,
  customTrussHeightM,
}: ScreenPreviewCanvasProps) {
  const cols = Math.max(1, Math.round(widthM / 0.5));
  const fullRows = Math.floor(heightM / 1.0);
  const hasHalfRow = heightM % 1.0 >= 0.5;
  const areaSqM = (widthM * heightM).toFixed(1);

  const beamWidthM = customTrussWidthM ?? widthM;
  const postHeightM = customTrussHeightM ?? Math.round((heightM + 1.0) * 10) / 10;

  // Ograniczenie renderowania kafelków, aby nie zwalniać DOM przy gigantycznych ekranach
  const renderCols = Math.min(cols, 24);
  const isTruncatedCols = cols > 24;

  const isBeamWider = beamWidthM > widthM;
  const overhangEachSideM = isBeamWider ? ((beamWidthM - widthM) / 2).toFixed(1) : null;

  return (
    <div className="relative w-full bg-[#0a0e17] border border-slate-800/80 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[360px] md:min-h-[440px] overflow-hidden select-none shadow-2xl">
      {/* Tło techniczne: subtelna siatka wektorowa */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Górny badge wymiaru szerokości */}
      <div className="z-10 mb-4 flex flex-wrap items-center justify-center gap-2">
        <div className="px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs font-mono font-semibold text-blue-300 shadow-lg flex items-center gap-2">
          <span>↔ Szerokość ekranu:</span>
          <strong className="text-white">{widthM.toFixed(1)} m</strong>
          <span className="text-slate-500 font-sans">({cols} kolumn)</span>
        </div>
        {mountingType === "bramka" && isBeamWider && (
          <div className="px-3 py-1 bg-amber-950/40 border border-amber-500/40 rounded-full text-[11px] font-mono text-amber-300 shadow-lg flex items-center gap-1.5">
            <span>Krata pozioma:</span>
            <strong className="text-white">{beamWidthM.toFixed(1)} m</strong>
            <span className="text-amber-400 font-sans">
              (+{overhangEachSideM}m z każdej strony)
            </span>
          </div>
        )}
      </div>

      {/* Kontener wizualizacji ekranu ze strukturą bramki */}
      <div className="relative z-10 flex items-center justify-center max-w-full w-full px-8 py-4">
        {/* Lewy słupek bramki */}
        {mountingType === "bramka" && (
          <div className="absolute left-1 sm:left-3 top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none">
            <div
              className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[9px] font-mono text-amber-300 shadow-sm"
              title="Czapka wciągarki"
            >
              ▲
            </div>
            <div className="w-2.5 flex-1 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-sm my-1 border border-slate-600/80 shadow-inner" />
            <div
              className="w-6 h-3 rounded-sm bg-slate-800 border border-slate-700 text-[8px] font-mono text-slate-400 flex items-center justify-center"
              title="Baza stalowa"
            >
              ■
            </div>
            <span className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-amber-400 whitespace-nowrap">
              Słup {postHeightM.toFixed(1)}m (+{(postHeightM - heightM).toFixed(1)}m)
            </span>
          </div>
        )}

        {/* Belka górna bramki */}
        {mountingType === "bramka" && (
          <div className="absolute -top-3 left-3 right-3 h-3.5 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-sm border border-slate-600/80 flex items-center justify-center shadow-md">
            <span className="text-[9px] font-mono font-semibold text-slate-200 tracking-wider">
              Krata pozioma: {beamWidthM.toFixed(1)}m
            </span>
          </div>
        )}

        {/* Belka zawiesia (Kreska) */}
        {mountingType === "kreska" && (
          <div className="absolute -top-3.5 left-4 right-4 h-3 bg-blue-600/30 border border-blue-500/70 rounded-full flex items-center justify-center">
            <span className="text-[9px] font-mono font-semibold text-blue-200">
              Belka podwieszana: {beamWidthM.toFixed(1)}m
            </span>
          </div>
        )}

        {/* Ekran LED – Siatka modułów kabinetowych */}
        <div
          className="relative rounded-xl border-2 border-blue-500/40 bg-slate-950 p-2 shadow-2xl shadow-blue-500/10 flex flex-col gap-1 transition-all duration-300 max-w-full"
          style={{
            minWidth: "220px",
            maxWidth: "680px",
            aspectRatio: `${Math.max(1, widthM)} / ${Math.max(0.6, heightM)}`,
          }}
        >
          {/* Pełne rzędy kabinetów (50×100 cm) */}
          {Array.from({ length: Math.max(1, fullRows) }).map((_, rIdx) => (
            <div key={`full-${rIdx}`} className="flex-1 flex gap-1 w-full">
              {Array.from({ length: renderCols }).map((_, cIdx) => (
                <div
                  key={`c-${cIdx}`}
                  className="flex-1 rounded-sm bg-[#131b2c] border border-blue-500/20 hover:border-blue-400 transition-colors flex items-center justify-center text-[9px] font-mono text-slate-500/80 shadow-sm"
                  title={`Kabinet 50×100 cm [Kolumna ${cIdx + 1}, Rząd ${rIdx + 1}]`}
                >
                  <span className="opacity-0 md:opacity-40 hover:opacity-100">1.0</span>
                </div>
              ))}
            </div>
          ))}

          {/* Rząd połówek kabinetów (50×50 cm) na dole */}
          {hasHalfRow && (
            <div className="h-1/3 flex gap-1 w-full">
              {Array.from({ length: renderCols }).map((_, cIdx) => (
                <div
                  key={`half-${cIdx}`}
                  className="flex-1 rounded-sm bg-purple-950/30 border border-purple-500/30 hover:border-purple-400 transition-colors flex items-center justify-center text-[8px] font-mono text-purple-400 font-bold shadow-sm"
                  title={`Połówka 50×50 cm [Kolumna ${cIdx + 1}]`}
                >
                  <span>½</span>
                </div>
              ))}
            </div>
          )}

          {/* Podpory dolne (eLki) pod ekranem */}
          {mountingType === "elki" && (
            <div className="absolute -bottom-4 left-6 right-6 flex justify-around pointer-events-none">
              {Array.from({ length: Math.min(8, Math.ceil(cols / 2)) }).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 border-l-2 border-b-2 border-amber-500/60 rotate-45"
                  title="Podpora dolna eLka"
                />
              ))}
            </div>
          )}
        </div>

        {/* Prawy słupek bramki */}
        {mountingType === "bramka" && (
          <div className="absolute right-1 sm:right-3 top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none">
            <div
              className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[9px] font-mono text-amber-300 shadow-sm"
              title="Czapka wciągarki"
            >
              ▲
            </div>
            <div className="w-2.5 flex-1 bg-gradient-to-b from-slate-700 via-slate-600 to-slate-700 rounded-sm my-1 border border-slate-600/80 shadow-inner" />
            <div
              className="w-6 h-3 rounded-sm bg-slate-800 border border-slate-700 text-[8px] font-mono text-slate-400 flex items-center justify-center"
              title="Baza stalowa"
            >
              ■
            </div>
          </div>
        )}
      </div>

      {/* Dolny pasek metryk z wysokością i powierzchnią */}
      <div className="z-10 mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
        <div className="px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-purple-300 shadow-md">
          <span>↕ Wysokość ekranu: </span>
          <strong className="text-white">{heightM.toFixed(1)} m</strong>
          <span className="text-slate-500 font-sans ml-1">
            ({fullRows} pełnych {hasHalfRow ? "+ 1 połówka" : ""})
          </span>
        </div>
        <div className="px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-emerald-300 shadow-md">
          <span>Powierzchnia: </span>
          <strong className="text-white">{areaSqM} m²</strong>
        </div>
        {isTruncatedCols && (
          <div className="text-[10px] text-slate-500">
            *Podgląd wyskalowany do 24 kolumn
          </div>
        )}
      </div>
    </div>
  );
}
