"use client";

import React from "react";
import { JobScreenConfig } from "@/lib/mockData";
import { solveTrussSections } from "@/utils/trussCalc";
import { Box, Layers, ShieldCheck } from "lucide-react";

interface ScreenBOMSummaryCardProps {
  widthM: number;
  heightM: number;
  mountingType: JobScreenConfig["mountingType"];
  hoistType: "manual" | "electric";
  customTrussWidthM?: number;
  customTrussHeightM?: number;
  hoistSource?: "none" | "warehouse";
  hoistQty?: number;
  usePlates?: boolean;
}

export function ScreenBOMSummaryCard({
  widthM,
  heightM,
  mountingType,
  hoistType,
  customTrussWidthM,
  customTrussHeightM,
  hoistSource = "none",
  hoistQty = 2,
  usePlates = false,
}: ScreenBOMSummaryCardProps) {
  const cols = Math.max(1, Math.round(widthM / 0.5));
  const fullRows = Math.floor(heightM / 1.0);
  const halfRows = heightM % 1.0 >= 0.5 ? 1 : 0;

  const fullCabinets = cols * fullRows;
  const halfCabinets = cols * halfRows;
  const totalCabinets = fullCabinets + halfCabinets;

  // Obliczenia skrzyń transportowych (Math.ceil)
  const fullCases = Math.ceil(fullCabinets / 8);
  const halfCases = Math.ceil(halfCabinets / 8);
  const totalCases = fullCases + halfCases;

  const goalpostHeight = customTrussHeightM ?? Math.round((heightM + 1.0) * 10) / 10;
  const trussBeamWidth = customTrussWidthM ?? widthM;

  // Odcinki kratownicy dla bramki i kreski
  let trussSummary: string[] = [];
  if (mountingType === "bramka") {
    try {
      const beam = solveTrussSections(trussBeamWidth);
      const post = solveTrussSections(goalpostHeight);

      // Zliczanie sekcji: 1 belka + 2 słupy
      const counts: Record<number, number> = {};
      beam.sections.forEach((s) => (counts[s] = (counts[s] || 0) + 1));
      post.sections.forEach((s) => (counts[s] = (counts[s] || 0) + 2)); // ×2 słupy

      trussSummary = Object.entries(counts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([length, qty]) => `${qty}× ${length}m`);
    } catch {
      trussSummary = [`${trussBeamWidth + goalpostHeight * 2}m kratownicy`];
    }
  } else if (mountingType === "kreska") {
    try {
      const beam = solveTrussSections(trussBeamWidth);
      const counts: Record<number, number> = {};
      beam.sections.forEach((s) => (counts[s] = (counts[s] || 0) + 1));

      trussSummary = Object.entries(counts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([length, qty]) => `${qty}× ${length}m`);
    } catch {
      trussSummary = [`${trussBeamWidth}m kratownicy`];
    }
  }

  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-white">Zapotrzebowanie Magazynowe</h3>
        </div>
        <span className="text-[11px] font-mono text-purple-300 font-bold bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded-md">
          Łącznie {totalCases} case diody
        </span>
      </div>

      {/* Bento Grid 2x2 z metrykami skrzyń */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Moduły pełne 50x100 */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Dioda 50×100 cm</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              {fullCases}
            </span>
            <span className="text-xs text-slate-400 font-mono">case</span>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">
              ({fullCabinets} szt.)
            </span>
          </div>
        </div>

        {/* Połówki 50x50 */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Połówki 50×50 cm</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-purple-300 tabular-nums">
              {halfCases}
            </span>
            <span className="text-xs text-slate-400 font-mono">case</span>
            <span className="text-[10px] text-slate-500 font-mono ml-auto">
              ({halfCabinets} szt.)
            </span>
          </div>
        </div>
      </div>

      {/* Osprzęt konstrukcyjny i zawiesia */}
      <div className="p-3.5 rounded-lg bg-slate-900/40 border border-slate-800/80 space-y-2 text-xs">
        {/* Belki zawiesia: WYŁĄCZNIE dla bramki i kreski */}
        {(mountingType === "bramka" || mountingType === "kreska") && (
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Layers size={13} className="text-blue-400" /> Belki zawiesia (Hanging Bars)
            </span>
            <strong className="font-mono text-white text-[11px]">
              pokrycie {widthM.toFixed(1)}m ({cols} kolumn)
            </strong>
          </div>
        )}

        {mountingType === "bramka" && (
          <>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Odcinki kratownicy Q39:</span>
              <strong className="font-mono text-amber-300">
                {trussSummary.join(", ")}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Osprzęt bramki:</span>
              <span className="font-mono text-slate-300 text-[11px]">
                2 bazy, 2 czapki, 4 zastrzały, 4 pasy 5T
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Wciągarki bramki:</span>
              <strong className="font-mono text-emerald-300">
                2× {hoistType === "manual" ? "Ręczna 1T" : "Elektryczna D8+"}
              </strong>
            </div>
          </>
        )}

        {mountingType === "kreska" && (
          <>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Belka kratownicy Q39:</span>
              <strong className="font-mono text-amber-300">
                {trussSummary.join(", ")}
              </strong>
            </div>
            {hoistSource === "warehouse" ? (
              <>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Wciągarki z magazynu:</span>
                  <strong className="font-mono text-emerald-300">
                    {hoistQty}× {hoistType === "manual" ? "Ręczna 1T" : "Elektryczna D8+"}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Zawiesia Steelflex:</span>
                  <strong className="font-mono text-blue-300">
                    {hoistQty}× Steelflex 2m + {hoistQty * 2}× szekle 3.25T
                  </strong>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Wciągarki / podwieszenie:</span>
                <span className="font-mono text-slate-400 text-[11px] italic">
                  Obiektowe na scenie (brak w magazynie)
                </span>
              </div>
            )}
          </>
        )}

        {mountingType === "elki" && (
          <>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Podpory dolne:</span>
              <strong className="font-mono text-amber-300">
                {Math.ceil(cols / 2)} kpl. podpór eLki ze śrubami
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Blachy montażowe:</span>
              <strong className="font-mono text-emerald-300">
                kpl. do e-lek (~{Math.max(4, Math.ceil(cols / 2) * 2)} szt.)
              </strong>
            </div>
          </>
        )}

        {(mountingType === "bramka" || mountingType === "kreska") && usePlates && (
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">Blachy usztywniające:</span>
            <strong className="font-mono text-blue-300">
              pakiet ~{Math.max(4, (cols - 1) * Math.max(1, fullRows - 1))} szt. (naroża)
            </strong>
          </div>
        )}

        {mountingType === "brak" && (
          <div className="text-slate-500 text-[11px] italic">
            Brak konstrukcji nośnej – rezerwacja obejmuje wyłącznie kabinety diodowe.
          </div>
        )}
      </div>

      {/* Informacja o drobnym osprzęcie z presetu */}
      {mountingType !== "brak" && (
        <div className="text-[11px] text-slate-400 bg-slate-900/60 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2">
          <span className="text-blue-400 shrink-0 font-bold leading-none mt-0.5">ℹ</span>
          <span>
            Pozostały osprzęt montażowy (wkrętarka z nasadką, krzyże stężające, szekle) jest pobierany automatycznie z szablonu w Ustawieniach i będzie widoczny na liście sprzętu oraz w podsumowaniu.
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 bg-emerald-950/20 border border-emerald-500/20 rounded-lg px-3 py-2">
        <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
        <span>Kabinety i case&apos;y są automatycznie rezerwowane w bilansie zlecenia.</span>
      </div>
    </div>
  );
}
