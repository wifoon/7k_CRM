"use client";

import React from "react";
import { Plus, Minus, Maximize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/useSettings";

interface ScreenDimensionControlsProps {
  widthM: number;
  heightM: number;
  onChangeWidth: (w: number) => void;
  onChangeHeight: (h: number) => void;
}

export function ScreenDimensionControls({
  widthM,
  heightM,
  onChangeWidth,
  onChangeHeight,
}: ScreenDimensionControlsProps) {
  const { screenPresets } = useSettings();
  const stepWidth = (delta: number) => {
    const next = Math.max(1.0, Math.round((widthM + delta) * 2) / 2);
    onChangeWidth(next);
  };

  const stepHeight = (delta: number) => {
    const next = Math.max(1.0, Math.round((heightM + delta) * 2) / 2);
    onChangeHeight(next);
  };

  const currentArea = (widthM * heightM).toFixed(1);
  const currentRatio = (widthM / heightM).toFixed(2);

  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Wymiary & Presety Ekranu</h3>
        </div>
        <span className="text-xs font-mono font-medium text-slate-400">
          Proporcje: <strong className="text-blue-300 font-mono">{currentRatio}:1</strong> • Powierzchnia:{" "}
          <strong className="text-white font-mono">{currentArea} m²</strong>
        </span>
      </div>

      {/* Szybkie presety rozmiarów */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Standardowe formaty sceniczne
        </span>
        <div className="flex flex-wrap gap-2">
          {screenPresets.map((p) => {
            const isMatch = widthM === p.w && heightM === p.h;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  onChangeWidth(p.w);
                  onChangeHeight(p.h);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isMatch
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 ring-1 ring-blue-400"
                    : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[10px] opacity-60 font-sans">({p.ratio})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sterowanie krokowe (stepper) i inputy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Szerokość */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-slate-300">
              Szerokość (oś X)
            </Label>
            <span className="text-xs font-mono text-blue-400">
              {Math.round(widthM / 0.5)} modułów (kolumn)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stepWidth(-0.5)}
              disabled={widthM <= 1.0}
              className="h-10 w-10 shrink-0 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="-0.5m (1 moduł)"
            >
              <Minus size={16} />
            </button>
            <div className="relative flex-1">
              <Input
                type="number"
                step="0.5"
                min="1.0"
                value={widthM}
                onChange={(e) => onChangeWidth(Math.max(1.0, parseFloat(e.target.value) || 1.0))}
                className="h-10 text-center font-mono font-bold text-base pr-8 rounded-lg"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
                m
              </span>
            </div>
            <button
              type="button"
              onClick={() => stepWidth(0.5)}
              className="h-10 w-10 shrink-0 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="+0.5m (1 moduł)"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Wysokość */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-slate-300">
              Wysokość (oś Y)
            </Label>
            <span className="text-xs font-mono text-purple-400">
              {Math.floor(heightM / 1.0)} pełnych {heightM % 1.0 >= 0.5 ? "+ 1 połówka" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stepHeight(-0.5)}
              disabled={heightM <= 1.0}
              className="h-10 w-10 shrink-0 bg-slate-900/80 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="-0.5m (połówka lub pełny)"
            >
              <Minus size={16} />
            </button>
            <div className="relative flex-1">
              <Input
                type="number"
                step="0.5"
                min="1.0"
                value={heightM}
                onChange={(e) => onChangeHeight(Math.max(1.0, parseFloat(e.target.value) || 1.0))}
                className="h-10 text-center font-mono font-bold text-base pr-8 rounded-lg"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500 pointer-events-none">
                m
              </span>
            </div>
            <button
              type="button"
              onClick={() => stepHeight(0.5)}
              className="h-10 w-10 shrink-0 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="+0.5m (połówka lub pełny)"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
