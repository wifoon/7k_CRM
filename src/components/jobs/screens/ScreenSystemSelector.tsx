"use client";

import React from "react";
import { LedSystem } from "@/lib/mockData";
import { Tv, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScreenSystemSelectorProps {
  name: string;
  systemId: string;
  ledSystems: LedSystem[];
  onChangeName: (val: string) => void;
  onChangeSystemId: (val: string) => void;
}

export function ScreenSystemSelector({
  name,
  systemId,
  ledSystems,
  onChangeName,
  onChangeSystemId,
}: ScreenSystemSelectorProps) {
  return (
    <div className="bg-[#111622] border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Tv className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-white">System LED & Identyfikacja</h3>
      </div>

      {/* Nazwa ekranu */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-300">
          Nazwa ekranu na scenie
        </Label>
        <Input
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="np. Ekran Główny Scena, Boczne IMAG, Reżyserka..."
          className="h-10 text-sm rounded-lg"
        />
      </div>

      {/* Wybór modelu diody */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-300 block">
          Model modułu LED
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {ledSystems.map((sys) => {
            const isSelected = systemId === sys.id;
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => onChangeSystemId(sys.id)}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-purple-950/25 border-purple-500 text-white ring-1 ring-purple-500/40 shadow-md shadow-purple-500/10"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{sys.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Hybryda: 50×100 cm (pełny) + 50×50 cm (połówka)
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
