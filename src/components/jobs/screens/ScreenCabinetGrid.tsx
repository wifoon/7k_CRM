"use client";

import React, { useState } from "react";
import { CabinetRowType } from "@/utils/screenCalc";
import { Split, Merge } from "lucide-react";

interface ScreenCabinetGridProps {
  columns: number;
  rows: CabinetRowType[];
  actualWidthM: number;
  actualHeightM: number;
  onToggleRow: (rowIndex: number) => void;
}

/**
 * ScreenCabinetGrid – Monolityczna siatka kabinetów LED bez zbędnych otoczek.
 * - Prawdziwe proporcje (pełne 1:2, połówki 1:1, flex 2:1)
 * - Brak zaokrągleń (rounded-none), stykające się moduły (gap-0)
 * - Szachownica odcieni ułatwiająca identyfikację modułów
 * - Kliknięcie w rząd: podział na 2 połówki lub scalenie w cały
 */
export function ScreenCabinetGrid({
  columns,
  rows,
  actualWidthM,
  actualHeightM,
  onToggleRow,
}: ScreenCabinetGridProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Zabezpieczenie liczby kolumn do renderowania w DOM
  const renderCols = Math.min(columns, 32);

  return (
    <div className="relative flex items-center justify-center w-full max-w-full px-2 py-4 select-none">
      <div
        className="relative w-full shadow-2xl flex flex-col transition-all duration-200"
        style={{
          minWidth: "240px",
          maxWidth: "720px",
          aspectRatio: `${Math.max(1, actualWidthM)} / ${Math.max(0.5, actualHeightM)}`,
        }}
      >
        {rows.map((rowType, rIdx) => {
          const isFull = rowType === "full";
          const hasAdjacentHalf =
            !isFull &&
            ((rIdx + 1 < rows.length && rows[rIdx + 1] === "half") ||
              (rIdx - 1 >= 0 && rows[rIdx - 1] === "half"));

          return (
            <div
              key={`row-${rIdx}-${rowType}`}
              onClick={() => onToggleRow(rIdx)}
              onMouseEnter={() => setHoveredRow(rIdx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{ flex: isFull ? 2 : 1 }}
              className={`group/row relative flex w-full cursor-pointer transition-all ${
                hoveredRow === rIdx
                  ? "ring-1 ring-blue-400/60 z-20 brightness-110"
                  : "z-10"
              }`}
              title={
                isFull
                  ? `Rząd ${rIdx + 1}: Pełne 50×100 cm (Kliknij, aby rozbić na 2× połówki 50×50)`
                  : hasAdjacentHalf
                  ? `Rząd ${rIdx + 1}: Połówka 50×50 cm (Kliknij, aby scalić w moduł 100cm)`
                  : `Rząd ${rIdx + 1}: Połówka 50×50 cm`
              }
            >
              {/* Kafelki kabinetów w rzędzie */}
              {Array.from({ length: renderCols }).map((_, cIdx) => {
                const isEvenTile = (rIdx + cIdx) % 2 === 0;

                return (
                  <div
                    key={`c-${cIdx}`}
                    className={`flex-1 h-full rounded-none border-[0.5px] border-slate-950/70 transition-colors flex items-center justify-center text-[9px] font-mono select-none ${
                      isFull
                        ? isEvenTile
                          ? "bg-blue-600 text-blue-200/50"
                          : "bg-blue-700/90 text-blue-200/40"
                        : isEvenTile
                        ? "bg-slate-800 text-slate-400 font-bold"
                        : "bg-slate-700/80 text-slate-400 font-bold"
                    }`}
                  >
                    {/* Wskaźnik typu kabinetu */}
                    {isFull ? (
                      <span className="opacity-0 group-hover/row:opacity-40 text-[8px] transition-opacity">
                        1.0
                      </span>
                    ) : (
                      <span className="text-[9px] tracking-tight">½</span>
                    )}
                  </div>
                );
              })}

              {/* Pływający wskaźnik akcji po najechaniu na rząd */}
              {hoveredRow === rIdx && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none z-30">
                  <div className="px-2 py-0.5 rounded bg-slate-950/90 border border-blue-500/50 text-[10px] font-sans font-semibold text-white shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                    {isFull ? (
                      <>
                        <Split className="w-3 h-3 text-blue-400" />
                        <span>Rozbij na połówki</span>
                      </>
                    ) : (
                      <>
                        <Merge className="w-3 h-3 text-purple-400" />
                        <span>{hasAdjacentHalf ? "Scal w cały 1.0m" : "Zmień na 1.0m"}</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
