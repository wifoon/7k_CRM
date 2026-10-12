"use client";

import React from "react";
import {
  screenToCases,
  generateDefaultRows,
  toggleRowSplit,
  CabinetRowType,
  ScreenMatrixMode,
} from "@/utils/screenCalc";
import { EquipmentItem } from "@/lib/mockData";
import { ScreenCabinetGrid } from "./ScreenCabinetGrid";
import { ScreenCanvasMetricsBar } from "./ScreenCanvasMetricsBar";
import { RotateCcw } from "lucide-react";

interface ScreenPreviewCanvasProps {
  widthM: number;
  heightM: number;
  screenName: string;
  customRows?: CabinetRowType[];
  matrixMode?: ScreenMatrixMode;
  onChangeCustomRows?: (rows: CabinetRowType[]) => void;
  onChangeMatrixMode?: (mode: ScreenMatrixMode) => void;
  fullEquipment?: EquipmentItem;
  halfEquipment?: EquipmentItem;
}

/**
 * ScreenPreviewCanvas – Zrekonstruowany podgląd graficzny ekranu LED.
 * 1. Usunięto konstrukcje nośne (same kabinety)
 * 2. Złączone prostokątne moduły bez zaokrągleń
 * 3. Proporcje fizyczne (pełne 100cm i połówki 50cm)
 * 4. Szachownica odcieni + hierarchia kolorów (Electric Tech Blue dla całych)
 * 5. Pasek metryk z wymiarami, ilością, pikselami i m²
 * 6. Dowolność konfiguracji rzędów i klikanie w rzędy
 */
export function ScreenPreviewCanvas({
  widthM,
  heightM,
  screenName,
  customRows,
  matrixMode = "hybrid",
  onChangeCustomRows,
  onChangeMatrixMode,
  fullEquipment,
  halfEquipment,
}: ScreenPreviewCanvasProps) {
  const fullW = fullEquipment?.attributes?.widthCm || 50;
  const fullH = fullEquipment?.attributes?.heightCm || 100;
  const halfH = halfEquipment?.attributes?.heightCm || 50;
  const resX = fullEquipment?.attributes?.resolutionX || 128;
  const resYFull = fullEquipment?.attributes?.resolutionY || 256;
  const resYHalf = halfEquipment?.attributes?.resolutionY || 128;

  // Obliczenia parametrów ekranu i rozdzielczości
  const screenData = screenToCases({
    widthM,
    heightM,
    cabinetWidthCm: fullW,
    cabinetHeightCm: fullH,
    halfHeightCm: halfH,
    cabinetsPerCaseFull: fullEquipment?.attributes?.cabinetsPerCase || 8,
    cabinetsPerCaseHalf: halfEquipment?.attributes?.cabinetsPerCase || 8,
    matrixMode,
    customRows,
    resolutionX: resX,
    resolutionYFull: resYFull,
    resolutionYHalf: resYHalf,
  });

  const handleToggleRow = (index: number) => {
    if (!onChangeCustomRows) return;
    const nextRows = toggleRowSplit(screenData.rows, index);
    onChangeCustomRows(nextRows);
  };

  const handleSetMode = (nextMode: ScreenMatrixMode) => {
    onChangeMatrixMode?.(nextMode);
    if (onChangeCustomRows) {
      const nextRows = generateDefaultRows(heightM, fullH / 100, halfH / 100, nextMode);
      onChangeCustomRows(nextRows);
    }
  };

  const isCustomized =
    customRows &&
    JSON.stringify(customRows) !==
      JSON.stringify(generateDefaultRows(heightM, fullH / 100, halfH / 100, "hybrid"));

  return (
    <div className="relative w-full bg-[#0a0e17] border border-slate-800/80 rounded-xl p-5 sm:p-6 flex flex-col items-center justify-between min-h-[380px] md:min-h-[460px] overflow-hidden select-none shadow-2xl">
      {/* Tło techniczne: subtelna siatka wektorowa */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Górny pasek sterowania kompozycją (Tryby / Reset rzędów) */}
      <div className="z-10 w-full flex flex-wrap items-center justify-between gap-2.5 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Podgląd matrycy:
          </span>
          <span className="text-xs font-mono text-blue-400 font-semibold">
            {screenName || "Ekran LED"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => handleSetMode("hybrid")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              matrixMode === "hybrid" && !isCustomized
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Auto-Hybryda
          </button>
          <button
            type="button"
            onClick={() => handleSetMode("half_only")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              matrixMode === "half_only"
                ? "bg-purple-600 text-white shadow-sm"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Same połówki 50×50
          </button>
          {isCustomized && (
            <button
              type="button"
              onClick={() => handleSetMode("hybrid")}
              className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
              title="Przywróć domyślny podział rzędów"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resetuj rzędy</span>
            </button>
          )}
        </div>
      </div>

      {/* Środek: Siatka połączonych modułów kabinetowych */}
      <ScreenCabinetGrid
        columns={screenData.columns}
        rows={screenData.rows}
        actualWidthM={screenData.widthM}
        actualHeightM={screenData.heightM}
        onToggleRow={handleToggleRow}
      />

      {/* Dół: Zintegrowany pasek metryk z rozdzielczością i powierzchnią */}
      <ScreenCanvasMetricsBar
        widthM={screenData.widthM}
        heightM={screenData.heightM}
        fullCabinets={screenData.fullCabinets}
        halfCabinets={screenData.halfCabinets}
        pixelWidth={screenData.pixelWidth}
        pixelHeight={screenData.pixelHeight}
        areaSqM={screenData.areaSqM}
      />
    </div>
  );
}
